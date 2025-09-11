import { rootPath } from "#lib/utils/paths"
import { defineConfig } from "@tuyau/core"
import dedent from "dedent"
import { createRequire } from "node:module"
import path from "node:path"

// Load the package.json file without showing Node.js warnings
const pck = createRequire(import.meta.url)(path.join(rootPath, "package.json"))

/**
 * The main configuration for Tuyau E2E.
 */
const tuyauConfig = defineConfig({
    openapi: {
        exclude: [/admin/],
        documentation: {
            info: {
                title: "AdonisJS Boilerplate Documentation",
                version: pck.version,
                description: dedent`
                    The API documentation for the AdonisJS boilerplate, automatically
                    generated from the codebase with AdonisJS & Tuyau E2E.
                `,
            },
            tags: [
                {
                    name: "API",
                    description: "API related endpoints",
                },
            ],
        },
        endpoints: {
            spec: "/raw-openapi",
            ui: "/docs",
        },
    },
})

export default tuyauConfig
