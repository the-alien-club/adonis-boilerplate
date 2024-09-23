import {
    EC_EMAIL_ALREADY_EXISTS,
    EC_INVALID_CREDENTIALS,
    EC_LOCKED,
    EC_ROLE_NOT_FOUND,
    EC_USERNAME_ALREADY_EXISTS,
} from "#config/errors"
import BaseController from "#controllers/templates/base_controller"
import { userLog } from "#lib/utils/logger"
import { TokenScopeAbilities } from "#lib/utils/tokens"
import Role from "#models/role"
import User from "#models/user"
import { credentialsValidator, userRegistrationValidator } from "#validators/auth_validator"
import { HttpContext } from "@adonisjs/core/http"
import logger from "@adonisjs/core/services/logger"

export default class AuthController extends BaseController {
    /**
     * Main user registration route.
     */
    async register({ request }: HttpContext) {
        const { email, username, password, description } = await request.validateUsing(userRegistrationValidator)

        const obj = {
            isLocked: false,
            email,
            username,
            password,
            description: description || null,
        }

        // Both email and username are unique, so we need to check if the user already exists.
        if (email && (await User.findBy("email", email))) return this.errorResponse(EC_EMAIL_ALREADY_EXISTS)
        if (username && (await User.findBy("username", username))) return this.errorResponse(EC_USERNAME_ALREADY_EXISTS)

        const user = await User.create(obj)

        const defaultRole = await Role.findBy("name", "user")
        if (defaultRole) await user.related("roles").attach([defaultRole.id])
        else this.errorResponse(EC_ROLE_NOT_FOUND, null, "The default role for users was not found.")

        logger.debug(userLog(user, "registered successfully"))
        return this.successResponse(user)
    }

    /**
     * Main user sign-in route (issue a token that will be stored inside the user's session storage).
     */
    async signIn({ request }: HttpContext) {
        const { email, username, password } = await request.validateUsing(credentialsValidator)

        let user: User | null

        try {
            if (email) user = await User.verifyCredentials(email, password)
            else user = await User.verifyCredentials(username as string, password)
        } catch (error) {
            return this.errorResponse(EC_INVALID_CREDENTIALS, null, "Invalid credentials.")
        }

        if (user.isLocked) {
            logger.info(userLog(user, "tried to sign in but their account is locked"))
            return this.errorResponse(EC_LOCKED, null, "Your account is locked. Please contact an administrator.")
        }

        const token = await User.tokens.create(user, TokenScopeAbilities.unrestricted, {
            name: "Token issued via credentials (unrestricted)",
        })

        logger.debug(userLog(user, "signed in successfully, issuing a new token"))
        return this.successResponse(token)
    }
}
