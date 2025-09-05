import type User from "#models/user"
import logger from "@adonisjs/core/services/logger"

/**
 * Generates a log message based on a given user and action,
 * mostly used to log user's actions/events in backend.
 * @param user The user that performed the action.
 * @param action The action that was performed.
 * @returns The generated log message.
 */
export function userLog(user: User | undefined, action: string): string {
    if (!user) return `unknown user ${action}`

    return `user ${user.id} (${user.email || user.username || "..."}) ${action}`
}

/**
 * Logs for a try-catch block with an optional error object that turns into `Unknown Error`
 * if not provided or undefined.
 * @param message The message to log.
 * @param error The error object to log (optional).
 * @param user The user associated with the error (optional).
 */
export function tryCatchLog(message: string, error?: unknown, user?: User): void {
    const errorMessage = error instanceof Error ? error.message : "Unknown Error"
    logger.error(`${message}${user ? ` for user ${user.id}` : ""}: ${errorMessage}`)
}
