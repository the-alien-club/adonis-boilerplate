import User from "#models/user"
import env from "#start/env"
import { BaseSeeder } from "@adonisjs/lucid/seeders"

export default class extends BaseSeeder {
    static environment = ["development", "testing", "production"]

    async run() {
        await User.createMany([
            {
                // Default administrator
                isLocked: false,
                email: env.get("DEFAULT_ADMIN_EMAIL"),
                username: env.get("DEFAULT_ADMIN_USERNAME"),
                password: env.get("DEFAULT_ADMIN_PASSWORD"),
                description: "The default administrator.",
                firstName: "Admin",
                lastName: "User",
                imageUrl: "https://example.com/default-admin-image.png", // Replace with a valid URL or leave null
            },
        ])
    }
}
