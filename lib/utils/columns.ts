import encryption from "@adonisjs/core/services/encryption"
import type { ColumnOptions } from "@adonisjs/lucid/types/model"

/**
 * Prepares and consumes JSON values for database columns.
 */
export const columnJsonManager = {
    prepare: (value: Record<string, any>) => {
        if (value === null) return null
        if (typeof value === "string") return value

        let res: string | null = null
        try {
            res = JSON.stringify(value)
        } catch (error) {
            throw new Error(`The Column JSON manager failed to stringify the value: ${value}. Error: ${error}`)
        }

        return res
    },
    consume: (value: string | Record<string, any>) => {
        if (value === null) return null
        if (typeof value === "object" && value !== null) return value

        let res: Record<string, any> | null = null
        try {
            res = JSON.parse(value)
        } catch (error) {
            throw new Error(`The Column JSON manager failed to parse the value: ${value}. Error: ${error}`)
        }

        return res
    },
} satisfies Partial<ColumnOptions>

/**
 * Prepares and consumes JSON values for database columns, while also encrypting and decrypting them
 * via the AdonisJS encryption service.
 */
export const columnEncryptedJsonManager = {
    prepare: (value: Record<string, any>) => {
        const preparedValue = columnJsonManager.prepare(value)
        return preparedValue ? encryption.encrypt(preparedValue) : null
    },
    consume: (value: string) => {
        const decryptedValue = encryption.decrypt(value)
        return columnJsonManager.consume(decryptedValue as string)
    },
} satisfies Partial<ColumnOptions>
