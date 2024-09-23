import env from "#start/env"
import app from "@adonisjs/core/services/app"
import { defineConfig, targets } from "@adonisjs/core/logger"

// Automatically set the log level based on the environment
let logLevel: "fatal" | "error" | "warn" | "info" | "debug" | "trace" | "silent" = "info"
if (env.get("NODE_ENV") === "development" || env.get("NODE_ENV") === "test") logLevel = "debug"

const loggerConfig = defineConfig({
    default: "app",

    /**
     * The loggers object can be used to define multiple loggers.
     * By default, we configure only one logger (named "app").
     */
    loggers: {
        app: {
            enabled: true,
            name: env.get("APP_NAME"),
            level: logLevel,
            transport: {
                targets: targets()
                    .pushIf(!app.inProduction, targets.pretty())
                    .pushIf(app.inProduction, targets.file({ destination: 1 }))
                    .toArray(),
            },
        },
    },
})

export default loggerConfig

/**
 * Inferring types for the list of loggers you have configured
 * in the application.
 */
declare module "@adonisjs/core/types" {
    export interface LoggersList extends InferLoggers<typeof loggerConfig> {}
}
