import Role from "#models/role"
import { BaseSeeder } from "@adonisjs/lucid/seeders"

export default class extends BaseSeeder {
    static environment = ["development", "testing", "production"]

    async run() {
        await Role.createMany([
            {
                name: "admin",
                description: "All permissions are granted to this role.",
            },
            {
                name: "user",
                description: "The default role for all users.",
            },
        ])
    }
}
