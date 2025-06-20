import DB_CONSTANTS from "#lib/constants/db"
import { BaseSchema } from "@adonisjs/lucid/schema"

export default class extends BaseSchema {
    protected tableName = "roles"

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments("id").primary()

            table.string("name", DB_CONSTANTS.MAX_NAME_LENGTH).notNullable().unique()
            table.string("slug", DB_CONSTANTS.MAX_SLUG_LENGTH).notNullable().unique()
            table.string("description", DB_CONSTANTS.MAX_DESCRIPTION_LENGTH).notNullable()

            // Dates
            table.timestamp("created_at", { useTz: true }).notNullable()
            table.timestamp("updated_at", { useTz: true }).notNullable()
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}
