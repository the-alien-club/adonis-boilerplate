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
            .maxLength(DB_CONSTANTS.MAX_USERNAME_LENGTH)
            .regex(DB_CONSTANTS.USERNAME_REGEX)
            .optional(),
        firstName: vine.string().minLength(1).maxLength(DB_CONSTANTS.MAX_NAME_LENGTH).optional(),
        lastName: vine.string().minLength(1).maxLength(DB_CONSTANTS.MAX_NAME_LENGTH).optional(),
        description: vine.string().minLength(1).maxLength(DB_CONSTANTS.MAX_DESCRIPTION_LENGTH).optional(),
        imageUrl: vine.string().url().optional(),
        isStealth: vine.boolean().optional(),
    })
)
