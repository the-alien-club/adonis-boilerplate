import { DateTime } from "luxon"
import hash from "@adonisjs/core/services/hash"
import { compose } from "@adonisjs/core/helpers"
import { BaseModel, column, manyToMany } from "@adonisjs/lucid/orm"
import { withAuthFinder } from "@adonisjs/auth/mixins/lucid"
import { AccessToken, DbAccessTokensProvider } from "@adonisjs/auth/access_tokens"
import type { ManyToMany } from "@adonisjs/lucid/types/relations"
import Role from "#models/role"

const AuthFinder = withAuthFinder(() => hash.use("scrypt"), {
    uids: ["email", "username"],
    passwordColumnName: "password",
})

/**
 * The model for a user.
 */
export default class User extends compose(BaseModel, AuthFinder) {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare isLocked: boolean

    @column()
    declare email: string | null

    @column()
    declare username: string | null

    @column({ serializeAs: null })
    declare password: string

    @column()
    declare description: string | null

    // Relationships
    // Many-to-many relationship with the `roles` table
    @manyToMany(() => Role, {
        pivotTable: "user_roles",
        pivotForeignKey: "user_id",
        pivotRelatedForeignKey: "role_id",
        pivotTimestamps: true,
    })
    declare roles: ManyToMany<typeof Role>

    ///
    /// The relationships with other tables would go here
    ///

    // Dates
    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime

    // Tokens for the user
    static tokens = DbAccessTokensProvider.forModel(User)

    // The current access token (only accessible directly via AdonisJS)
    declare currentAccessToken: AccessToken | null
}
