/**
 * Database-related constants for user and content validation.
 */
const DB_CONSTANTS = {
    /**
     * The minimum length of a username.
     */
    MIN_USERNAME_LENGTH: 4,

    /**
     * The maximum length of a username.
     */
    MAX_USERNAME_LENGTH: 32,

    /**
     * The minimum length of a password.
     */
    MIN_PASSWORD_LENGTH: 8,

    /**
     * The maximum length of a password.
     */
    MAX_PASSWORD_LENGTH: 255,

    /**
     * The maximum length of a name.
     */
    MAX_NAME_LENGTH: 255,

    /**
     * The regex pattern for a valid username.
     */
    USERNAME_REGEX: /^[a-z0-9_-]+$/,

    /**
     * The maximum length of a slug.
     */
    MAX_SLUG_LENGTH: 255,

    /**
     * The regex pattern for a valid slug.
     */
    SLUG_REGEX: /^[a-z0-9_-]+$/,

    /**
     * The maximum length of a description.
     */
    MAX_DESCRIPTION_LENGTH: 255,

    /**
     * The maximum length of a URL.
     */
    MAX_URL_LENGTH: 2048,

    /**
     * The maximum length of a mime type.
     */
    MAX_MIME_TYPE_LENGTH: 255,

    /**
     * The maximum length of a file extension.
     */
    MAX_EXTENSION_LENGTH: 255,

    /**
     * The maximum length of a node type.
     */
    MAX_NODE_TYPE_LENGTH: 255,

    /**
     * The maximum length of an AI model version (generally a branch name, commit ID, UUID or string).
     */
    MAX_AI_MODEL_VERSION_LENGTH: 255,

    /**
     * The maximum number of characters allowed for a piece of content (markdown, article, etc.).
     */
    MAX_CHARS_IN_CONTENT: 1_000_000, // ~= 1 MB <-> 6 MB

    /**
     * The maximum length of an API key or bearer token.
     */
    MAX_API_TOKEN_LENGTH: 1024,
}

export default DB_CONSTANTS
