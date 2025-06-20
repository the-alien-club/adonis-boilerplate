import BaseController from "#controllers/templates/base_controller"
import { userLog } from "#lib/utils/logger"
import { AccessTokenScopeAbilities } from "#lib/utils/access_tokens"
import Role from "#models/role"
import User from "#models/user"
import { credentialsValidator, userRegistrationValidator } from "#validators/auth_validator"
import { HttpContext } from "@adonisjs/core/http"
import logger from "@adonisjs/core/services/logger"
import { AppErrors } from "#lib/errors"

export default class AuthController extends BaseController {
    /**
     * Main user registration route.
     */
    async signup({ request }: HttpContext) {
        const { email, username, password, firstName, lastName, description } =
            await request.validateUsing(userRegistrationValidator)

        const obj = {
            isLocked: true,
            email,
            username,
            password,
            firstName: firstName || null,
            lastName: lastName || null,
            description: description || null,
        }

        // Non-isolated
        // Both email and username are unique, so we need to check if the user already exists.
        if (email && (await User.findBy("email", email))) return this.errorResponse(AppErrors.EMAIL_ALREADY_EXISTS)
        if (username && (await User.findBy("username", username))) {
            return this.errorResponse(AppErrors.USERNAME_ALREADY_EXISTS)
        }

        const user = await User.create(obj)

        const defaultRole = await Role.findBy("slug", "user")
        if (defaultRole) await user.related("roles").attach([defaultRole.id])
        else this.errorResponse(AppErrors.ROLE_NOT_FOUND, null, "The default role for users was not found.")

        logger.debug(userLog(user, "signed up successfully"))
        return this.successResponse(user)
    }

    /**
     * Main user sign-in route (issue an access token that will be stored inside the user's session storage).
     * Note that `expiresIn` is optional and is expressed in seconds.
     */
    async signin({ request }: HttpContext) {
        const { email, password, expiresIn } = await request.validateUsing(credentialsValidator)

        let user: User | null
        try {
            user = await User.verifyCredentials(email, password)
        } catch (error) {
            return this.errorResponse(AppErrors.INVALID_CREDENTIALS, null, "Invalid credentials.")
        }

        if (user.isLocked) {
            logger.info(userLog(user, "tried to sign in but their account is locked"))
            return this.errorResponse(
                AppErrors.LOCKED,
                null,
                "Your account is locked. Please contact an administrator."
            )
        }

        const accessToken = await User.accessTokens.create(user, AccessTokenScopeAbilities.unrestricted, {
            name: "Access token issued via credentials (unrestricted)",
            expiresIn: expiresIn || undefined,
        })

        logger.debug(userLog(user, "signed in successfully, issuing a new access token"))
        return this.successResponse(accessToken)
    }
}
