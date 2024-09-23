import User from "#models/user"
import { BaseModel, column, manyToMany } from "@adonisjs/lucid/orm"
import type { ManyToMany } from "@adonisjs/lucid/types/relations"

import { DateTime } from "luxon"

/**
 * The model for a user role.
 */
export default class Role extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare name: string

    @column()
    declare description: string

    // Relationships
    // Many-to-many relationship with the `users` table
    @manyToMany(() => User, {
        pivotTable: "user_roles",
        pivotForeignKey: "role_id",
        pivotRelatedForeignKey: "user_id",
        pivotTimestamps: true,
    })
    declare users: ManyToMany<typeof User>

    // Dates
    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime
}
