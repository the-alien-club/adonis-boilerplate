import DB_CONSTANTS from "#lib/constants/db"
import vine from "@vinejs/vine"

/**
 * Validator for a role creation.
 */
export const roleCreationValidator = vine.compile(
    vine.object({
        name: vine.string().minLength(1).maxLength(DB_CONSTANTS.MAX_NAME_LENGTH),
        slug: vine.string().minLength(1).maxLength(DB_CONSTANTS.MAX_SLUG_LENGTH).regex(DB_CONSTANTS.SLUG_REGEX),
        description: vine.string().minLength(1).maxLength(DB_CONSTANTS.MAX_DESCRIPTION_LENGTH),
    })
)

/**
 * Validator for the batch role retrieval.
 */
export const rolesShowBatchValidator = vine.compile(
    vine.object({
        ids: vine.any().optional().requiredIfMissing("slugs"),
        slugs: vine.any().optional().requiredIfMissing("ids"),
    })
)

/**
 * Validator for a role update.
 */
export const roleUpdateValidator = vine.compile(
    vine.object({
        name: vine.string().minLength(1).maxLength(DB_CONSTANTS.MAX_NAME_LENGTH).optional(),
        slug: vine
            .string()
            .minLength(1)
            .maxLength(DB_CONSTANTS.MAX_SLUG_LENGTH)
            .regex(DB_CONSTANTS.SLUG_REGEX)
            .optional(),
        description: vine.string().minLength(1).maxLength(DB_CONSTANTS.MAX_DESCRIPTION_LENGTH).optional(),
    })
)
