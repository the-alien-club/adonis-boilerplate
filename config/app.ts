import env from "#start/env"
import { Secret } from "@adonisjs/core/helpers"
import { defineConfig } from "@adonisjs/core/http"

/**
 * The app key is used for encrypting cookies, generating signed URLs,
 * and by the "encryption" module.
 *
 * The encryption module will fail to decrypt data if the key is lost or
 * changed. Therefore it is recommended to keep the app key secure.
 */
export const appKey = new Secret(env.get("APP_KEY"))

/**
 * The configuration settings used by the HTTP server.
 */
export const http = defineConfig({
    generateRequestId: true,
    allowMethodSpoofing: false,

    /**
     * Enabling async local storage will let you access HTTP context
     * from anywhere inside the application.
     */
    useAsyncLocalStorage: false,
})
