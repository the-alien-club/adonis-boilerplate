import Role from "#models/role"
import User from "#models/user"
import env from "#start/env"
import { BaseSeeder } from "@adonisjs/lucid/seeders"

/**
 * The base roles that are seeded by default and used around the in application for security and permissions.
 */
export enum BaseRole {
    ADMIN = "admin",
    USER = "user",
}

export default class RolesSeeder extends BaseSeeder {
    static environment = ["development", "testing", "production"]

    async run() {
        const defaultAdmin = await User.findBy("email", env.get("DEFAULT_ADMIN_EMAIL"))

        await Role.createMany([
            {
                name: "Administrator",
                slug: BaseRole.ADMIN,
                description: "All permissions are granted to this role.",
            },
            {
                name: "User",
                slug: BaseRole.USER,
                description: "The default role for all users.",
            },
        ])

        // Link the default administrator to the 'administrator' role using the pivot table
        const adminRole = await Role.findBy("slug", BaseRole.ADMIN)
        await defaultAdmin?.related("roles").attach([adminRole?.id as number])
    }
}
