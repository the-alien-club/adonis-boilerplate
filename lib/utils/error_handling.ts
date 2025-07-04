import { stringify } from "#lib/utils/json"
import { ErrorObj, FailedRequest } from "#types/requests"

/**
 * Formats an `ErrorObj` into a standard error sent back by an API endpoint.
 */
export function formatErrorResponse(error: ErrorObj, customMessage?: string, additionalData?: unknown) {
    let err: ErrorObj
    if (additionalData) err = { ...error, data: additionalData }
    else err = error

    return {
        success: false,
        message: customMessage || error.message,
        error: err,
    }
}

/**
 * Formats an `ErrorObj` and stringifies it for it to be supported by the `Error` class.
 * @param error The `ErrorObj` object to format.
 * @param message Replaces the standard error message with a custom one (optional).
 * @param additionalData Additional data to include in the error (optional).
 * @returns The formatted error string.
 */
export function stringifyError(error: ErrorObj, message?: string, additionalData?: unknown): string {
    if (message) error.message = message

    let err: ErrorObj
    if (additionalData) err = { ...error, data: additionalData }
    else err = error

    // Allow special keys in the JSON stringification
    const allowSpecialKeys = (_: string, value: unknown) => {
        if (typeof value === "function") return value.toString()
        if (typeof value === "bigint") return value.toString()

        return value
    }

    return JSON.stringify(err, allowSpecialKeys, 4)
}

/**
 * Parse the error of a CRUD call and return a standardized error.
 * @param error The error to parse.
 * @returns The standardized error object.
 */
export function parseCRUDError(error: unknown): FailedRequest {
    let errorString = ""

    try {
        try {
            // biome-ignore lint/suspicious/noExplicitAny: Cannot infer the type of the error
            errorString = (error as any).toString()
        } catch (_) {
            errorString = stringify(error)
        }
    } catch (_) {
        errorString = "Unknown error"
    }

    return {
        success: false,
        message: "An error occurred while performing a CRUD operation.",
        error: {
            status: 500,
            name: "CRUD_ERROR",
            message: "CRUD operation failed.",
            data: {
                rawError: error,
                error: errorString,
            },
        },
    }
}

/**
 * Formats a message and an error object into a JSON string that follows the `FailedRequest` standard,
 * the goal is to not end up with special characters such as newlines in the message, so it can be parsed
 * back into an object without issues.
 * @param message The message to format.
 * @param error The error object to format.
 * @returns The formatted JSON string.
 */
export function formatMessageAsStringifiedError(message: string, error?: unknown): string {
    let errorObj: ErrorObj = {
        status: 500,
        name: "UNKNOWN_ERROR",
        message: "An unknown error occurred.",
        data: null,
    }

    if (error) {
        try {
            // Testing with JSON.stringify to see if it's a valid JSON object
            stringify(error, 4)

            errorObj = error as ErrorObj
        } catch {
            // Convert the error to a basic non-escaped string
            errorObj = {
                ...errorObj,
                data: {
                    rawError: `${error}`,
                },
            }
        }
    }

    const res = stringify({
        success: false,
        message,
        error: errorObj,
    })

    // Ensure that no "Error: " or line break ends up in the message
    return res.replaceAll("Error: ", "").replaceAll("\n", " ")
}

/**
 * Contains all the standard available errors for the application, it serves as a base
 * to extend with your custom errors.
 *
 * The recommended way is to create an `AppErrors` object that extends this one, preferably
 * at a place similar to `lib/utils/errors.ts`:
 * ```typescript
 * import { BaseErrors } from "..."
 *
 * export const AppErrors = {
 *     ...BaseErrors,
 *     //=====//
 *	    // 401 //
 *	    //=====//
 *     BLAH_BLAH: {
 *         status: 401,
 *         name: "BlahBlah",
 *         message: "Blah blah blah.",
 *         data: null,
 *     },
 * }
 * ```
 */
export const BaseErrors = {
    //=====//
    // 400 //
    //=====//
    BAD_REQUEST: {
        status: 400,
        name: "BadRequest",
        message: "Bad request.",
        data: null,
    },
    //=====//
    // 401 //
    //=====//
    UNAUTHORIZED: {
        status: 401,
        name: "Unauthorized",
        message: "Unauthorized.",
        data: null,
    },
    //=====//
    // 402 //
    //=====//
    PAYMENT_REQUIRED: {
        status: 402,
        name: "PaymentRequired",
        message: "Payment required.",
        data: null,
    },
    //=====//
    // 403 //
    //=====//
    FORBIDDEN: {
        status: 403,
        name: "Forbidden",
        message: "Forbidden.",
        data: null,
    },
    //=====//
    // 404 //
    //=====//
    NOT_FOUND: {
        status: 404,
        name: "NotFound",
        message: "Not found.",
        data: null,
    },
    //=====//
    // 405 //
    //=====//
    METHOD_NOT_ALLOWED: {
        status: 405,
        name: "MethodNotAllowed",
        message: "Method not allowed.",
        data: null,
    },
    //=====//
    // 408 //
    //=====//
    REQUEST_TIMEOUT: {
        status: 408,
        name: "RequestTimeout",
        message: "Request timed out.",
        data: null,
    },
    //=====//
    // 409 //
    //=====//
    CONFLICT: {
        status: 409,
        name: "Conflict",
        message: "Conflict.",
        data: null,
    },
    //=====//
    // 500 //
    //=====//
    INTERNAL_SERVER_ERROR: {
        status: 500,
        name: "InternalServerError",
        message: "Internal server error.",
        data: null,
    },
    BACKEND_FUNCTION_RUNNING_ON_CLIENT: {
        status: 500,
        name: "BackendFunctionRunningOnClient",
        message: "A function reserved for the backend is running on the client.",
        data: null,
    },
    //=====//
    // 501 //
    //=====//
    NOT_IMPLEMENTED: {
        status: 501,
        name: "NotImplemented",
        message: "Not implemented.",
        data: null,
    },
    //=====//
    // 509 //
    //=====//
    BANDWIDTH_LIMIT_EXCEEDED: {
        status: 509,
        name: "BandwidthLimitExceeded",
        message: "Bandwidth limit exceeded.",
        data: null,
    },
} as const satisfies Record<string, ErrorObj>
