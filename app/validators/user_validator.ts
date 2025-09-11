import DB_CONSTANTS from "#lib/constants/db"
import vine from "@vinejs/vine"

/**
 * Validator for the batch user retrieval.
 */
export const usersShowBatchValidator = vine.compile(
    vine.object({
        ids: vine.any(),
    })
)

/**
 * Validator for a user update.
 */
export const userUpdateValidator = vine.compile(
    vine.object({
        username: vine
            .string()
            .minLength(DB_CONSTANTS.MIN_USERNAME_LENGTH)
            .regex(DB_CONSTANTS.USERNAME_REGEX)
            .optional(),
        firstName: vine.string().minLength(1).optional(),
        lastName: vine.string().minLength(1).optional(),
        description: vine.string().minLength(1).optional(),
        imageUrl: vine.string().url().optional(),
        isStealth: vine.boolean().optional(),
    })
)

/**
 * Validator for the user existence check.
 */
export const userExistenceValidator = vine.compile(
    vine.object({
        email: vine.string().email().optional().requiredIfMissing("username"),
        username: vine.string().minLength(1).optional().requiredIfMissing("email"),
    })
)
