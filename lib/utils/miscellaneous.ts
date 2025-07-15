/**
 * Validate a direct ID parameter (as integer for SQL DBs etc..).
 * @param id The ID to validate.
 * @returns True if the ID is valid, false otherwise.
 */
export function isValidIntId(id: string): boolean {
    return typeof id === "string" && id.length > 0 && Number.isInteger(Number(id)) && Number(id) >= 0
}
