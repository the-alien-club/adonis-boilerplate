import { BaseCommand } from "@adonisjs/core/ace"
import { CommandOptions } from "@adonisjs/core/types/ace"
import AutoSwagger from "adonis-autoswagger"
import { autoSwaggerDefaultVersionConfig } from "#config/swagger"
import { copyFileSync, existsSync } from "node:fs"
import { buildPath, rootPath } from "#lib/utils/paths"

/**
 * A command to generate the Swagger docs for the API in production.
 */
export default class GenerateDocs extends BaseCommand {
    static commandName = "generate:docs"

    static options: CommandOptions = {
        startApp: true,
        allowUnknownFlags: false,
        staysAlive: false,
    }

    async run() {
        const Router = await this.app.container.make("router")
        Router.commit()

        // Write the Swagger docs to the file system
        await AutoSwagger.default.writeFile(Router.toJSON(), autoSwaggerDefaultVersionConfig)
        this.logger.success("Swagger docs generated successfully!")

        // Check if the build folder exists
        if (existsSync(buildPath)) {
            this.logger.info("Build folder found, copying Swagger docs to it...")

            // Copy the Swagger docs to the build folder
            copyFileSync(`${rootPath}/swagger.json`, `${buildPath}/swagger.json`)
            copyFileSync(`${rootPath}/swagger.yml`, `${buildPath}/swagger.yml`)

            this.logger.success("Swagger docs copied to the build folder!")
        } else {
            this.logger.warning("Build folder not found, skipping copying Swagger docs to it.")
        }

        // Exit the process
        process.exit()

        // TODO: Replace that by Readme.com API
    }
}
