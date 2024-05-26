import { AbilityBuilder } from "@casl/ability";
import { User } from "./models/user";
import { AppAbility } from ".";
import { Role } from "./roles";

type PermissionsByRole = (
	user: User,
	builder: AbilityBuilder<AppAbility>
) => void;

export const permissions: Record<Role, PermissionsByRole> = {
	ADMIN(user, { can, cannot }) {
		can("manage", "all");

		cannot(["transfer_ownership", "update"], "Organization");
		can(["transfer_ownership", "update"], "Organization", {
			ownerId: { $eq: user.id },
		});
	},

	MEMBER(user, { can }) {
		can("get", "User");

		can(["get", "create"], "Project");
		can(["update", "delete"], "Project", { ownerId: { $eq: user.id } });
	},

	BILLING(_user, { can }) {
		can("manage", "all");
	},
};
