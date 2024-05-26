import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
	await prisma.organization.deleteMany();
	await prisma.user.deleteMany();

	const passwordHash = await hash("123456", 1);

	const user = await prisma.user.create({
		data: {
			name: "John Joe",
			email: "john@example.com",
			avatarUrl: "http://github.com/lourencohenri.png",
			passwordHash,
		},
	});

	const anotherUser1 = await prisma.user.create({
		data: {
			name: faker.person.fullName(),
			email: faker.internet.email(),
			avatarUrl: faker.image.avatarGitHub(),
			passwordHash,
		},
	});

	const anotherUser2 = await prisma.user.create({
		data: {
			name: faker.person.fullName(),
			email: faker.internet.email(),
			avatarUrl: faker.image.avatarGitHub(),
			passwordHash,
		},
	});

	await prisma.organization.create({
		data: {
			name: "Lourenço Inc (Admin)",
			domain: "lourenco.com",
			slug: "lourenco-admin",
			avatarUrl: faker.image.avatarGitHub(),
			shouldAttachUsersByDomain: true,
			ownerId: user.id,
			projects: {
				createMany: {
					data: [
						{
							name: faker.lorem.words(5),
							slug: faker.lorem.slug(5),
							description: faker.lorem.paragraph(),
							avatarUrl: faker.image.avatarGitHub(),
							ownerId: faker.helpers.arrayElement([
								user.id,
								anotherUser1.id,
								anotherUser2.id,
							]),
						},
						{
							name: faker.lorem.words(5),
							slug: faker.lorem.slug(5),
							description: faker.lorem.paragraph(),
							avatarUrl: faker.image.avatarGitHub(),
							ownerId: faker.helpers.arrayElement([
								user.id,
								anotherUser1.id,
								anotherUser2.id,
							]),
						},
						{
							name: faker.lorem.words(5),
							slug: faker.lorem.slug(5),
							description: faker.lorem.paragraph(),
							avatarUrl: faker.image.avatarGitHub(),
							ownerId: faker.helpers.arrayElement([
								user.id,
								anotherUser1.id,
								anotherUser2.id,
							]),
						},
					],
				},
			},
			members: {
				createMany: {
					data: [
						{
							userId: user.id,
							role: "ADMIN",
						},
						{
							userId: anotherUser1.id,
							role: "MEMBER",
						},
						{
							userId: anotherUser2.id,
							role: "MEMBER",
						},
					],
				},
			},
		},
	});

	await prisma.organization.create({
		data: {
			name: "Lourenço Inc (Member)",
			slug: "lourenco-member",
			avatarUrl: faker.image.avatarGitHub(),
			ownerId: user.id,
			projects: {
				createMany: {
					data: [
						{
							name: faker.lorem.words(5),
							slug: faker.lorem.slug(5),
							description: faker.lorem.paragraph(),
							avatarUrl: faker.image.avatarGitHub(),
							ownerId: faker.helpers.arrayElement([
								user.id,
								anotherUser1.id,
								anotherUser2.id,
							]),
						},
						{
							name: faker.lorem.words(5),
							slug: faker.lorem.slug(5),
							description: faker.lorem.paragraph(),
							avatarUrl: faker.image.avatarGitHub(),
							ownerId: faker.helpers.arrayElement([
								user.id,
								anotherUser1.id,
								anotherUser2.id,
							]),
						},
						{
							name: faker.lorem.words(5),
							slug: faker.lorem.slug(5),
							description: faker.lorem.paragraph(),
							avatarUrl: faker.image.avatarGitHub(),
							ownerId: faker.helpers.arrayElement([
								user.id,
								anotherUser1.id,
								anotherUser2.id,
							]),
						},
					],
				},
			},
			members: {
				createMany: {
					data: [
						{
							userId: user.id,
							role: "MEMBER",
						},
						{
							userId: anotherUser1.id,
							role: "ADMIN",
						},
						{
							userId: anotherUser2.id,
							role: "MEMBER",
						},
					],
				},
			},
		},
	});

	await prisma.organization.create({
		data: {
			name: "Lourenço Inc (Billing)",
			slug: "lourenco-billing",
			avatarUrl: faker.image.avatarGitHub(),
			ownerId: user.id,
			projects: {
				createMany: {
					data: [
						{
							name: faker.lorem.words(5),
							slug: faker.lorem.slug(5),
							description: faker.lorem.paragraph(),
							avatarUrl: faker.image.avatarGitHub(),
							ownerId: faker.helpers.arrayElement([
								user.id,
								anotherUser1.id,
								anotherUser2.id,
							]),
						},
						{
							name: faker.lorem.words(5),
							slug: faker.lorem.slug(5),
							description: faker.lorem.paragraph(),
							avatarUrl: faker.image.avatarGitHub(),
							ownerId: faker.helpers.arrayElement([
								user.id,
								anotherUser1.id,
								anotherUser2.id,
							]),
						},
						{
							name: faker.lorem.words(5),
							slug: faker.lorem.slug(5),
							description: faker.lorem.paragraph(),
							avatarUrl: faker.image.avatarGitHub(),
							ownerId: faker.helpers.arrayElement([
								user.id,
								anotherUser1.id,
								anotherUser2.id,
							]),
						},
					],
				},
			},
			members: {
				createMany: {
					data: [
						{
							userId: user.id,
							role: "BILLING",
						},
						{
							userId: anotherUser1.id,
							role: "ADMIN",
						},
						{
							userId: anotherUser2.id,
							role: "MEMBER",
						},
					],
				},
			},
		},
	});
}

seed().then(() => {
	console.log("Database seeded!");
});
