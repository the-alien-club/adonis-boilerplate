import { AccessTokenAbility, userAccessTokenHasAbility } from "#lib/utils/access_tokens"
import type User from "#models/user"
import type { AuthorizerResponse } from "@adonisjs/bouncer/types"
import BasePolicy from "#policies/templates/base_policy"

export default class UserPolicy extends BasePolicy {
    // Admin only
    // Only admins can view all users
    adminIndex(): AuthorizerResponse {
        return false
    }

    // Admin only
    // Only admins can create a user (outside of registration)
    store(): AuthorizerResponse {
        return false
    }

    // Every user can view their own user object
    show(user: User | null, fetchedUser: User | null): AuthorizerResponse {
        return userAccessTokenHasAbility(user, AccessTokenAbility.USER_READ) && user?.id === fetchedUser?.id
    }

    // Every user can update their own user object
    update(user: User | null, fetchedUser: User | null): AuthorizerResponse {
        return userAccessTokenHasAbility(user, AccessTokenAbility.USER_WRITE) && user?.id === fetchedUser?.id
    }

    // Every user can delete their own user object
    destroy(user: User | null, fetchedUser: User | null): AuthorizerResponse {
        return userAccessTokenHasAbility(user, AccessTokenAbility.USER_WRITE) && user?.id === fetchedUser?.id
    }

    // Admin only
    // Only admins can lock a user (except themselves)
    lock(): AuthorizerResponse {
        return false
    }

    // Admin only
    // Only admins can unlock a user (except themselves)
    unlock(): AuthorizerResponse {
        return false
    }
}
