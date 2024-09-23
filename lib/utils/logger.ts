import User from "#models/user"

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
