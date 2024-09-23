import AutoSwagger from "adonis-autoswagger"
import dedent from "dedent-js"
import { rootPath } from "#lib/utils/paths"

import { createRequire } from "node:module"
import path from "node:path"

// Load the package.json file without showing Node.js warnings
const pck = createRequire(import.meta.url)(path.join(rootPath, "package.json"))

/**
 * The description for the API (supports markdown).
 */
const description = dedent`
    An AdonisJS boilerplate that integrates a role system, token scopes, cron jobs and more!

    *A service provided by [Alien](https://www.alien.club/), all rights reserved.*
`

/**
 * The type of the configuration for `adonis-autoswagger`.
 */
type AutoSwaggerOptions = Parameters<typeof AutoSwagger.default.docs>[1]

/**
 * The default configuration for `adonis-autoswagger`.
 */
const autoSwaggerBaseConfig: AutoSwaggerOptions = {
    path: rootPath + "/",
    tagIndex: 1,
    info: {
        title: "AdonisJS Boilerplate",
        version: `v${pck.version}`,
        description: description,
    },
    snakeCase: true,
    debug: false,
    ignore: ["/swagger", "/docs", "/admin/*"],
    preferredPutPatch: "PUT",
    common: {
        parameters: {}, // OpenAPI conform parameters that are commonly used
        headers: {}, // OpenAPI conform headers that are commonly used
    },
    securitySchemes: {},
    authMiddlewares: ["auth"],
    defaultSecurityScheme: "BearerAuth",
    persistAuthorization: true, // Persist authorization between reloads on the swagger page
}

/**
 * The configuration for the default version documentation.
 */
export const autoSwaggerDefaultVersionConfig: AutoSwaggerOptions = {
    ...autoSwaggerBaseConfig,
}
