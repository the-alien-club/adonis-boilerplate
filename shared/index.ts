import type { QueryOptions } from "#controllers/templates/base_controller"
import type User from "#models/user"
import type { IndexedRequestMeta, ReadAttributes } from "#types/adonis"
import type { BaseModel } from "@adonisjs/lucid/orm"
import type { LucidModel, LucidRow, ModelAttributes } from "@adonisjs/lucid/types/model"

// Note: Anything else than types should not be exported, as it would create
// an actual dependency with the workers package, preventing it from being
// used in a standalone way.

/**
 * The type for the returned serialized user attributes to the frontend.
 */
type AuthenticatedUser = ReadAttributes<
    Omit<User, "createdAt" | "updatedAt" | "currentAccessToken"> & {
        createdAt: string | null
        updatedAt: string | null
        currentAccessToken?:
            | {
                  type: string
                  name: string | null
                  token: string | undefined
                  abilities: string[]
                  lastUsedAt: string | null
                  expiresAt: string | null
              }
            | null
            | undefined
    }
>

/**
 * The type for the returned **restricted** serialized user attributes to the frontend.
 */
type RestrictedUser = {
    username: string
    description: string | null
    imageUrl: string | null
    createdAt: string | null
}

/**
 * The type for a user within an object that includes a `isRestricted` field.
 */
type UserWithPotentialRestriction = {
    isRestricted: boolean
    user: AuthenticatedUser | RestrictedUser
}

export type {
    // Lucid ORM
    BaseModel,
    LucidRow,
    LucidModel,
    ModelAttributes,

    // Users
    AuthenticatedUser,
    RestrictedUser,
    UserWithPotentialRestriction,

    // Miscellaneous
    IndexedRequestMeta,
    QueryOptions,
}
