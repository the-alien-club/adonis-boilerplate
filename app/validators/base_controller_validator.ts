import vine from "@vinejs/vine"

/**
 * Validator for base controller requests endpoints
 * that uses the `getIndexedRequestQueryOptions` method.
 */
export const getIndexedRequestQueryOptionsValidator = vine.compile(
    vine.object({
        page: vine.number().positive().optional(),
        limit: vine.number().positive().optional(),
        orderBy: vine.string().optional(),
        direction: vine.enum(["asc", "desc"] as const).optional(),
    })
)

/**
 * The period option for the `getPeriodRequestQueryOptions` method.
 */
export enum PeriodOption {
    LIVE = "live",
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly",
}

/**
 * Validator for base controller requests endpoints
 * that uses the `getPeriodRequestQueryOptions` method.
 */
export const getPeriodRequestQueryOptionsValidator = vine.compile(
    vine.object({
        period: vine.enum(PeriodOption),
        start: vine.date({ formats: ["iso8601"] }),
        end: vine.date({ formats: ["iso8601"] }),
    })
)
