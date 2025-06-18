import vine from "@vinejs/vine"

/**
 * Validator for the access token creation.
 */
export const accessTokenCreationValidator = vine.compile(
    vine.object({
        scope: vine.string().optional(), // The scope is later validated in the controller
        expiresIn: vine.number().optional(),
    })
)

/**
 * Validator for the access token update (refresh).
 */
export const accessTokenUpdateValidator = vine.compile(
    vine.object({
        expiresIn: vine.number().optional(),
    })
)
