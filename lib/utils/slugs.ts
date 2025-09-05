import slugify from "slugify"

/**
 * The options for the `slugify` function.
 */
const slugifyOptions: Parameters<typeof slugify.default>[1] = {
    lower: true,
}

/**
 * Slugify a given name.
 * @param name The name to slugify.
 * @param previousSlug An optional previous slug to compare against,
 * the previous slug should ends with `-<number>`, this slug will automatically
 * increment the number if the slug already exists.
 * @returns The slugified version of the name.
 */
export function slugifyName(name: string, previousSlug?: string): string {
    if (previousSlug) {
        // If the previous slug ends with a number, we increment it
        const match = previousSlug.match(/-(\d+)$/)

        if (match) {
            const number = Number.parseInt(match[1], 10)
            const baseSlug = previousSlug.slice(0, -match[0].length)
            return slugify.default(`${baseSlug}-${number + 1}`, slugifyOptions)
        }
    }

    return slugify.default(name, slugifyOptions)
}
