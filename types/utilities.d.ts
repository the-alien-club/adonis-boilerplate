import type Tag from "#models/tag"
import type { ReadAttributes } from "#types/adonis"

/**
 * Makes any nullable properties in the type optional.
 */
export type MakeNullablesOptional<T> = {
    [K in keyof T as null extends T[K] ? K : never]?: T[K]
} & {
    [K in keyof T as null extends T[K] ? never : K]: T[K]
}

/**
 * Converts an enum type to a union type.
 */
export type EnumToUnion<T> = T[keyof T]

/**
 * Adds a "tags" property to the type.
 */
export type AddTagsProperty<T> = T & {
    tags: ReadAttributes<Tag>[]
}
