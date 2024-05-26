import { BadRequestError } from "../_errors/bad-request-error";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { FastifyInstance } from "fastify";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { z } from "zod";

export async function createAccount(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/users",
		{
			schema: {
				body: z.object({
					name: z.string(),
					email: z.string().email(),
					password: z.string().min(6),
				}),
			},
		},
		async (request, reply) => {
			const { name, email, password } = request.body;

			const userWithTheSameEmail = await prisma.user.findUnique({
				where: { email },
			});

			if (userWithTheSameEmail) {
				throw new BadRequestError("User with same e-mail already exists.");
			}

			const [_, domain] = email.split("@");

			const autoJoinOrganization = await prisma.organization.findFirst({
				where: {
					domain,
					shouldAttachUsersByDomain: true,
				},
			});

			const passwordHash = await hash(password, 6);

			await prisma.user.create({
				data: {
					name,
					email,
					passwordHash,
					member_on: autoJoinOrganization
						? {
								create: {
									organizationId: autoJoinOrganization.id,
								},
							}
						: undefined,
				},
			});

			return reply.status(201).send("Created!");
		}
	);
}
