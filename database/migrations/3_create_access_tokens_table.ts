import { MAX_NAME_LENGTH } from "#lib/constants/db"
import { BaseSchema } from "@adonisjs/lucid/schema"

export default class extends BaseSchema {
    protected tableName = "auth_access_tokens"

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments("id").primary()

            table.string("type").notNullable()
            table.string("name", MAX_NAME_LENGTH).notNullable()
            table.string("hash").notNullable()
            table.text("abilities").notNullable()

            // Relationships
            // Belongs to a user (User is the tokenable entity)
            table.integer("tokenable_id").notNullable().unsigned().references("users.id").onDelete("CASCADE")

            // Dates
            table.timestamp("created_at").notNullable()
            table.timestamp("updated_at").notNullable()
            table.timestamp("last_used_at").nullable()
            table.timestamp("expires_at").nullable()
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}
