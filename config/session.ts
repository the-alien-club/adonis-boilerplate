import env from "#start/env"
import { defineConfig, stores } from "@adonisjs/session"

export default defineConfig({
    age: "2h",
    enabled: true,
    cookieName: "adonis-session",
    clearWithBrowser: false,

    cookie: {
        path: "/",
        httpOnly: true,
        // TODO: Add the prod setup depending on how we deploy both the frontend and backend
        secure: false,
        sameSite: "lax",
    },

    store: (env.get("SESSION_DRIVER") as "cookie" | "memory") || "cookie",
    stores: {
        cookie: stores.cookie(),
    },
})
