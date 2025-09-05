import type { ColumnOptions } from "@adonisjs/lucid/types/model"

/**
 * Prepares and consumes JSON values for database columns.
 */
export const columnJsonManager = {
    prepare: (value: Record<string, any>) => {
        if (typeof value === "string") return value

        let res: string | null = null
        try {
            res = JSON.stringify(value)
        } catch (_) {
            throw new Error("Failed to stringify JSON value")
        }

        return res
    },
    consume: (value: string | Record<string, any>) => {
        if (typeof value === "object" && value !== null) return value

        let res: Record<string, any> | null = null
        try {
            res = JSON.parse(value)
        } catch (_) {
            throw new Error("Failed to parse JSON value: " + value)
        }

        return res
    },
} satisfies Partial<ColumnOptions>
