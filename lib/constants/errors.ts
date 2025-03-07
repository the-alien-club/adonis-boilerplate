export type AdditionalData = { [key: string]: any } | string | string[] | number | number[] | null

/**
 * An error code object that can be used to standardize error handling.
 */
export type ErrorCode = {
    status: number // HTTP Status Code
    name: string // Error Name (e.g. "Error")
    message: string // Standard Error Message (describes the issue globally)
    data: AdditionalData // Additional data (optional)
}

//=====//
// 400 //
//=====//

/** ERROR CODE (EC) [400] */
export const EC_MISSING_PARAMETER: ErrorCode = {
    status: 400,
    name: "MISSING_PARAMETER",
    message: "A parameter is missing.",
    data: null,
}

/** ERROR CODE (EC) [400] */
export const EC_MISSING_AT_LEAST_ONE_PARAMETER: ErrorCode = {
    status: 400,
    name: "MISSING_AT_LEAST_ONE_PARAMETER",
    message: "At least one parameter is required.",
    data: null,
}

/** ERROR CODE (EC) [400] */
export const EC_INVALID_PARAMETER: ErrorCode = {
    status: 400,
    name: "INVALID_PARAMETER",
    message: "Invalid parameter.",
    data: null,
}

/** ERROR CODE (EC) [400] */
export const EC_EMPTY_DATA: ErrorCode = {
    status: 400,
    name: "EC_EMPTY_DATA",
    message: "Empty data is not allowed for this operation.",
    data: null,
}

/** ERROR CODE (EC) [400] */
export const EC_INVALID_TOKEN_SCOPE: ErrorCode = {
    status: 400,
    name: "INVALID_TOKEN_SCOPE",
    message: "Invalid token scope.",
    data: null,
}

/** ERROR CODE (EC) [400] */
export const EC_INVALID_TOKEN: ErrorCode = {
    status: 400,
    name: "INVALID_TOKEN",
    message: "Invalid token.",
    data: null,
}

/** ERROR CODE (EC) [400] */
export const EC_INVALID_CREDENTIALS: ErrorCode = {
    status: 400,
    name: "INVALID_CREDENTIALS",
    message: "Invalid credentials.",
    data: null,
}

//=====//
// 401 //
//=====//

/** ERROR CODE (EC) [401] */
export const EC_UNAUTHORIZED: ErrorCode = {
    status: 401,
    name: "UNAUTHORIZED",
    message: "You are not authorized to perform this action.",
    data: null,
}

/** ERROR CODE (EC) [401] */
export const EC_UNAUTHENTICATED: ErrorCode = {
    status: 401,
    name: "UNAUTHENTICATED",
    message: "You are not authenticated. Please log in to access this resource.",
    data: null,
}

/** ERROR CODE (EC) [401] */
export const EC_LOCKED: ErrorCode = {
    status: 401,
    name: "LOCKED",
    message: "This account has been locked.",
    data: null,
}

/** ERROR CODE (EC) [401] */
export const EC_YOU_CANNOT_LOCK_YOURSELF: ErrorCode = {
    status: 401,
    name: "YOU_CANNOT_LOCK_YOURSELF",
    message: "You cannot lock yourself, why would you do that anyway??",
    data: null,
}

/** ERROR CODE (EC) [401] */
export const EC_YOU_CANNOT_UNLOCK_YOURSELF: ErrorCode = {
    status: 401,
    name: "YOU_CANNOT_UNLOCK_YOURSELF",
    message: "You cannot unlock yourself, would be too easy, right?",
    data: null,
}

//=====//
// 404 //
//=====//

/** ERROR CODE (EC) [404] */
export const EC_USER_NOT_FOUND: ErrorCode = {
    status: 404,
    name: "USER_NOT_FOUND",
    message: "User not found.",
    data: null,
}

/** ERROR CODE (EC) [404] */
export const EC_TOKEN_NOT_FOUND: ErrorCode = {
    status: 404,
    name: "TOKEN_NOT_FOUND",
    message: "Token not found.",
    data: null,
}

/** ERROR CODE (EC) [404] */
export const EC_ROLE_NOT_FOUND: ErrorCode = {
    status: 404,
    name: "ROLE_NOT_FOUND",
    message: "Role not found.",
    data: null,
}

//=====//
// 405 //
//=====//

/** ERROR CODE (EC) [405] */
export const EC_METHOD_NOT_ALLOWED: ErrorCode = {
    status: 405,
    name: "METHOD_NOT_ALLOWED",
    message: "Method not allowed.",
    data: null,
}

//=====//
// 409 //
//=====//

/** ERROR CODE (EC) [409] */
export const EC_EMAIL_ALREADY_EXISTS: ErrorCode = {
    status: 409,
    name: "EMAIL_ALREADY_EXISTS",
    message: "This email is already in use by another user.",
    data: null,
}

/** ERROR CODE (EC) [409] */
export const EC_USERNAME_ALREADY_EXISTS: ErrorCode = {
    status: 409,
    name: "USERNAME_ALREADY_EXISTS",
    message: "This username is already in use by another user.",
    data: null,
}

/** ERROR CODE (EC) [409] */
export const EC_ROLE_ALREADY_EXISTS: ErrorCode = {
    status: 409,
    name: "ROLE_ALREADY_EXISTS",
    message: "This role already exists.",
    data: null,
}

//=====//
// 500 //
//=====//

/** ERROR CODE (EC) [500-0] */
export const EC_INTERNAL_SERVER_ERROR: ErrorCode = {
    status: 500,
    name: "INTERNAL_SERVER_ERROR",
    message: "Internal server error.",
    data: null,
}

//=====//
// 999 //
//=====//

/** ERROR CODE (EC) [999] */
export const EC_UNKNOWN_ERROR: ErrorCode = {
    status: 999,
    name: "UNKNOWN_ERROR",
    message: "An unknown error occurred.",
    data: null,
}
