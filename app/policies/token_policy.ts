import User from "#models/user"
import { AuthorizerResponse } from "@adonisjs/bouncer/types"
import { hasRole } from "#lib/utils/roles"
import { BasePolicy } from "@adonisjs/bouncer"
import { AccessToken } from "@adonisjs/auth/access_tokens"
import { userTokenHasAbility } from "#lib/utils/tokens"
import { TokenAbility } from "#lib/constants/enums"

export default class TokenPolicy extends BasePolicy {
    async before(user: User | null) {
        if (user) {
            const isAdmin = await hasRole(user, "admin")
            return isAdmin || undefined
        }

        return false
    }

    // Every user can view their own tokens
    index(user: User | null, userToGetTokensFrom: User | null): AuthorizerResponse {
        return userTokenHasAbility(user, TokenAbility.TOKEN_READ) && user?.id === userToGetTokensFrom?.id
    }

    // Admin only
    // Only admins can view all tokens
    adminIndex(): AuthorizerResponse {
        return false
    }

    // Every user can create a token
    store(user: User | null, userToIssueTokenFrom: User | null): AuthorizerResponse {
        return userTokenHasAbility(user, TokenAbility.TOKEN_WRITE) && user?.id === userToIssueTokenFrom?.id
    }

    // Every user can view their own token
    show(user: User | null, token: AccessToken): AuthorizerResponse {
        return userTokenHasAbility(user, TokenAbility.TOKEN_READ) && user?.id === token.tokenableId
    }

    // Every user can update their own token
    update(user: User | null, token: AccessToken): AuthorizerResponse {
        return userTokenHasAbility(user, TokenAbility.TOKEN_WRITE) && user?.id === token.tokenableId
    }

    // Every user can delete their own token
    destroy(user: User | null, token: AccessToken): AuthorizerResponse {
        return userTokenHasAbility(user, TokenAbility.TOKEN_WRITE) && user?.id === token.tokenableId
    }
}
