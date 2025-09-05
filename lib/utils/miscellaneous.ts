import DB_CONSTANTS from "#lib/constants/db"

/**
 * Compares two arrays for equality.
 * @param array1 The first array to compare.
 * @param array2 The second array to compare.
 * @returns True if the arrays are equal, false otherwise.
 */
export function arrayEqual(array1: Array<any>, array2: Array<any>): boolean {
    if (array1 === array2) return true

    const { length } = array1
    if (length !== array2.length) return false

    for (let index = 0; index < length; index++) {
        if (array1[index] !== array2[index]) {
            return false
        }
    }

    return true
}

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

/**
 * Parse a query containing either a number or numbers separated by commas and returns an array of numbers.
 * @param query The query string to parse.
 * @returns An array of numbers extracted from the query.
 */
export function parseQueryNumberArray(query: string | Array<string>): number[] {
    const result: number[] = []
    const items = Array.isArray(query) ? query : query.split(",").map((item) => item.trim())

    for (const item of items) {
        const num = Number.parseInt(item, 10)
        if (!Number.isNaN(num)) result.push(num)
    }

    return result
}

/**
 * Parse a query containing either a string or strings separated by commas and returns an array of strings.
 * @param query The query string to parse.
 * @returns An array of strings extracted from the query.
 */
export function parseQueryStringArray(query: string | Array<string>): string[] {
    const result: string[] = []
    const items = Array.isArray(query) ? query : query.split(",").map((item) => item.trim())

    for (const item of items) {
        if (item.length > 0) result.push(item)
    }

    return result
}
