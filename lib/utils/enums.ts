/**
 * The scope of a token that can be issued.
 */
export enum TokenScope {
    UNRESTRICTED = "unrestricted",
    API_KEY = "api-key",
    API_SECRET = "api-secret",
}

/**
 * A list of all available token abilities.
 */
export enum TokenAbility {
    // Unrestricted / all abilities
    UNRESTRICTED = "*",

    // Roles
    ROLE_READ = "role:read",

    // Tokens
    TOKEN_READ = "token:read",
    TOKEN_WRITE = "token:write",

    // Users
    USER_READ = "user:read",
    USER_WRITE = "user:write",
}
