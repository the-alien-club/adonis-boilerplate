import { hasRole } from "#lib/utils/roles"
import User from "#models/user"
import { BasePolicy as AdonisBasePolicy } from "@adonisjs/bouncer"
import { AuthorizerResponse } from "@adonisjs/bouncer/types"

export default class BasePolicy extends AdonisBasePolicy {
    async before(user: User | null): Promise<AuthorizerResponse> {
        if (user) {
            if (!user.roles) await user.load("roles")
            const isAdmin = hasRole(user, "admin")
            return isAdmin
        }

        return false
    }
}
