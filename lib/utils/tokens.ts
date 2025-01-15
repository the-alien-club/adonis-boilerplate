import { TokenAbility, TokenScope } from "#lib/utils/enums"
import User from "#models/user"

/**
 * A record of token scopes and their abilities.
 */
export const TokenScopeAbilities: Record<TokenScope, TokenAbility[]> = {
    "unrestricted": [TokenAbility.UNRESTRICTED],
    "api-key": [TokenAbility.ROLE_READ],
    "api-secret": [TokenAbility.ROLE_READ, TokenAbility.USER_READ, TokenAbility.USER_WRITE],
}

/**
 * Check if a user's token has a specific ability, returns true for any ability if `*` (unrestricted).
 * @param user The user to check (null if no user).
 * @param ability The ability to check for.
 * @returns Whether the user has the ability.
 */
export function userTokenHasAbility(user: User | null, ability: TokenAbility): boolean {
    if (!user || !user.currentAccessToken) return false

    if (user.currentAccessToken.abilities.includes(TokenAbility.UNRESTRICTED)) return true
    return user.currentAccessToken?.abilities.includes(ability) || false
}

/**
 * Recover the scope of a token based on its abilities.
 * @param abilities The abilities of the token.
 * @returns The scope of the token.
 */
export function recoverTokenScope(abilities: string[]): TokenScope {
    for (const [scope, scopeAbilities] of Object.entries(TokenScopeAbilities)) {
        if (scopeAbilities.every((ability) => abilities.includes(ability))) return scope as TokenScope
    }

    return TokenScope.UNRESTRICTED
}
