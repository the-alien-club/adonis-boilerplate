import User from "#models/user"
import { AuthorizerResponse } from "@adonisjs/bouncer/types"
import { hasRole } from "#lib/utils/roles"
import { BasePolicy } from "@adonisjs/bouncer"
import { userAccessTokenHasAbility } from "#lib/utils/access_tokens"
import Role from "#models/role"
import { AccessTokenAbility } from "#lib/constants/enums"

export default class AbiPolicy extends BasePolicy {
    async before(user: User | null): Promise<AuthorizerResponse> {
        if (user) {
            const isAdmin = await hasRole(user, "admin")
            return isAdmin
        }

        return false
    }

    // Admin only
    // Only admins can view all roles
    index(): AuthorizerResponse {
        return false
    }

    // Admin only
    // Only admins can view all roles
    adminIndex(): AuthorizerResponse {
        return false
    }

    // Admin only
    // Only admins can create a role
    store(): AuthorizerResponse {
        return false
    }

    // Every user can view their own role
    async show(user: User | null, role: Role): Promise<AuthorizerResponse> {
        if (userAccessTokenHasAbility(user, AccessTokenAbility.ROLE_READ)) {
            const doesUserHaveRole = await hasRole(user, role.name)
            return doesUserHaveRole
        }

        return false
    }

    // Admin only
    // Only admins can update a role
    update(): AuthorizerResponse {
        return false
    }

    // Admin only
    // Only admins can delete a role
    destroy(): AuthorizerResponse {
        return false
    }
}
