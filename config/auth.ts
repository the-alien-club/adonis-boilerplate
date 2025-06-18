import { defineConfig } from "@adonisjs/auth"
import { InferAuthEvents, Authenticators } from "@adonisjs/auth/types"
import { tokensGuard, tokensUserProvider } from "@adonisjs/auth/access_tokens"
import { basicAuthGuard, basicAuthUserProvider } from "@adonisjs/auth/basic_auth"

/**
 * The configuration settings for the auth module,
 * either via basic auth or access-token-based auth.
 */
const authConfig = defineConfig({
    default: "accessTokens",
    guards: {
        base64credentials: basicAuthGuard({
            provider: basicAuthUserProvider({
                model: () => import("#models/user"),
            }),
        }),
        accessTokens: tokensGuard({
            provider: tokensUserProvider({
                tokens: "accessTokens",
                model: () => import("#models/user"),
            }),
        }),
    },
})

export default authConfig

/**
 * Inferring types from the configured auth guards.
 */
declare module "@adonisjs/auth/types" {
    interface Authenticators extends InferAuthenticators<typeof authConfig> {}
}
declare module "@adonisjs/core/types" {
    interface EventsList extends InferAuthEvents<Authenticators> {}
}
