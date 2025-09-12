import { BaseRole } from "#database/seeders/roles_seeder"
import { AccessTokenAbility, userAccessTokenHasAbility } from "#lib/utils/access_tokens"
import type User from "#models/user"
import BasePolicy from "#policies/templates/base_policy"
import { allowGuest } from "@adonisjs/bouncer"
import type { AuthorizerResponse } from "@adonisjs/bouncer/types"

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

    // Everyone can view their own user object or any other user (restricted)
    @allowGuest()
    async show(user: User | null, fetchedUser: User | null): Promise<AuthorizerResponse> {
        if (fetchedUser?.id === user?.id) return true
        if (!fetchedUser?.roles) await fetchedUser?.load("roles")
        if (fetchedUser?.roles.some((role) => role.slug === BaseRole.STEALTH)) return false

        return true
    }

    // Everyone can view their own user object or any other users (restricted)
    @allowGuest()
    async showBatch(user: User | null, fetchedUsers: User[]): Promise<AuthorizerResponse> {
        let hasAccess = true

        for await (const fetchedUser of fetchedUsers) {
            const res = await this.show(user, fetchedUser)
            if (!res) {
                hasAccess = false
                break
            }
        }

        return hasAccess
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

    // Every user can reference other users except stealth users
    async reference(user: User | null, refUser: User): Promise<AuthorizerResponse> {
        if (userAccessTokenHasAbility(user, AccessTokenAbility.USER_READ)) {
            if (!refUser.roles) await refUser.load("roles")

            // Stealth role => is stealth user
            if (refUser.roles.some((role) => role.slug === BaseRole.STEALTH)) {
                return false
            }

            return true
        }

        return false
    }
}
