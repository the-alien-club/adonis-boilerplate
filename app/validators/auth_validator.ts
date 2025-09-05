import DB_CONSTANTS from "#lib/constants/db"
import vine from "@vinejs/vine"

/**
 * Validator for a signing up user.
 */
export const userRegistrationValidator = vine.compile(
    vine.object({
        email: vine.string().email(),
        username: vine
            .string()
            .minLength(DB_CONSTANTS.MIN_USERNAME_LENGTH)
            .maxLength(DB_CONSTANTS.MAX_USERNAME_LENGTH)
            .regex(DB_CONSTANTS.USERNAME_REGEX),
        password: vine.string().minLength(DB_CONSTANTS.MIN_PASSWORD_LENGTH).maxLength(DB_CONSTANTS.MAX_PASSWORD_LENGTH),
        firstName: vine.string().minLength(1).maxLength(DB_CONSTANTS.MAX_NAME_LENGTH).optional(),
        lastName: vine.string().minLength(1).maxLength(DB_CONSTANTS.MAX_NAME_LENGTH).optional(),
    })
)

/**
 * Validator for the user credentials.
 */
export const credentialsValidator = vine.compile(
    vine.object({
        email: vine.string().email(),
        password: vine.string().minLength(DB_CONSTANTS.MIN_PASSWORD_LENGTH).maxLength(DB_CONSTANTS.MAX_PASSWORD_LENGTH),
        rememberMe: vine.boolean().optional(),
    })
)

/**
 * Validator for the user credentials, including an optional "expiredIn" field for bearer token
 * authentication.
 */
export const credentialsValidatorForBearer = vine.compile(
    vine.object({
        email: vine.string().email(),
        password: vine.string().minLength(DB_CONSTANTS.MIN_PASSWORD_LENGTH).maxLength(DB_CONSTANTS.MAX_PASSWORD_LENGTH),
        expiresIn: vine.number().optional(),
    })
)
