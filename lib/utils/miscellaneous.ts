import DB_CONSTANTS from "#lib/constants/db"

/**
 * Validate a direct ID parameter (as integer for SQL DBs etc..).
 * @param id The ID to validate.
 * @returns True if the ID is valid, false otherwise.
 */
export function isValidIntId(id: string): boolean {
    return typeof id === "string" && id.length > 0 && Number.isInteger(Number(id)) && Number(id) >= 0
}

/**
 * Validates a slug.
 * @param slug The slug to validate.
 * @returns True if the slug is valid, false otherwise.
 */
export function isValidSlug(slug: string): boolean {
    return typeof slug === "string" && slug.length > 0 && DB_CONSTANTS.SLUG_REGEX.test(slug)
}
