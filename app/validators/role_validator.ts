import { MAX_DESCRIPTION_LENGTH, MAX_NAME_LENGTH, NAME_PATTERN } from "#lib/constants/db"
import vine from "@vinejs/vine"

/**
 * Validator for a role creation.
 */
export const roleCreationValidator = vine.compile(
    vine.object({
        name: vine.string().minLength(1).maxLength(MAX_NAME_LENGTH).regex(NAME_PATTERN),
        description: vine.string().minLength(1).maxLength(MAX_DESCRIPTION_LENGTH),
    })
)

/**
 * Validator for a role update.
 */
export const roleUpdateValidator = vine.compile(
    vine.object({
        name: vine.string().minLength(1).maxLength(MAX_NAME_LENGTH).regex(NAME_PATTERN).optional(),
        description: vine.string().minLength(1).maxLength(MAX_DESCRIPTION_LENGTH).optional(),
    })
)
