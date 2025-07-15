import { hasRole } from "#lib/utils/roles"
import type User from "#models/user"
import { BasePolicy as AdonisBasePolicy } from "@adonisjs/bouncer"
import type { AuthorizerResponse } from "@adonisjs/bouncer/types"

export default class BasePolicy extends AdonisBasePolicy {
    async before(user: User | null): Promise<AuthorizerResponse> {
        if (user) {
            if (!user.roles) await user.load("roles")
            const isAdmin = hasRole(user, "administrator")
            return isAdmin
        }

        return false
    }
}
