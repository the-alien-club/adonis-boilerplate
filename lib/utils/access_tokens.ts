import { AccessTokenAbility, AccessTokenScope } from "#lib/constants/enums"
import User from "#models/user"

/**
 * A record of access token scopes and their abilities.
 */
export const AccessTokenScopeAbilities: Record<AccessTokenScope, AccessTokenAbility[]> = {
    "unrestricted": [AccessTokenAbility.UNRESTRICTED],
    "api-key": [AccessTokenAbility.ROLE_READ],
    "api-secret": [AccessTokenAbility.ROLE_READ, AccessTokenAbility.USER_READ, AccessTokenAbility.USER_WRITE],
}

/**
 * Check if a user's access token has a specific ability, returns true for any ability if `*` (unrestricted).
 * @param user The user to check (null if no user).
 * @param ability The ability to check for.
 * @returns Whether the user has the ability.
 */
export function userAccessTokenHasAbility(user: User | null, ability: AccessTokenAbility): boolean {
    if (!user || !user.currentAccessToken) return false

    if (user.currentAccessToken.abilities.includes(AccessTokenAbility.UNRESTRICTED)) return true
    return user.currentAccessToken?.abilities.includes(ability) || false
}

/**
 * Recover the scope of an access token based on its abilities.
 * @param abilities The abilities of the access token.
 * @returns The scope of the access token.
 */
export function recoverAccessTokenScope(abilities: string[]): AccessTokenScope {
    for (const [scope, scopeAbilities] of Object.entries(AccessTokenScopeAbilities)) {
        if (scopeAbilities.every((ability) => abilities.includes(ability))) return scope as AccessTokenScope
    }

    return AccessTokenScope.UNRESTRICTED
}
