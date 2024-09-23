import { EC_LOCKED, EC_UNAUTHENTICATED, EC_UNAUTHORIZED } from "#config/errors"
import { hasRole } from "#lib/utils/roles"
import Role from "#models/role"
import type { HttpContext } from "@adonisjs/core/http"
import type { NextFn } from "@adonisjs/core/types/http"

/**
 * The role middleware is used to check if the user has the required role to access
 * a specific route.
 *
 * Note: Must be used after the `auth` middleware.
 * @param role The role required to access the route (optional, defaults to `admin`).
 */
export default class RoleMiddleware {
    async handle(
        ctx: HttpContext,
        next: NextFn,
        options: {
            role: Role["name"]
        } = { role: "admin" }
    ) {
        if (!ctx.auth.isAuthenticated) {
            return ctx.response.forbidden({
                success: false,
                message: "Unauthenticated user.",
                error: EC_UNAUTHENTICATED,
            })
        }

        if (!ctx.auth.user || (ctx.auth.user && ctx.auth.user.isLocked === true)) {
            return ctx.response.forbidden({
                success: false,
                message: "Your account is locked. Please contact an administrator.",
                error: EC_LOCKED,
            })
        }

        const userHasRole = await hasRole(ctx.auth.user, options.role)

        if (!userHasRole) {
            return ctx.response.forbidden({
                success: false,
                message: "You do not have the required role to access this route.",
                error: EC_UNAUTHORIZED,
            })
        }

        return next()
    }
}
