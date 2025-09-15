import limiter from "@adonisjs/limiter/services/main"

/**
 * An HTTP request throttler middleware for authentication routes.
 */
export const authThrottle =
    process.env.NO_BACKEND_ENV === "true"
        ? null
        : limiter.define("auth", (ctx) => {
              if (ctx.auth.user) {
                  return limiter.allowRequests(120).every("1 minute").usingKey(`user_${ctx.auth.user.id}`)
              }

              return limiter.allowRequests(10).every("1 minute").usingKey(`ip_${ctx.request.ip()}`)
          })
