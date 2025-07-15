import type User from "#models/user"
import type { HttpContext } from "@adonisjs/core/http"

/**
 * Where it is not possible to use the role middleware, this function allows to recover user's roles
 * with the `auth` object provided by the `HttpContext`.
 * @param auth The `auth` object provided by the `HttpContext`.
 * @returns The user's roles (as an array of role slugs).
 */
export async function getAuthUserRoles(auth: HttpContext["auth"]) {
    if (!auth.user) return []

    const roles = await (auth.user as User).related("roles").query().select("slug")
    return roles.map((role) => role.slug)
}

/**
 * Get the user's roles from the user object.
 * @param user The user.
 * @returns The user's roles (as an array of role slugs).
 */
export async function getUserRoles(user: User) {
    const roles = await user.related("roles").query().select("slug")
    return roles.map((role) => role.slug)
}

/**
 * Check if the user has a specific role.
 *
 * Note that roles should be **preloaded** in the user model.
 * @param user The user (or null if the user is not authenticated).
 * @param roleSlug The role slug.
 * @returns `true` if the user has the role, `false` otherwise.
 */
export function hasRole(user: User | null, roleSlug: string) {
    if (!user) return false
    if (!user.roles) return false
    return user.roles.some((role) => role.slug === roleSlug)
}
