import User from "#models/user"
import { AuthorizerResponse } from "@adonisjs/bouncer/types"
import { hasRole } from "#lib/utils/roles"
import { BasePolicy } from "@adonisjs/bouncer"
import { userTokenHasAbility } from "#lib/utils/tokens"
import Role from "#models/role"
import { TokenAbility } from "#lib/utils/enums"

export default class AbiPolicy extends BasePolicy {
    async before(user: User | null) {
        if (user) {
            const isAdmin = await hasRole(user, "admin")
            return isAdmin || undefined
        }

        return false
    }

    // Admin only
    index(): AuthorizerResponse {
        return false
    }

    // Admin only
    adminIndex(_user: User | null): AuthorizerResponse {
        return false
    }

    // Admin only
    store(_user: User | null): AuthorizerResponse {
        return false
    }

    show(user: User | null, role: Role): AuthorizerResponse {
        return userTokenHasAbility(user, TokenAbility.ROLE_READ) && hasRole(user, role.name)
    }

    // Admin only
    update(_user: User | null): AuthorizerResponse {
        return false
    }

    // Admin only
    destroy(_user: User | null): AuthorizerResponse {
        return false
    }
}
