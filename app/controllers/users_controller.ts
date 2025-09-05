import BaseController from "#controllers/templates/base_controller"
import { BaseRole } from "#database/seeders/roles_seeder"
import { AppErrors } from "#lib/errors"
import { tryCatchLog, userLog } from "#lib/utils/logger"
import { isValidIntId, parseQueryNumberArray } from "#lib/utils/miscellaneous"
import User from "#models/user"
import UserPolicy from "#policies/user_policy"
import type { AuthenticatedUser, RestrictedUser, UserWithPotentialRestriction } from "#shared/index"
import { userExistenceValidator, usersShowBatchValidator, userUpdateValidator } from "#validators/user_validator"
import type { HttpContext } from "@adonisjs/core/http"
import logger from "@adonisjs/core/services/logger"

export default class UsersController extends BaseController {
    /**
     * Get all users.
     *
     * Note: This route is only accessible by admins in order to get ALL data.
     */
    async adminIndex({ bouncer, request }: HttpContext) {
        if (await bouncer.with(UserPolicy).denies("adminIndex")) {
            return this.errorResponse(AppErrors.UNAUTHORIZED)
        }

        const queries = request.qs()
        const options = this.getQueryOptions(queries)

        const users = await User.query()
            .orderBy(options.orderBy, options.direction)
            .paginate(options.page, options.limit)

        const tmp = users.toJSON()
        return this.successResponse<AuthenticatedUser[]>(tmp.data, tmp.meta)
    }

    /**
     * Get user by ID.
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
            if (!user) return this.errorResponse(AppErrors.USER_NOT_FOUND)
        }

        if (await bouncer.with(UserPolicy).denies("show", user)) {
            return this.errorResponse(AppErrors.UNAUTHORIZED)
        }

        // Restricted user
        if (user.id !== auth.user?.id) {
            return this.successResponse<{ isRestricted: true; user: RestrictedUser }>({
                isRestricted: true,
                user: {
                    username: user.username!,
                    description: user.description!,
                    imageUrl: user.imageUrl!,
                    createdAt: user.createdAt!.toJSON(),
                } satisfies RestrictedUser,
            })
        }

        return this.successResponse<{ isRestricted: false; user: AuthenticatedUser }>({
            isRestricted: false,
            user,
        })
    }

    /**
     * Get a list of users per IDs (with potential restrictions if not currently authenticated user).
     */
    async showBatch({ auth, bouncer, request }: HttpContext) {
        const { ids } = await request.validateUsing(usersShowBatchValidator)
        const parsedIds = ids ? parseQueryNumberArray(ids) : []
        if (parsedIds.length === 0) return this.errorResponse(AppErrors.EMPTY_DATA)

        let users: User[] = []
        try {
            users = await User.query().whereIn("id", parsedIds)
        } catch (error) {
            tryCatchLog(`failed to retrieve users:`, error, auth.user)

            const message = error instanceof Error ? error.message : String(error)
            return this.errorResponse(AppErrors.USER_NOT_FOUND, undefined, `Failed to retrieve users: ${message}`)
        }

        if (users.length === 0) return this.errorResponse(AppErrors.USER_NOT_FOUND)
        if (await bouncer.with(UserPolicy).denies("showBatch", users)) {
            return this.errorResponse(AppErrors.UNAUTHORIZED)
        }

        const usersWithRestrictionsApplied = users.map((user) => {
            if (user.id !== auth.user?.id) {
                return {
                    isRestricted: true,
                    user: {
                        username: user.username!,
                        description: user.description!,
                        imageUrl: user.imageUrl!,
                        createdAt: user.createdAt!.toJSON(),
                    } satisfies RestrictedUser,
                }
            }

            return {
                isRestricted: false,
                user,
            }
        })

        return this.successResponse<UserWithPotentialRestriction[]>(usersWithRestrictionsApplied)
    }

    /**
     * Update user by ID.
     */
    async update({ auth, bouncer, request, params }: HttpContext) {
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
            if (!user) return this.errorResponse(AppErrors.USER_NOT_FOUND)
        }

        if (await bouncer.with(UserPolicy).denies("update", user)) {
            return this.errorResponse(AppErrors.UNAUTHORIZED)
        }

        const { username, firstName, lastName, description, imageUrl, isStealth } =
            await request.validateUsing(userUpdateValidator)

        // Non-isolated
        if (username && (await User.findBy("username", username))) {
            return this.errorResponse(AppErrors.USERNAME_ALREADY_EXISTS)
        }

        user.username = username ?? user.username
        user.firstName = firstName ?? user.firstName
        user.lastName = lastName ?? user.lastName
        user.description = description ?? user.description
        user.imageUrl = imageUrl ?? user.imageUrl
        await user.save()

        // Add the stealth role if the user is in stealth mode
        if (isStealth) await user.related("roles").attach([BaseRole.STEALTH])
        else await user.related("roles").detach([BaseRole.STEALTH])

        logger.debug(userLog(user, "updated successfully"))
        return this.successResponse<AuthenticatedUser>(user)
    }

    /**
     * Delete user by ID.
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
            if (!user) return this.errorResponse(AppErrors.USER_NOT_FOUND)
        }

        if (await bouncer.with(UserPolicy).denies("destroy", user)) {
            return this.errorResponse(AppErrors.UNAUTHORIZED)
        }

        try {
            await user.delete()
        } catch (error) {
            tryCatchLog(`failed to delete user ${user.id}`, error, auth.user)
            return this.errorResponse(AppErrors.INTERNAL_SERVER_ERROR, undefined, "This user could not be deleted.")
        }

        logger.debug(userLog(user, "deleted successfully"))
        return this.successResponse<AuthenticatedUser>(user)
    }

    /**
     * Lock a user, preventing the user from logging in and using the system.
     */
    async lock({ auth, bouncer, params }: HttpContext) {
        if (await bouncer.with(UserPolicy).denies("lock")) {
            return this.errorResponse(AppErrors.UNAUTHORIZED)
        }

        if (!isValidIntId(params.user_id)) {
            return this.errorResponse(AppErrors.MISSING_PARAMETER, undefined, "User ID is required.")
        }

        const user = await User.find(params.user_id)
        if (!user) return this.errorResponse(AppErrors.USER_NOT_FOUND)

        // Prevent admins from locking themselves
        if (user.id === auth.user?.id) {
            return this.errorResponse(AppErrors.YOU_CANNOT_LOCK_YOURSELF)
        }

        user.isLocked = true
        await user.save()

        logger.info(userLog(user, "locked by administrator"))
        return this.successResponse<AuthenticatedUser>(user)
    }

    /**
     * Unlock a user, allowing them to log in and use the system again.
     */
    async unlock({ auth, bouncer, params }: HttpContext) {
        if (await bouncer.with(UserPolicy).denies("unlock")) {
            return this.errorResponse(AppErrors.UNAUTHORIZED)
        }

        if (!isValidIntId(params.user_id)) {
            return this.errorResponse(AppErrors.MISSING_PARAMETER, undefined, "User ID is required.")
        }

        const user = await User.find(params.user_id)
        if (!user) return this.errorResponse(AppErrors.USER_NOT_FOUND)

        // Prevent admins from unlocking themselves
        if (user.id === auth.user?.id) {
            return this.errorResponse(AppErrors.YOU_CANNOT_UNLOCK_YOURSELF)
        }

        user.isLocked = false
        await user.save()

        logger.info(userLog(user, "unlocked by administrator"))
        return this.successResponse<AuthenticatedUser>(user)
    }

    /**
     * Get the currently authenticated user.
     */
    async me({ auth }: HttpContext) {
        if (auth.user) return this.successResponse<AuthenticatedUser>(auth.user)
        return this.errorResponse(AppErrors.UNAUTHORIZED)
    }

    /**
     * Check if a user exists by their email or username.
     */
    async exists({ request }: HttpContext) {
        const { email, username } = await request.validateUsing(userExistenceValidator)
        const user = (await User.findBy("email", email)) || (await User.findBy("username", username))
        return this.successResponse<{ exists: boolean; emailVerifiedAt: string | null }>({
            exists: !!user,
            emailVerifiedAt: user?.emailVerifiedAt || null,
        })
    }
}
