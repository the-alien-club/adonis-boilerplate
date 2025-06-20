import DB_CONSTANTS from "#lib/constants/db"
import vine from "@vinejs/vine"

/**
 * Validator for a role creation.
 */
export const roleCreationValidator = vine.compile(
    vine.object({
        name: vine.string().minLength(1).maxLength(DB_CONSTANTS.MAX_NAME_LENGTH).regex(DB_CONSTANTS.NAME_PATTERN),
        slug: vine.string().minLength(1).maxLength(DB_CONSTANTS.MAX_SLUG_LENGTH).regex(DB_CONSTANTS.SLUG_PATTERN),
        description: vine.string().minLength(1).maxLength(DB_CONSTANTS.MAX_DESCRIPTION_LENGTH),
    })
)

/**
 * Validator for a role update.
 */
export const roleUpdateValidator = vine.compile(
    vine.object({
        name: vine
            .string()
            .minLength(1)
            .maxLength(DB_CONSTANTS.MAX_NAME_LENGTH)
            .regex(DB_CONSTANTS.NAME_PATTERN)
            .optional(),
        slug: vine
            .string()
            .minLength(1)
            .maxLength(DB_CONSTANTS.MAX_SLUG_LENGTH)
            .regex(DB_CONSTANTS.SLUG_PATTERN)
            .optional(),
        description: vine.string().minLength(1).maxLength(DB_CONSTANTS.MAX_DESCRIPTION_LENGTH).optional(),
    })
)
