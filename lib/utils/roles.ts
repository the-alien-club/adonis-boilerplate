import User from "#models/user"
import { HttpContext } from "@adonisjs/core/http"

/**
 * Where it is not possible to use the role middleware, this function allows to recover user's roles
 * with the `auth` object provided by the `HttpContext`.
 * @param auth The `auth` object provided by the `HttpContext`.
 * @returns The user's roles (as an array of role names).
 */
export async function getAuthUserRoles(auth: HttpContext["auth"]) {
    if (!auth.user) return []

    const roles = await (auth.user as User).related("roles").query().select("name")
    return roles.map((role) => role.name)
}

/**
 * Get the user's roles from the user object.
 * @param user The user.
 * @returns The user's roles (as an array of role names).
 */
export async function getUserRoles(user: User) {
    const roles = await user.related("roles").query().select("name")
    return roles.map((role) => role.name)
}

/**
 * Check if the user has a specific role.
 * @param user The user.
 * @param roleName The role name.
 * @returns `true` if the user has the role, `false` otherwise.
 */
export async function hasRole(user: User, roleName: string) {
    const roles = await getUserRoles(user)
    return roles.includes(roleName)
}
