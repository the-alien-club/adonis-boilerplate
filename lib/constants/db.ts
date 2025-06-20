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
     * The maximum length of the name column for all tables.
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
     * The maximum length of the description column for all tables.
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
}

export default DB_CONSTANTS
