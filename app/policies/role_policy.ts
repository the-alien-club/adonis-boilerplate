import User from "#models/user"
import { AuthorizerResponse } from "@adonisjs/bouncer/types"
import { hasRole } from "#lib/utils/roles"
import { BasePolicy } from "@adonisjs/bouncer"
import { userTokenHasAbility } from "#lib/utils/tokens"
import Role from "#models/role"
import { TokenAbility } from "#lib/utils/enums"

export default class AbiPolicy extends BasePolicy {
    async before(user: User | null) {
        if (user) return hasRole(user, "admin")
    }

    index(user: User): AuthorizerResponse {
        return userTokenHasAbility(user, TokenAbility.ROLE_READ)
    }

    // Admin only
    adminIndex(_user: User): AuthorizerResponse {
        return false
    }

    // Admin only
    store(_user: User): AuthorizerResponse {
        return false
    }

    show(user: User, role: Role): AuthorizerResponse {
        return userTokenHasAbility(user, TokenAbility.ROLE_READ) && hasRole(user, role.name)
    }

    // Admin only
    update(_user: User): AuthorizerResponse {
        return false
    }

    // Admin only
    destroy(_user: User): AuthorizerResponse {
        return false
    }
}
