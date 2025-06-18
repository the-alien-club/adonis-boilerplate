/**
 * The scope of an access token that can be issued.
 */
export enum AccessTokenScope {
    UNRESTRICTED = "unrestricted",
    API_KEY = "api-key",
    API_SECRET = "api-secret",
}

/**
 * A list of all available access token abilities.
 */
export enum AccessTokenAbility {
    // Unrestricted / all abilities
    UNRESTRICTED = "*",

    // Roles
    ROLE_READ = "role:read",

    // Access tokens
    ACCESS_TOKEN_READ = "access-token:read",
    ACCESS_TOKEN_WRITE = "access-token:write",

    // Users
    USER_READ = "user:read",
    USER_WRITE = "user:write",
}
