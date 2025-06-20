import Role from "#models/role"
import User from "#models/user"
import env from "#start/env"
import { BaseSeeder } from "@adonisjs/lucid/seeders"

export default class extends BaseSeeder {
    static environment = ["development", "testing", "production"]

    async run() {
        const admin = await User.findBy("email", env.get("DEFAULT_ADMIN_EMAIL"))

        await Role.createMany([
            {
                name: "Administrator",
                slug: "administrator",
                description: "All permissions are granted to this role.",
            },
            {
                name: "User",
                slug: "user",
                description: "The default role for all users.",
            },
        ])

        // Link the default administrator to the 'administrator' role using the pivot table
        const adminRole = await Role.findBy("slug", "administrator")
        await admin?.related("roles").attach([adminRole?.id as number])
    }
}
