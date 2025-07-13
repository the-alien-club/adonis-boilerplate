import { AppErrors } from "#lib/errors"
import { getUserRoles } from "#lib/utils/roles"
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
            role: Role["slug"]
        } = { role: "administrator" }
    ) {
        if (!ctx.auth.isAuthenticated) {
            return ctx.response.forbidden({
                success: false,
                message: "You are not authorized to access this resource.",
                error: AppErrors.UNAUTHORIZED,
            })
        }

        if (!ctx.auth.user || (ctx.auth.user && ctx.auth.user.isLocked === true)) {
            return ctx.response.forbidden({
                success: false,
                message: "Your account is locked. Please contact an administrator.",
                error: AppErrors.LOCKED,
            })
        }

        const userRoles = (await getUserRoles(ctx.auth.user)) || []
        if (!userRoles.includes(options.role)) {
            return ctx.response.forbidden({
                success: false,
                message: "You are not authorized to access this resource.",
                error: AppErrors.UNAUTHORIZED,
            })
        }

        return next()
    }
}
