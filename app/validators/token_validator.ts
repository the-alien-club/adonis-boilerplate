import vine from "@vinejs/vine"

/**
 * Validator for the token creation.
 */
export const tokenCreationValidator = vine.compile(
    vine.object({
        scope: vine.string().optional(), // The scope is later validated in the controller
        expiresIn: vine.number().optional(),
    })
)

/**
 * Validator for the token update (refresh).
 */
export const tokenUpdateValidator = vine.compile(
    vine.object({
        expiresIn: vine.number().optional(),
    })
)
