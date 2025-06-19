import User from "#models/user"
import { AuthorizerResponse } from "@adonisjs/bouncer/types"
import { hasRole } from "#lib/utils/roles"
import { AccessTokenAbility, userAccessTokenHasAbility } from "#lib/utils/access_tokens"
import Role from "#models/role"
import BasePolicy from "#policies/templates/base_policy"

export default class AbiPolicy extends BasePolicy {
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
        return userAccessTokenHasAbility(user, AccessTokenAbility.ROLE_READ) && hasRole(user, role.name)
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
