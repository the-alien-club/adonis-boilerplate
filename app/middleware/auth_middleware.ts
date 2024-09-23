import type { HttpContext } from "@adonisjs/core/http"
import type { NextFn } from "@adonisjs/core/types/http"
import type { Authenticators } from "@adonisjs/auth/types"
import { EC_INVALID_TOKEN, EC_LOCKED, EC_UNAUTHENTICATED } from "#config/errors"
import { REDIRECT_TO } from "#lib/constants/db"
import logger from "@adonisjs/core/services/logger"
import { userLog } from "#lib/utils/logger"

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users, also ensuring that the user logging in
 * is not locked.
 * @param guards The guards to use for authentication (optional).
 */
export default class AuthMiddleware {
    async handle(
        ctx: HttpContext,
        next: NextFn,
        options: {
            guards?: (keyof Authenticators)[]
        } = {}
    ) {
        try {
            await ctx.auth.authenticateUsing(options.guards, { loginRoute: REDIRECT_TO })
        } catch (error) {
            return ctx.response.forbidden({
                success: false,
                message: "The token that was provided is invalid or has expired.",
                error: EC_INVALID_TOKEN,
            })
        }

        if (!ctx.auth.user) {
            return ctx.response.forbidden({
                success: false,
                message: "Unauthenticated user.",
                error: EC_UNAUTHENTICATED,
            })
        }

        if (ctx.auth.user && ctx.auth.user.isLocked === true) {
            logger.info(userLog(ctx.auth.user, "tried to interact with the API but their account is locked"))

            return ctx.response.forbidden({
                success: false,
                message: "Your account is locked. Please contact an administrator.",
                error: EC_LOCKED,
            })
        }

        return next()
    }
}
