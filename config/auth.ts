import { defineConfig } from "@adonisjs/auth"
import type { InferAuthEvents, Authenticators } from "@adonisjs/auth/types"
import { sessionGuard, sessionUserProvider } from "@adonisjs/auth/session"
import { tokensGuard, tokensUserProvider } from "@adonisjs/auth/access_tokens"

/**
 * The configuration settings for the auth module, either via session (default) auth
 * or access-token-based auth.
 */
const authConfig = defineConfig({
    default: "session",
    guards: {
        session: sessionGuard({
            useRememberMeTokens: true,
            rememberMeTokensAge: "30d",
            provider: sessionUserProvider({
                model: () => import("#models/user"),
            }),
        }),
        api: tokensGuard({
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
