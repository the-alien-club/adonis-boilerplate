import { Env } from "@adonisjs/core/env"

/**
 * Define the environment variables schema, cast and validate values
 * while ensuring that the application is running in a defined set
 * of environments.
 */
export default await Env.create(new URL("../", import.meta.url), {
    // Node env
    NODE_ENV: Env.schema.enum(["development", "production", "test"] as const),

    // Server Host, Port and Timezone
    HOST: Env.schema.string({ format: "host" }),
    PORT: Env.schema.number(),
    TZ: Env.schema.string(),

    // App name and key (AES-256-CBC)
    APP_NAME: Env.schema.string(),
    APP_KEY: Env.schema.string(),

    // PostgreSQL database
    DATABASE_URL: Env.schema.string(),

    // Redis database
    REDIS_URL: Env.schema.string(),

    // Default administrator
    DEFAULT_ADMIN_EMAIL: Env.schema.string({ format: "email" }),
    DEFAULT_ADMIN_USERNAME: Env.schema.string(),
    DEFAULT_ADMIN_PASSWORD: Env.schema.string(),
})
