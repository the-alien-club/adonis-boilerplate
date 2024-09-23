import cp from "node:child_process"
import os from "node:os"

/**
 * Get the name of the host on which the application is running.
 * @returns The name of the host.
 */
export function getHostname() {
    switch (process.platform) {
        case "win32":
            return process.env.COMPUTERNAME
        case "darwin":
            return cp.execSync("scutil --get ComputerName").toString().trim()
        case "linux":
            const prettyName = cp.execSync("hostnamectl --pretty").toString().trim()
            return prettyName === "" ? os.hostname() : prettyName
        default:
            return os.hostname()
    }
}
