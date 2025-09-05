import type { DateTime } from "luxon"
import { BaseModel, column, hasMany, manyToMany } from "@adonisjs/lucid/orm"
import type { HasMany, ManyToMany } from "@adonisjs/lucid/types/relations"
import Role from "#models/role"
import type { AccessToken } from "@adonisjs/auth/access_tokens"
import { DbAccessTokensProvider } from "@adonisjs/auth/access_tokens"
import hash from "@adonisjs/core/services/hash"
import { withAuthFinder } from "@adonisjs/auth/mixins/lucid"
import { compose } from "@adonisjs/core/helpers"
import { DbRememberMeTokensProvider } from "@adonisjs/auth/session"

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
    declare email: string | null

    @column()
    declare username: string | null

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

    // Dates
    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime

    @column.dateTime()
    declare emailVerifiedAt: DateTime | null

    @column.dateTime()
    declare lastLoginAt: DateTime | null

    // Access tokens for the user
    static accessTokens = DbAccessTokensProvider.forModel(User)

    // Remember me tokens system for the session guard
    static rememberMeTokens = DbRememberMeTokensProvider.forModel(User)

    // The current access token (only accessible directly via AdonisJS)
    declare currentAccessToken: AccessToken | null
}
