import limiter from "@adonisjs/limiter/services/main"

/**
 * The HTTP request throttler middleware based on `@adonisjs/limiter`.
 */
export const throttle = limiter.define("global", () => {
    return limiter.allowRequests(10).every("1 minute")
})
