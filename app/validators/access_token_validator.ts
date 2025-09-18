import vine from "@vinejs/vine"

/**
 * Validator for access token indexing.
 */
export const accessTokenIndexingValidator = vine.compile(
    vine.object({
        prefix: vine.string().optional(),
    })
)

/**
 * Validator for an access token creation.
 */
export const accessTokenCreationValidator = vine.compile(
    vine.object({
        prefix: vine.string().optional(),
        name: vine.string().optional(),
        scope: vine.string().optional(), // The scope is later validated in the controller
        expiresIn: vine.number().optional(),
    })
)

/**
 * Validator for an access token update (refresh).
 */
export const accessTokenUpdateValidator = vine.compile(
    vine.object({
        expiresIn: vine.number().optional(),
    })
)
