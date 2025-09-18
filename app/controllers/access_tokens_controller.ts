import type { AccessToken } from "@adonisjs/auth/access_tokens"
import type { HttpContext } from "@adonisjs/core/http"
import logger from "@adonisjs/core/services/logger"
import BaseController from "#controllers/templates/base_controller"
import { AppErrors } from "#lib/errors"
import { AccessTokenScope, AccessTokenScopeAbilities, recoverAccessTokenScope } from "#lib/utils/access_tokens"
import { tryCatchLog, userLog } from "#lib/utils/logger"
import { isValidIntId } from "#lib/utils/miscellaneous"
import User from "#models/user"
import AccessTokenPolicy from "#policies/access_token_policy"
import {
    accessTokenCreationValidator,
    accessTokenIndexingValidator,
    accessTokenUpdateValidator,
} from "#validators/access_token_validator"

export default class AccessTokensController extends BaseController {
    /**
     * Get all user's access tokens.
     */
    async index({ auth, bouncer, request, params }: HttpContext) {
        let user: User | null = auth.user as User
        if (params.user_id) {
            if (!isValidIntId(params.user_id)) {
                return this.errorResponse(
                    AppErrors.INVALID_ID_FORMAT,
                    undefined,
                    `The user ID '${params.user_id}' is not a valid integer.`
                )
            }

            user = await User.find(params.user_id)
            if (!user) {
                return this.errorResponse(
                    AppErrors.USER_NOT_FOUND,
                    undefined,
                    `The user with ID ${params.user_id} could not be found.`
                )
            }
        }

        if (await bouncer.with(AccessTokenPolicy).denies("index", user)) {
            return this.errorResponse(AppErrors.UNAUTHORIZED)
        }

        const accessTokens = await User.accessTokens.all(user)

        const { prefix } = await request.validateUsing(accessTokenIndexingValidator)
        if (prefix) {
            return this.successResponse<AccessToken[]>(
                accessTokens.filter((accessToken) => accessToken.name?.startsWith(prefix))
            )
        }

        return this.successResponse<AccessToken[]>(accessTokens)
    }

    /**
     * Get all access tokens.
     *
     * Note: This route is only accessible by admins in order to get ALL data.
     */
    async adminIndex({ bouncer }: HttpContext) {
        if (await bouncer.with(AccessTokenPolicy).denies("adminIndex")) {
            return this.errorResponse(AppErrors.UNAUTHORIZED)
        }

        const users = await User.all()
        const accessTokens: AccessToken[] = []

        for (const user of users) {
            const userAccessTokens = await User.accessTokens.all(user)
            accessTokens.push(...userAccessTokens)
        }

        return this.successResponse<AccessToken[]>(
            accessTokens.map((accessToken) => ({
                id: accessToken.identifier,
                name: accessToken.name,
                user_id: accessToken.tokenableId,
                abilities: accessToken.abilities,
                createdAt: accessToken.createdAt,
                updatedAt: accessToken.updatedAt,
                lastUsedAt: accessToken.lastUsedAt,
                expiresAt: accessToken.expiresAt,
            }))
        )
    }

    /**
     * Issue a new access token.
     */
    async store({ auth, bouncer, request, params }: HttpContext) {
        const { prefix, name, scope, expiresIn } = await request.validateUsing(accessTokenCreationValidator)

        let user: User | null = auth.user as User
        if (params.user_id) {
            if (!isValidIntId(params.user_id)) {
                return this.errorResponse(
                    AppErrors.INVALID_ID_FORMAT,
                    undefined,
                    `The user ID '${params.user_id}' is not a valid integer.`
                )
            }

            user = await User.find(params.user_id)
            if (!user) {
                return this.errorResponse(
                    AppErrors.USER_NOT_FOUND,
                    undefined,
                    `The user with ID ${params.user_id} could not be found.`
                )
            }
        }

        if (await bouncer.with(AccessTokenPolicy).denies("store", user)) {
            return this.errorResponse(AppErrors.UNAUTHORIZED)
        }

        // Validate the scope
        if (scope && !Object.values(AccessTokenScope).includes(scope as AccessTokenScope)) {
            return this.errorResponse(AppErrors.INVALID_ACCESS_TOKEN_SCOPE)
        }

        // Fallback to unrestricted scope in case no specific scope was provided
        let accessToken: AccessToken | null = null
        try {
            accessToken = await User.accessTokens.create(
                user,
                AccessTokenScopeAbilities[(scope as AccessTokenScope) || AccessTokenScope.UNRESTRICTED],
                {
                    name: `${prefix ? `${prefix}: ` : ""}${
                        name ??
                        (user.id === auth.user?.id
                            ? `Token issued manually (${scope}).`
                            : `Token issued by an administrator (${scope}).`)
                    }`,
                    expiresIn: expiresIn || undefined,
                }
            )
        } catch (error) {
            tryCatchLog("failed to create access token", error, user)
            return this.errorResponse(
                AppErrors.INTERNAL_SERVER_ERROR,
                undefined,
                "This access token could not be created."
            )
        }

        logger.debug(
            userLog(
                user,
                user.id === auth.user?.id
                    ? `issued themselves a new access token with the scope '${scope}'.`
                    : `issued a new access token with the scope '${scope}' for the user ${user.id}.`
            )
        )

        return this.successResponse<AccessToken>(accessToken)
    }

    /**
     * Get access token by ID.
     */
    async show({ auth, bouncer, params }: HttpContext) {
        let user: User | null = auth.user as User
        if (params.user_id) {
            if (!isValidIntId(params.user_id)) {
                return this.errorResponse(
                    AppErrors.INVALID_ID_FORMAT,
                    undefined,
                    `The user ID '${params.user_id}' is not a valid integer.`
                )
            }

            user = await User.find(params.user_id)
            if (!user) {
                return this.errorResponse(
                    AppErrors.USER_NOT_FOUND,
                    undefined,
                    `The user with ID ${params.user_id} could not be found.`
                )
            }
        }

        const accessToken = await User.accessTokens.find(user, params.access_token_id)
        if (!accessToken) return this.errorResponse(AppErrors.ACCESS_TOKEN_NOT_FOUND)

        if (await bouncer.with(AccessTokenPolicy).denies("show", accessToken)) {
            return this.errorResponse(AppErrors.UNAUTHORIZED)
        }

        return this.successResponse<AccessToken>(accessToken)
    }

    /**
     * Update (refresh) access token by ID.
     */
    async update({ auth, bouncer, params, request }: HttpContext) {
        let user: User | null = auth.user as User
        if (params.user_id) {
            if (!isValidIntId(params.user_id)) {
                return this.errorResponse(
                    AppErrors.INVALID_ID_FORMAT,
                    undefined,
                    `The user ID '${params.user_id}' is not a valid integer.`
                )
            }

            user = await User.find(params.user_id)
            if (!user) {
                return this.errorResponse(
                    AppErrors.USER_NOT_FOUND,
                    undefined,
                    `The user with ID ${params.user_id} could not be found.`
                )
            }
        }

        const { expiresIn } = await request.validateUsing(accessTokenUpdateValidator)

        const currentAccessToken = await User.accessTokens.find(user, params.access_token_id)
        if (!currentAccessToken) return this.errorResponse(AppErrors.ACCESS_TOKEN_NOT_FOUND)

        if (await bouncer.with(AccessTokenPolicy).denies("update", currentAccessToken)) {
            return this.errorResponse(AppErrors.UNAUTHORIZED)
        }

        const scope = recoverAccessTokenScope(currentAccessToken.abilities)

        // Destroy the current access token
        try {
            await User.accessTokens.delete(user, params.access_token_id)
        } catch (error) {
            tryCatchLog(`failed to revoke access token ${params.access_token_id}`, error, user)
            return this.errorResponse(
                AppErrors.INTERNAL_SERVER_ERROR,
                undefined,
                "This access token could not be refreshed."
            )
        }

        // Create a new access token with the same scope and abilities
        let accessToken: AccessToken
        try {
            accessToken = await User.accessTokens.create(user, currentAccessToken.abilities, {
                name:
                    user.id === auth.user?.id
                        ? `Access token issued manually (${scope} - refreshed).`
                        : `Access token issued by an administrator (${scope} - refreshed).`,
                expiresIn: expiresIn || undefined,
            })
        } catch (error) {
            tryCatchLog("failed to create new access token", error, user)
            return this.errorResponse(
                AppErrors.INTERNAL_SERVER_ERROR,
                undefined,
                "This access token could not be refreshed."
            )
        }

        logger.debug(
            userLog(
                user,
                user.id === auth.user?.id
                    ? `refreshed their access token with the scope '${scope}'.`
                    : `refreshed a access token with the scope '${scope}' for the user ${user.id}.`
            )
        )

        return this.successResponse<AccessToken>(accessToken)
    }

    /**
     * Delete access token by ID.
     */
    async destroy({ auth, bouncer, params }: HttpContext) {
        let user: User | null = auth.user as User
        if (params.user_id) {
            if (!isValidIntId(params.user_id)) {
                return this.errorResponse(
                    AppErrors.INVALID_ID_FORMAT,
                    undefined,
                    `The user ID '${params.user_id}' is not a valid integer.`
                )
            }

            user = await User.find(params.user_id)
            if (!user) {
                return this.errorResponse(
                    AppErrors.USER_NOT_FOUND,
                    undefined,
                    `The user with ID ${params.user_id} could not be found.`
                )
            }
        }

        const currentAccessToken = await User.accessTokens.find(user, params.access_token_id)
        if (!currentAccessToken) return this.errorResponse(AppErrors.ACCESS_TOKEN_NOT_FOUND)

        if (await bouncer.with(AccessTokenPolicy).denies("destroy", currentAccessToken)) {
            return this.errorResponse(AppErrors.UNAUTHORIZED)
        }

        const scope = recoverAccessTokenScope(currentAccessToken.abilities)

        try {
            await User.accessTokens.delete(user, params.access_token_id)
        } catch (error) {
            tryCatchLog(`failed to revoke access token ${params.access_token_id}`, error, user)
            return this.errorResponse(
                AppErrors.INTERNAL_SERVER_ERROR,
                undefined,
                "This access token could not be revoked."
            )
        }

        logger.debug(
            userLog(
                user,
                user.id === currentAccessToken.tokenableId
                    ? `revoked their access token with the scope '${scope}'.`
                    : `revoked a access token with the scope '${scope}' for the user ${user.id}.`
            )
        )

        return this.successResponse<AccessToken>(currentAccessToken)
    }

    /**
     * Revoke the currently used user's access token.
     */
    async revoke({ auth }: HttpContext) {
        if (auth.user?.currentAccessToken) {
            await User.accessTokens.delete(auth.user, auth.user.currentAccessToken.identifier)
            return this.successResponse(auth.user?.currentAccessToken)
        }

        return this.errorResponse(AppErrors.ACCESS_TOKEN_NOT_FOUND)
    }
}
