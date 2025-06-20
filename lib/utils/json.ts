/**
 * Formats a JSON string for display.
 * @param str The JSON string to format.
 * @returns The formatted JSON string.
 */
export function formatJson(str: string): string {
    return JSON.stringify(JSON.parse(str), null, 4)
}

/**
 * Stringify a JSON object with support for BigInt and functions.
 * @param object The object to stringify.
 * @param indent The number of spaces to indent (optional, defaults to 4)
 * @returns The stringified JSON object.
 */
export function stringify(object: unknown, indent = 4): string {
    return JSON.stringify(
        object,
        (_, value) => {
            if (typeof value === "function") return value.toString()
            if (typeof value === "bigint") return value.toString()

            return value
        },
        indent
    )
}
