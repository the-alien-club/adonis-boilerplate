import { EC_INVALID_TOKEN_SCOPE, EC_TOKEN_NOT_FOUND, EC_UNAUTHORIZED, EC_USER_NOT_FOUND } from "#config/errors"
import BaseController from "#controllers/templates/base_controller"
import { TokenScope } from "#lib/utils/enums"
import { userLog } from "#lib/utils/logger"
import { TokenScopeAbilities, recoverTokenScope } from "#lib/utils/tokens"
import User from "#models/user"
import TokenPolicy from "#policies/token_policy"
import { AccessToken } from "@adonisjs/auth/access_tokens"
import { HttpContext } from "@adonisjs/core/http"
import logger from "@adonisjs/core/services/logger"

export default class TokensController extends BaseController {
    /**
     * Get all tokens.
     */
    async index({ bouncer, params }: HttpContext) {
        const user = await User.find(params.user_id)
        if (!user) return this.errorResponse(EC_USER_NOT_FOUND)

        if (await bouncer.with(TokenPolicy).denies("index", user)) {
            return this.errorResponse(EC_UNAUTHORIZED)
        }

        const tokens = await User.tokens.all(user)
        return this.successResponse(tokens)
    }

    /**
     * Get all tokens.
     *
     * Note: This route is only accessible by admins to get ALL data.
     */
    async adminIndex({ bouncer }: HttpContext) {
        if (await bouncer.with(TokenPolicy).denies("adminIndex")) {
            return this.errorResponse(EC_UNAUTHORIZED)
        }

        const users = await User.all()
        const tokens: AccessToken[] = []

        for (const user of users) {
            const userTokens = await User.tokens.all(user)
            tokens.push(...userTokens)
        }

        return this.successResponse(
            tokens.map((token) => ({
                id: token.identifier,
                name: token.name,
                user_id: token.tokenableId,
                abilities: token.abilities,
                createdAt: token.createdAt,
                updatedAt: token.updatedAt,
                lastUsedAt: token.lastUsedAt,
                expiresAt: token.expiresAt,
            }))
        )
    }

    /**
     * Issue a new token.
     */
    async store({ bouncer, params, request, auth }: HttpContext) {
        if (await bouncer.with(TokenPolicy).denies("store")) {
            return this.errorResponse(EC_UNAUTHORIZED)
        }

        const user = await User.find(params.user_id)
        if (!user) return this.errorResponse(EC_USER_NOT_FOUND)

        const queries = request.qs()

        // Recover the token scope from the query string
        let scope: TokenScope | undefined
        if (queries.scope) {
            if (!Object.values(TokenScope).includes(queries.scope)) return this.errorResponse(EC_INVALID_TOKEN_SCOPE)
            scope = queries.scope as TokenScope
        }

        // Fallback to unrestricted scope
        if (!scope) scope = TokenScope.UNRESTRICTED

        const token = await User.tokens.create(user, TokenScopeAbilities[scope], {
            name:
                user.id === auth.user?.id
                    ? `Token issued manually (${scope}).`
                    : `Token issued by an administrator (${scope}).`,
        })

        logger.debug(
            userLog(
                user,
                user.id === auth.user?.id
                    ? `issued themselves a new token with the scope '${scope}'.`
                    : `issued a new token with the scope '${scope}' for the user ${user.id}.`
            )
        )

        return this.successResponse(token)
    }

    /**
     * Get token by ID.
     */
    async show({ bouncer, params }: HttpContext) {
        const user = await User.find(params.user_id)
        if (!user) return this.errorResponse(EC_USER_NOT_FOUND)

        const token = await User.tokens.find(user, params.token_id)
        if (!token) return this.errorResponse(EC_USER_NOT_FOUND)

        if (await bouncer.with(TokenPolicy).denies("show", token)) {
            return this.errorResponse(EC_UNAUTHORIZED)
        }

        return this.successResponse(token)
    }

    /**
     * Update (refresh) token by ID.
     */
    async update({ bouncer, params, auth }: HttpContext) {
        const user = await User.find(params.user_id)
        if (!user) return this.errorResponse(EC_USER_NOT_FOUND)

        const currentToken = await User.tokens.find(user, params.token_id)
        if (!currentToken) return this.errorResponse(EC_TOKEN_NOT_FOUND)

        if (await bouncer.with(TokenPolicy).denies("update", currentToken)) {
            return this.errorResponse(EC_UNAUTHORIZED)
        }

        const scope = recoverTokenScope(currentToken.abilities)

        await User.tokens.delete(user, params.token_id)
        const token = await User.tokens.create(user, currentToken.abilities, {
            name:
                user.id === auth.user?.id
                    ? `Token issued manually (${scope} - refreshed).`
                    : `Token issued by an administrator (${scope} - refreshed).`,
        })

        logger.debug(
            userLog(
                user,
                user.id === auth.user?.id
                    ? `refreshed their token with the scope '${scope}'.`
                    : `refreshed a token with the scope '${scope}' for the user ${user.id}.`
            )
        )

        return this.successResponse(token)
    }

    /**
     * Delete token by ID.
     */
    async destroy({ bouncer, params }: HttpContext) {
        const user = await User.find(params.user_id)
        if (!user) return this.errorResponse(EC_USER_NOT_FOUND)

        const currentAccessToken = await User.tokens.find(user, params.token_id)
        if (!currentAccessToken) return this.errorResponse(EC_TOKEN_NOT_FOUND)

        if (await bouncer.with(TokenPolicy).denies("destroy", currentAccessToken)) {
            return this.errorResponse(EC_UNAUTHORIZED)
        }

        const scope = recoverTokenScope(currentAccessToken.abilities)

        await User.tokens.delete(user, params.token_id)

        logger.debug(
            userLog(
                user,
                user.id === currentAccessToken.tokenableId
                    ? `revoked their token with the scope '${scope}'.`
                    : `revoked a token with the scope '${scope}' for the user ${user.id}.`
            )
        )

        return this.successResponse()
    }
}
