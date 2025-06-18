import vine from "@vinejs/vine"
import DB_CONSTANTS from "#lib/constants/db"

/**
 * Validator for a user update.
 */
export const userUpdateValidator = vine.compile(
    vine.object({
        isLocked: vine.boolean().optional(),
        email: vine.string().email().optional(),
        username: vine
            .string()
            .minLength(DB_CONSTANTS.MIN_USERNAME_LENGTH)
            .maxLength(DB_CONSTANTS.MAX_USERNAME_LENGTH)
            .regex(DB_CONSTANTS.NAME_PATTERN)
            .optional(),
        password: vine
            .string()
            .minLength(DB_CONSTANTS.MIN_PASSWORD_LENGTH)
            .maxLength(DB_CONSTANTS.MAX_PASSWORD_LENGTH)
            .optional(),
        description: vine.string().minLength(1).maxLength(DB_CONSTANTS.MAX_DESCRIPTION_LENGTH).optional(),
    })
)
