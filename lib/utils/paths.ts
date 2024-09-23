import path from "node:path"
import url from "node:url"

/**
 * The path to the root directory.
 */
export const rootPath = path.join(path.dirname(url.fileURLToPath(import.meta.url)), "..", "..")

/**
 * The path to the app directory.
 */
export const appPath = path.join(rootPath, "app")

/**
 * The path to the build directory.
 */
export const buildPath = path.join(rootPath, "build")
