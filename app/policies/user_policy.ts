import { hasRole } from "#lib/utils/roles"
import { userTokenHasAbility } from "#lib/utils/tokens"
import User from "#models/user"
import { BasePolicy } from "@adonisjs/bouncer"
import { AuthorizerResponse } from "@adonisjs/bouncer/types"
import { TokenAbility } from "#lib/utils/enums"

export default class UserPolicy extends BasePolicy {
    async before(user: User | null) {
        if (user) return hasRole(user, "admin")
    }

    index(user: User): AuthorizerResponse {
        return userTokenHasAbility(user, TokenAbility.USER_READ)
    }

    // Admin only
    adminIndex(_user: User): AuthorizerResponse {
        return false
    }

    // Admin only
    store(_user: User): AuthorizerResponse {
        return false
    }

    show(user: User, fetchedUser: User): AuthorizerResponse {
        return userTokenHasAbility(user, TokenAbility.USER_READ) && user.id === fetchedUser.id
    }

    update(user: User, fetchedUser: User): AuthorizerResponse {
        return userTokenHasAbility(user, TokenAbility.USER_WRITE) && user.id === fetchedUser.id
    }

    destroy(user: User, fetchedUser: User): AuthorizerResponse {
        return userTokenHasAbility(user, TokenAbility.USER_WRITE) && user.id === fetchedUser.id
    }

    // Admin only
    lock(_user: User): AuthorizerResponse {
        return false
    }

    // Admin only
    unlock(_user: User): AuthorizerResponse {
        return false
    }
}
