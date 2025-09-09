import BaseController from "#controllers/templates/base_controller"
import { AppErrors } from "#lib/errors"
import { tryCatchLog, userLog } from "#lib/utils/logger"
import { AccessTokenScopeAbilities } from "#lib/utils/access_tokens"
import Role from "#models/role"
import User from "#models/user"
import {
    credentialsValidator,
    credentialsValidatorForBearer,
    userRegistrationValidator,
} from "#validators/auth_validator"
import type { HttpContext } from "@adonisjs/core/http"
import logger from "@adonisjs/core/services/logger"
import USER_CONSTANTS from "#lib/constants/users"
import type { AccessToken } from "@adonisjs/auth/access_tokens"
import type { AuthenticatedUser } from "#shared/index"

export default class AuthController extends BaseController {
    /**
     * Main user registration route.
     */
    async signUp({ request }: HttpContext) {
        const { email, username, password, firstName, lastName } =
            await request.validateUsing(userRegistrationValidator)

        // Non-isolated
        // Both email and username are unique, so we need to check if the user already exists.
        if (email && (await User.findBy("email", email))) return this.errorResponse(AppErrors.EMAIL_ALREADY_EXISTS)
        if (username && (await User.findBy("username", username))) {
            return this.errorResponse(AppErrors.USERNAME_ALREADY_EXISTS)
        }

        let user: User
        try {
            user = await User.create({
                isLocked: false,
                email,
                username,
                password,
                firstName: firstName || null,
                lastName: lastName || null,
            })
        } catch (error) {
            tryCatchLog(`failed to create user with email ${email}`, error)
            return this.errorResponse(
                AppErrors.INTERNAL_SERVER_ERROR,
                undefined,
                "This user account could not be created."
            )
        }

        const defaultRole = await Role.findBy("slug", "user")
        if (defaultRole) await user.related("roles").attach([defaultRole.id])
        else this.errorResponse(AppErrors.ROLE_NOT_FOUND, null, "The default role for users was not found.")

        logger.debug(userLog(user, "signed up successfully"))
        return this.successResponse<AuthenticatedUser>(user)
    }

    /**
     * Main user sign-in route, using session with cookies via the frontend app.
     */
    async signIn({ request, auth }: HttpContext) {
        const { email, password, rememberMe } = await request.validateUsing(credentialsValidator)

        let user: User | null
        try {
            user = await User.verifyCredentials(email, password)
        } catch (error) {
            tryCatchLog(`failed to verify credentials for user with email ${email}`, error)
            return this.errorResponse(AppErrors.INVALID_CREDENTIALS, null, "Invalid credentials.")
        }

        if (user.isLocked) {
            logger.info(userLog(user, "tried to sign in but their account is locked"))
            return this.errorResponse(
                AppErrors.LOCKED,
                undefined,
                "Your account is locked. Please contact an administrator."
            )
        }

        try {
            await auth.use("session").login(user, rememberMe)
        } catch (error) {
            tryCatchLog(`failed to log in user with email ${email}`, error)
            return this.errorResponse(AppErrors.INTERNAL_SERVER_ERROR, undefined, "This user could not be logged in.")
        }

        logger.debug(userLog(user, "signed in successfully using session"))
        return this.successResponse<AuthenticatedUser>(user)
    }

    /**
     * Secondary sign-in route, using access (= bearer) tokens via the Authorization header.
     */
    async signInForBearer({ request }: HttpContext) {
        const { email, password, expiresIn } = await request.validateUsing(credentialsValidatorForBearer)

        let user: User | null
        try {
            user = await User.verifyCredentials(email, password)
        } catch (error) {
            tryCatchLog(`failed to verify credentials for user with email ${email}`, error)
            return this.errorResponse(AppErrors.INVALID_CREDENTIALS, null, "Invalid credentials.")
        }

        if (user.isLocked) {
            logger.info(userLog(user, "tried to sign in but their account is locked"))
            return this.errorResponse(
                AppErrors.LOCKED,
                undefined,
                "Your account is locked. Please contact an administrator."
            )
        }

        let accessToken: AccessToken
        try {
            accessToken = await User.accessTokens.create(user, AccessTokenScopeAbilities.unrestricted, {
                name: "Access token issued via credentials (unrestricted)",
                expiresIn: expiresIn || undefined,
            })
        } catch (error) {
            tryCatchLog(`failed to create access token for user with email ${email}`, error)
            return this.errorResponse(
                AppErrors.INTERNAL_SERVER_ERROR,
                undefined,
                "This access token could not be created."
            )
        }

        logger.debug(userLog(user, "signed in successfully, issuing a new access token"))
        return this.successResponse<AccessToken>(accessToken)
    }

    /**
     * Sign out user from the session.
     */
    async signOut({ auth }: HttpContext) {
        if (auth.use("session").isAuthenticated) await auth.use("session").logout()
        return this.successResponse()
    }

    /**
     * Returns wether the user is signed in or not (with no error).
     */
    async isSignedIn({ auth }: HttpContext) {
        return this.successResponse<boolean>(auth.use("session").isAuthenticated)
    }
}
