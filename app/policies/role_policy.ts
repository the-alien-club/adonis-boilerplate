import type User from "#models/user"
import type { AuthorizerResponse } from "@adonisjs/bouncer/types"
import { hasRole } from "#lib/utils/roles"
import BasePolicy from "#policies/templates/base_policy"
import type Role from "#models/role"
import { AccessTokenAbility, userAccessTokenHasAbility } from "#lib/utils/access_tokens"

export default class RolePolicy extends BasePolicy {
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

    // Every user can view one of their own role
    show(user: User | null, role: Role): AuthorizerResponse {
        return userAccessTokenHasAbility(user, AccessTokenAbility.ROLE_READ) && hasRole(user, role.slug)
    }

    // Every user can view some of their own roles
    showBatch(user: User | null, roles: Role[]): AuthorizerResponse {
        let hasAccess = true

        for (const role of roles) {
            const res = this.show(user, role)
            if (!res) {
                hasAccess = false
                break
            }
        }

        return hasAccess
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
