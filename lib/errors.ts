import { BaseErrors } from "#lib/utils/error_handling"
import { ErrorObj } from "#types/requests"

/**
 * Contains all the available errors for the application.
 */
export const AppErrors = {
    ...BaseErrors,
    //=====//
    // 400 //
    //=====//
    MISSING_PARAMETER: {
        status: 400,
        name: "MISSING_PARAMETER",
        message: "A parameter is missing.",
        data: null,
    },
    MISSING_AT_LEAST_ONE_PARAMETER: {
        status: 400,
        name: "MISSING_AT_LEAST_ONE_PARAMETER",
        message: "At least one parameter is required.",
        data: null,
    },
    INVALID_PARAMETER: {
        status: 400,
        name: "INVALID_PARAMETER",
        message: "Invalid parameter.",
        data: null,
    },
    EMPTY_DATA: {
        status: 400,
        name: "EMPTY_DATA",
        message: "Empty data is not allowed for this operation.",
        data: null,
    },
    INVALID_ACCESS_TOKEN_SCOPE: {
        status: 400,
        name: "INVALID_ACCESS_TOKEN_SCOPE",
        message: "Invalid access token scope.",
        data: null,
    },
    INVALID_ACCESS_TOKEN: {
        status: 400,
        name: "INVALID_ACCESS_TOKEN",
        message: "Invalid access token.",
        data: null,
    },
    INVALID_CREDENTIALS: {
        status: 400,
        name: "INVALID_CREDENTIALS",
        message: "Invalid credentials.",
        data: null,
    },
    //=====//
    // 401 //
    //=====//
    UNAUTHENTICATED: {
        status: 401,
        name: "UNAUTHENTICATED",
        message: "You are not authenticated. Please log in to access this resource.",
        data: null,
    },
    LOCKED: {
        status: 401,
        name: "LOCKED",
        message: "This account has been locked.",
        data: null,
    },
    YOU_CANNOT_LOCK_YOURSELF: {
        status: 401,
        name: "YOU_CANNOT_LOCK_YOURSELF",
        message: "You cannot lock yourself, why would you do that anyway??",
        data: null,
    },
    YOU_CANNOT_UNLOCK_YOURSELF: {
        status: 401,
        name: "YOU_CANNOT_UNLOCK_YOURSELF",
        message: "You cannot unlock yourself, would be too easy, right?",
        data: null,
    },
    //=====//
    // 404 //
    //=====//
    USER_NOT_FOUND: {
        status: 404,
        name: "USER_NOT_FOUND",
        message: "User not found.",
        data: null,
    },
    ACCESS_TOKEN_NOT_FOUND: {
        status: 404,
        name: "ACCESS_TOKEN_NOT_FOUND",
        message: "Access token not found.",
        data: null,
    },
    ROLE_NOT_FOUND: {
        status: 404,
        name: "ROLE_NOT_FOUND",
        message: "Role not found.",
        data: null,
    },
    //=====//
    // 409 //
    //=====//
    EMAIL_ALREADY_EXISTS: {
        status: 409,
        name: "EMAIL_ALREADY_EXISTS",
        message: "This email is already in use by another user.",
        data: null,
    },
    USERNAME_ALREADY_EXISTS: {
        status: 409,
        name: "USERNAME_ALREADY_EXISTS",
        message: "This username is already in use by another user.",
        data: null,
    },
    ROLE_ALREADY_EXISTS: {
        status: 409,
        name: "ROLE_ALREADY_EXISTS",
        message: "This role already exists.",
        data: null,
    },
} as const satisfies Record<string, ErrorObj>
