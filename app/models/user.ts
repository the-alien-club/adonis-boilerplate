import type { DateTime } from "luxon"
import hash from "@adonisjs/core/services/hash"
import { compose } from "@adonisjs/core/helpers"
import { BaseModel, column, manyToMany } from "@adonisjs/lucid/orm"
import { withAuthFinder } from "@adonisjs/auth/mixins/lucid"
import type { AccessToken } from "@adonisjs/auth/access_tokens"
import { DbAccessTokensProvider } from "@adonisjs/auth/access_tokens"
import type { ManyToMany } from "@adonisjs/lucid/types/relations"
import Role from "#models/role"

const AuthFinder = withAuthFinder(() => hash.use("scrypt"), {
    uids: ["email"],
    passwordColumnName: "password",
})

export default class User extends compose(BaseModel, AuthFinder) {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare isLocked: boolean

    @column()
    declare email: string

    @column()
    declare username: string

    @column({ serializeAs: null })
    declare password: string

    @column()
    declare firstName: string | null

    @column()
    declare lastName: string | null

    @column()
    declare description: string | null

    @column()
    declare imageUrl: string | null

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

    // Access tokens for the user
    static accessTokens = DbAccessTokensProvider.forModel(User)

    // The current access token (only accessible directly via AdonisJS)
    declare currentAccessToken: AccessToken | null
}
