import vine from "@vinejs/vine"
import DB_CONSTANTS from "#lib/constants/db"

/**
 * Validator for a signing up user.
 */
export const userSigningUpValidator = vine.compile(
    vine.object({
        email: vine.string().email().optional().requiredIfMissing("username"),
        username: vine
            .string()
            .minLength(DB_CONSTANTS.MIN_USERNAME_LENGTH)
            .maxLength(DB_CONSTANTS.MAX_USERNAME_LENGTH)
            .regex(DB_CONSTANTS.NAME_PATTERN)
            .optional()
            .requiredIfMissing("email"),
        password: vine.string().minLength(DB_CONSTANTS.MIN_PASSWORD_LENGTH).maxLength(DB_CONSTANTS.MAX_PASSWORD_LENGTH),
        description: vine.string().minLength(1).maxLength(DB_CONSTANTS.MAX_DESCRIPTION_LENGTH).optional(),
    })
)

/**
 * Validator for the user credentials (either email or username).
 */
export const credentialsValidator = vine.compile(
    vine.object({
        email: vine.string().email().optional().requiredIfMissing("username"),
        username: vine
            .string()
            .minLength(DB_CONSTANTS.MIN_USERNAME_LENGTH)
            .maxLength(DB_CONSTANTS.MAX_USERNAME_LENGTH)
            .regex(DB_CONSTANTS.NAME_PATTERN)
            .optional()
            .requiredIfMissing("email"),
        password: vine.string().minLength(DB_CONSTANTS.MIN_PASSWORD_LENGTH).maxLength(DB_CONSTANTS.MAX_PASSWORD_LENGTH),
        expiresIn: vine.number().optional(),
    })
)
