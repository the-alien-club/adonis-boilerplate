import User from "#models/user"
import { AuthorizerResponse } from "@adonisjs/bouncer/types"
import { hasRole } from "#lib/utils/roles"
import { BasePolicy } from "@adonisjs/bouncer"
import { AccessTokenAbility, userAccessTokenHasAbility } from "#lib/utils/access_tokens"
import Role from "#models/role"

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
    show(user: User | null, role: Role): AuthorizerResponse {
        return userAccessTokenHasAbility(user, AccessTokenAbility.ROLE_READ) && hasRole(user, role.slug)
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
