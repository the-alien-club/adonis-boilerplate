import vine from "@vinejs/vine"
import {
    MAX_DESCRIPTION_LENGTH,
    MAX_PASSWORD_LENGTH,
    MAX_USERNAME_LENGTH,
    MIN_PASSWORD_LENGTH,
    MIN_USERNAME_LENGTH,
    NAME_PATTERN,
} from "#lib/constants/db"

/**
 * Validator for a user update.
 */
export const userUpdateValidator = vine.compile(
    vine.object({
        isLocked: vine.boolean().optional(),
        email: vine.string().email().optional(),
        username: vine
            .string()
            .minLength(MIN_USERNAME_LENGTH)
            .maxLength(MAX_USERNAME_LENGTH)
            .regex(NAME_PATTERN)
            .optional(),
        password: vine.string().minLength(MIN_PASSWORD_LENGTH).maxLength(MAX_PASSWORD_LENGTH).optional(),
        description: vine.string().minLength(1).maxLength(MAX_DESCRIPTION_LENGTH).optional(),
    })
)
