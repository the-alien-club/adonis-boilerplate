import { hasRole } from "#lib/utils/roles"
import { userTokenHasAbility } from "#lib/utils/tokens"
import User from "#models/user"
import { BasePolicy } from "@adonisjs/bouncer"
import { AuthorizerResponse } from "@adonisjs/bouncer/types"
import { TokenAbility } from "#lib/constants/enums"

export default class UserPolicy extends BasePolicy {
    async before(user: User | null): Promise<AuthorizerResponse> {
        if (user) {
            const isAdmin = await hasRole(user, "admin")
            return isAdmin
        }

        return false
    }

    // Every user can view their own user object
    index(user: User): AuthorizerResponse {
        return userTokenHasAbility(user, TokenAbility.USER_READ)
    }

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
        return userTokenHasAbility(user, TokenAbility.USER_READ) && user?.id === fetchedUser?.id
    }

    // Every user can update their own user object
    update(user: User | null, fetchedUser: User | null): AuthorizerResponse {
        return userTokenHasAbility(user, TokenAbility.USER_WRITE) && user?.id === fetchedUser?.id
    }

    // Every user can delete their own user object
    destroy(user: User | null, fetchedUser: User | null): AuthorizerResponse {
        return userTokenHasAbility(user, TokenAbility.USER_WRITE) && user?.id === fetchedUser?.id
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
