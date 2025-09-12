import env from "#start/env"
import { defineConfig, stores } from "@adonisjs/limiter"

/**
 * The configuration settings for the rate limiter.
 */
const limiterConfig = defineConfig({
    default: (env.get("LIMITER_STORE") as "memory") ?? "memory",

    stores: {
        // TODO: Switch from memory to redis or database in the future
        memory: stores.memory({}),
    },
})

export default limiterConfig

declare module "@adonisjs/limiter/types" {
    export interface LimitersList extends InferLimiters<typeof limiterConfig> {}
}
