import { BaseRole } from "#database/seeders/roles_seeder"
import { hasRole } from "#lib/utils/roles"
import type User from "#models/user"
import { BasePolicy as AdonisBasePolicy } from "@adonisjs/bouncer"
import type { AuthorizerResponse } from "@adonisjs/bouncer/types"

export default class BasePolicy extends AdonisBasePolicy {
    async before(user: User | null): Promise<AuthorizerResponse | undefined> {
        if (user) {
            if (!user.roles) await user.load("roles")

            // True only for admin users, otherwise continue with normal authorization
            const isAdmin = hasRole(user, BaseRole.ADMIN)
            if (isAdmin) return true
        }

        // Continue with normal authorization
        // See https://docs.adonisjs.com/guides/security/authorization#policy-hooks
        return undefined
    }
}
