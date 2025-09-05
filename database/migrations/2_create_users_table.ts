import DB_CONSTANTS from "#lib/constants/db"
import { BaseSchema } from "@adonisjs/lucid/schema"

export default class UsersTable extends BaseSchema {
    protected tableName = "users"

    async up() {
        if (await this.schema.hasTable(this.tableName)) return

        this.schema.createTable(this.tableName, (table) => {
            table.increments("id").primary()

            table.boolean("is_locked").notNullable()
            table.string("email").nullable().unique()
            table.string("username", DB_CONSTANTS.MAX_USERNAME_LENGTH).nullable().unique()
            table.string("password", DB_CONSTANTS.MAX_PASSWORD_LENGTH).notNullable()
            table.string("first_name", DB_CONSTANTS.MAX_NAME_LENGTH).nullable()
            table.string("last_name", DB_CONSTANTS.MAX_NAME_LENGTH).nullable()
            table.string("description", DB_CONSTANTS.MAX_DESCRIPTION_LENGTH).nullable()
            table.string("image_url", DB_CONSTANTS.MAX_URL_LENGTH).nullable()
            table.bigInteger("tokens").notNullable()

            // Dates
            table.timestamp("created_at", { useTz: true }).notNullable()
            table.timestamp("updated_at", { useTz: true }).notNullable()
            table.timestamp("email_verified_at", { useTz: true }).nullable()
            table.timestamp("last_login_at", { useTz: true }).nullable()
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}
