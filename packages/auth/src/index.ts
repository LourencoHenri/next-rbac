import {
	createMongoAbility,
	AbilityBuilder,
	CreateAbility,
	MongoAbility,
} from "@casl/ability";

import { z } from "zod";

import { organizationSubject } from "./subjects/organization";
import { billingSubject } from "./subjects/billing";
import { projectSubject } from "./subjects/project";
import { inviteSubject } from "./subjects/invite";
import { userSubject } from "./subjects/user";
import { permissions } from "./permissions";

import { User } from "./models/user";

export * from "./models/organization";
export * from "./models/project";
export * from "./models/user";

const appAbilitiesSchema = z.union([
	organizationSubject,
	billingSubject,
	projectSubject,
	inviteSubject,
	userSubject,

	z.tuple([z.literal("manage"), z.literal("all")]),
]);

type AppAbilities = z.infer<typeof appAbilitiesSchema>;

export type AppAbility = MongoAbility<AppAbilities>;
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>;

export function defineAbilityFor(user: User) {
	const builder = new AbilityBuilder(createAppAbility);

	if (typeof permissions[user.role] !== "function") {
		throw new Error(`Permissions for role ${user.role} not found.`);
	}

	permissions[user.role](user, builder);

	const ability = builder.build({
		detectSubjectType(subject) {
			return subject.__typename;
		},
	});

	return ability;
}
