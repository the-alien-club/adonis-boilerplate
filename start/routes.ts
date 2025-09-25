import { BaseRole } from "#database/seeders/roles_seeder"
import { AppErrors } from "#lib/errors"
import type { FailedRequest } from "#lib/utils/error_handling"
import { middleware } from "#start/kernel"
import { authThrottle } from "#start/limiter"
import router from "@adonisjs/core/services/router"

const AccessTokensController = () => import("#controllers/access_tokens_controller")
const AuthController = () => import("#controllers/auth_controller")
const GeneralController = () => import("#controllers/general_controller")
const OpenApiController = () => import("#controllers/openapi_controller")
const RolesController = () => import("#controllers/roles_controller")
const UsersController = () => import("#controllers/users_controller")

// ============
//  Home route
// ============
// For now, the default route is the status route.
router.get("/", async ({ response }) => response.redirect("/status"))

// ==========================================
//  General routes (for health checks, etc.)
// ==========================================
router.get("/status", [GeneralController, "status"])

// ====================================
//  OpenAPI routes (for documentation)
// ====================================
router.get("/openapi", [OpenApiController, "spec"])

// =======================
//  Authentication routes
// =======================
router
    .group(() => {
        router.post("/sign-up", [AuthController, "signUp"])
        router.post("/sign-in", [AuthController, "signIn"])
        router.post("/sign-in/bearer", [AuthController, "signInForBearer"])
        router.get("/is-signed-in", [AuthController, "isSignedIn"])
        router.post("/sign-out", [AuthController, "signOut"])
    })
    .use(authThrottle)

// ==============================================================
//  Public routes: Accessible without credentials / access token
// ==============================================================
// Users
router
    .group(() => {
        router.get("/users/exists", [UsersController, "exists"]).use(authThrottle)
        router.get("/users/batch", [UsersController, "showBatch"])
        router.get("/users/:user_id", [UsersController, "show"])
    })
    .use(middleware.silentAuth({ guards: ["api", "session"] }))

// ==================================================================
//  Logged-in user routes: Accessible via credentials / access token
// ==================================================================
router
    .group(() => {
        // Access tokens
        router.get("/access-tokens", [AccessTokensController, "index"])
        router.post("/access-tokens", [AccessTokensController, "store"])
        router.post("/access-tokens/revoke", [AccessTokensController, "revoke"])

        // Access tokens by ID
        router.get("/access-tokens/:access_token_id", [AccessTokensController, "show"])
        router.patch("/access-tokens/:access_token_id", [AccessTokensController, "update"])
        router.delete("/access-tokens/:access_token_id", [AccessTokensController, "destroy"])

        // Roles
        router.get("/roles", [RolesController, "index"])
        router.get("/roles/batch", [RolesController, "showBatch"])

        // Roles by ID
        router.get("/roles/:role_id", [RolesController, "show"])

        // User
        router.get("/users/me", [UsersController, "me"])

        // Users by ID
        router.patch("/users/:user_id", [UsersController, "update"])
        router.delete("/users/:user_id", [UsersController, "destroy"])
    })
    .use(middleware.auth({ guards: ["api", "session"] }))

// =================================================================
//  Administrator only routes: Accessible via credentials / session
// =================================================================
router
    .group(() => {
        // Special routes to recover all data from a model
        router.get("/access-tokens", [AccessTokensController, "adminIndex"])
        router.get("/roles", [RolesController, "adminIndex"])
        router.get("/users", [UsersController, "adminIndex"])

        // Roles management
        router.post("/roles", [RolesController, "store"])
        router.patch("/roles/:role_id", [RolesController, "update"])
        router.delete("/roles/:role_id", [RolesController, "destroy"])

        // User's access tokens management
        router.get("/access-tokens/:user_id", [AccessTokensController, "index"])
        router.post("/access-tokens/:user_id", [AccessTokensController, "store"])
        router.get("/access-tokens/:user_id/:access_token_id", [AccessTokensController, "show"])
        router.patch("/access-tokens/:user_id/:access_token_id", [AccessTokensController, "update"])
        router.delete("/access-tokens/:user_id/:access_token_id", [AccessTokensController, "destroy"])

        // Special routes to lock/unlock users
        router.patch("users/:user_id/lock", [UsersController, "lock"])
        router.patch("users/:user_id/unlock", [UsersController, "unlock"])
    })
    .prefix("/admin")
    .use(middleware.auth({ guards: ["api", "session"] }))
    .use(middleware.role({ role: BaseRole.ADMIN }))

// =======================================================================
//  404 route to prevent errors from being thrown (information leak risk)
// =======================================================================
router.any("*", ({ response }) => {
    return response.status(AppErrors.NOT_FOUND.status).send({
        success: false,
        message: "This API route does not exist.",
        error: AppErrors.NOT_FOUND,
    } satisfies FailedRequest)
})
