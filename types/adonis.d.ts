import type { LucidRow, ModelAttributes } from "@adonisjs/lucid/types/model"
import type { MakeNullablesOptional } from "#types/utilities"
import type { DateTime } from "luxon"

/**
 * Replace all `DateTime` occurrences with `string`
 */
export type ReplaceDateTimeWithString<T> = {
    [K in keyof T]: T[K] extends DateTime ? string : T[K]
}

/**
 * The base attributes of an AdonisJS model, excluding the `id`, `createdAt`, and `updatedAt` fields.
 */
export type BaseAttributes<T extends LucidRow> = Omit<
    MakeNullablesOptional<ModelAttributes<T>>,
    "id" | "createdAt" | "updatedAt"
>

/**
 * The read attributes of an AdonisJS model.
 */
export type ReadAttributes<T extends LucidRow> = ReplaceDateTimeWithString<MakeNullablesOptional<ModelAttributes<T>>>

/**
 * The type of an indexed request meta object.
 */
export type IndexedRequestMeta = {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
    firstPage: number
    firstPageUrl: string | null
    lastPageUrl: string | null
    nextPageUrl: string | null
    previousPageUrl: string | null
}
