import User from "#models/user"
import env from "#start/env"
import { BaseSeeder } from "@adonisjs/lucid/seeders"

export default class UsersSeeder extends BaseSeeder {
    static environment = ["development", "testing", "production"]

    async run() {
        try {
            await User.createMany([
                {
                    // Default administrator
                    isLocked: false,
                    email: env.get("DEFAULT_ADMIN_EMAIL") as string,
                    username: env.get("DEFAULT_ADMIN_USERNAME") as string,
                    password: env.get("DEFAULT_ADMIN_PASSWORD") as string,
                    description: "The default administrator.",
                    firstName: "John",
                    lastName: "Doe",
                    imageUrl: "https://placehold.co/512",
                },
            ])
        } catch (error) {
            console.warn("Error seeding users:", error)
        }
    }
}
