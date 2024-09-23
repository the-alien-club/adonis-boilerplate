/**
 * Formats a JSON string for display.
 * @param str The JSON string to format.
 * @returns The formatted JSON string.
 */
export function formatJson(str: string): string {
    return JSON.stringify(JSON.parse(str), null, 4)
}

/**
 * Stringifies an object to JSON with support for BigInt.
 * @param obj The object to serialize.
 * @returns The JSON string.
 */
export function stringifyWithBigIntSupport(obj: object): any {
    return JSON.stringify(obj, (_, value) => (typeof value === "bigint" ? value.toString() : value))
}
