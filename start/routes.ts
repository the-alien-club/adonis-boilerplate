import { middleware } from "#start/kernel"
import router from "@adonisjs/core/services/router"

const AccessTokensController = () => import("#controllers/access_tokens_controller")
const AuthController = () => import("#controllers/auth_controller")
const GeneralController = () => import("#controllers/general_controller")
const RolesController = () => import("#controllers/roles_controller")
const UsersController = () => import("#controllers/users_controller")

// ============
//  Home route
// ============
router.get("/", async ({ response }) => {
    // For now, the default route is the status route.
    response.redirect("/status")
})

// ==========================================
//  General routes (for health checks, etc.)
// ==========================================
router.get("/status", [GeneralController, "status"])

// =========================================
//  Authentication routes (via credentials)
// =========================================
router.post("/signup", [AuthController, "signup"])
router.post("/signin", [AuthController, "signin"])

// ==================================================================
//  Logged-in user routes: Accessible via credentials / access token
// ==================================================================
router
    .group(() => {
        // Roles
        router.get("/roles", [RolesController, "index"])

        // Roles by ID
        router.get("/roles/:role_id", [RolesController, "show"])

        // Access tokens
        router.get("/access-tokens", [AccessTokensController, "index"])
        router.post("/access-tokens", [AccessTokensController, "store"])

        // Access tokens by ID
        router.get("/access-tokens/:access_token_id", [AccessTokensController, "show"])
        router.patch("/access-tokens/:access_token_id", [AccessTokensController, "update"])
        router.delete("/access-tokens/:access_token_id", [AccessTokensController, "destroy"])

        // User self-management
        router.get("/users/:user_id", [UsersController, "show"])
        router.patch("/users/:user_id", [UsersController, "update"])
        router.delete("/users/:user_id", [UsersController, "destroy"])
    })
    .use(middleware.auth({ guards: ["base64credentials", "accessTokens"] }))

// =================================================================
//  Administrator only routes: Accessible via credentials / session
// =================================================================
router
    .group(() => {
        // Special routes to recover all data from a model
        router.get("/roles", [RolesController, "adminIndex"])
        router.get("/access-tokens", [AccessTokensController, "adminIndex"])
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
    .use(middleware.auth({ guards: ["base64credentials", "accessTokens"] }))
    .use(middleware.role({ role: "administrator" }))
