import { BaseSchema } from "@adonisjs/lucid/schema"

export default class SkillUsers extends BaseSchema {
    protected tableName = "user_roles"

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments("id").primary()

            // Relationships
            // Belongs to a user
            table.integer("user_id").notNullable().unsigned().references("users.id").onDelete("CASCADE")

            // Belongs to a role
            table.integer("role_id").notNullable().unsigned().references("roles.id").onDelete("CASCADE")

            // Unique constraint for both (pivot table)
            table.unique(["user_id", "role_id"])

            // Dates
            table.timestamp("created_at").notNullable()
            table.timestamp("updated_at").notNullable()
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}
