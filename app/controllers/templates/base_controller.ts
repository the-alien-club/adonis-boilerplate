import type { SuccessfulRequest, ErrorObj, FailedRequest } from "#lib/utils/error_handling"
import type { IndexedRequestMeta } from "#types/adonis"
import { inject } from "@adonisjs/core"
// Warning: Adding "type" to this import will BREAK the injection system.
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HttpContext } from "@adonisjs/core/http"

/**
 * The type for query options that can be applied to the indexation methods.
 */
export type IndexedRequestQueryOptions = {
    page: number
    limit: number
    orderBy: string
    direction: "asc" | "desc"
}

@inject()
export default class BaseController {
    constructor(protected ctx: HttpContext) {}

    /**
     * A private method to check data validity.
     * @param data The data to be checked.
     * @returns Whether the data is valid.
     */
    private _checkDataValidity(data: unknown) {
        if (data === undefined || data === null) return false
        return true
    }

    /**
     * Returns a properly formatted success response.
     * @param data Data to be sent in the response (optional, defaults to `null`).
     * @param meta Metadata to be sent in the response (optional, used for pagination).
     * @returns The success response object.
     */
    protected async successResponse<T>(data?: any): Promise<SuccessfulRequest<T>>
    protected async successResponse<T>(
        data: any,
        meta: any
    ): Promise<SuccessfulRequest<T> & { meta: IndexedRequestMeta }>
    protected async successResponse<T>(data?: any, meta?: any): Promise<SuccessfulRequest<T>> {
        // Include meta (on top) only if it exists
        if (meta) {
            const response = {
                success: true,
                meta: meta,
                data: this._checkDataValidity(data) ? data : null,
            }

            this.ctx.response.send(response)
            return response as SuccessfulRequest<T>
        }

        const response = {
            success: true,
            data: this._checkDataValidity(data) ? data : null,
        }

        this.ctx.response.send(response)
        return response as SuccessfulRequest<T>
    }

    /**
     * Returns a properly formatted error response, based on error constants.
     * @param error Error code constant to be sent in the response.
     * @param data Additional data to be sent in the response (optional).
     * @param message Error message to be sent in the response (optional, defaults to the internal error message).
     * @returns Null for Tuyau type inference.
     */
    protected async errorResponse(error: ErrorObj, data: unknown | null = null, message?: string) {
        const response: FailedRequest = {
            success: false,
            message: message ?? error.message,
            error: this._checkDataValidity(data) ? { ...error, data } : error,
        }

        this.ctx.response.status(error.status).send(response)
    }

    /**
     * Get the query options or their default values that can be applied to the indexation methods.
     * @param queries The request queries record.
     * @returns The options object (pagination & sorting).
     */
    protected getQueryOptions(queries: Record<string, any>): IndexedRequestQueryOptions {
        const page = queries.page ? Number(queries.page) : 1
        const limit = queries.limit ? Number(queries.limit) : 10
        const orderBy = queries.orderBy ? queries.orderBy : "created_at"
        const direction = queries.direction ? queries.direction : "desc"

        return { page, limit, orderBy, direction }
    }
}
