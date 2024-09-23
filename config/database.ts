import env from "#start/env"
import { defineConfig } from "@adonisjs/lucid"

/**
 * The PostgreSQL connection configuration.
 */
const dbConfig = defineConfig({
    connection: "main",
    connections: {
        main: {
            client: "postgresql",
            connection: env.get("DATABASE_URL"),
            migrations: {
                naturalSort: true,
                paths: ["database/migrations"],
            },
            seeders: {
                paths: ["database/seeders/main"],
            },
        },
    },
})

export default dbConfig
