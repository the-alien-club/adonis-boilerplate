import type { IndexedRequestMeta } from "#types/adonis"
import { inject } from "@adonisjs/core"
import {
    getIndexedRequestQueryOptionsValidator,
    getPeriodRequestQueryOptionsValidator,
    PeriodOption,
} from "#validators/base_controller_validator"
import type { Infer } from "@vinejs/vine/types"

// Warning: Adding "type" to this import will BREAK the injection system.
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HttpContext } from "@adonisjs/core/http"
import type { SuccessfulRequest, ErrorObj, FailedRequest } from "#lib/utils/error_handling"

/**
 * The type for the input query options that can be applied to the indexation methods.
 */
export type IndexedRequestQueryOptionsInput = Infer<typeof getIndexedRequestQueryOptionsValidator>

/**
 * The type for the parsed query options that can be applied to the indexation methods.
 */
export type IndexedRequestQueryOptions = Required<Infer<typeof getIndexedRequestQueryOptionsValidator>>

/**
 * The type for the input query options that can be applied to period-based methods.
 */
export type PeriodRequestQueryOptionsInput = Omit<
    Infer<typeof getPeriodRequestQueryOptionsValidator>,
    "start" | "end"
> & {
    start: string // ISO date string
    end: string // ISO date string
}

/**
 * The type for the parsed query options that can be applied to period-based methods.
 */
export type PeriodRequestQueryOptions = Infer<typeof getPeriodRequestQueryOptionsValidator> & {
    dateTrunc: string // Period converted into an SQL "DATE_TRUNC" compatible string
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
     * @param request The HTTP context request.
     * @returns The result object (pagination & sorting).
     */
    protected async getIndexedRequestQueryOptions(
        request: HttpContext["request"]
    ): Promise<IndexedRequestQueryOptions> {
        const {
            page = 1,
            limit = 10,
            orderBy = "created_at",
            direction = "desc",
        } = await request.validateUsing(getIndexedRequestQueryOptionsValidator)

        return { page, limit, orderBy, direction }
    }

    /**
     * Get the query options that can be applied to period-based methods.
     * @param request The HTTP context request.
     * @returns The result object (period, start date, end date & `dateTrunc`).
     */
    protected async getPeriodRequestQueryOptions(request: HttpContext["request"]): Promise<PeriodRequestQueryOptions> {
        const { period, start, end } = await request.validateUsing(getPeriodRequestQueryOptionsValidator)

        let dateTrunc: string
        switch (period) {
            case PeriodOption.LIVE:
                dateTrunc = "DATE_TRUNC('minute', created_at)" // By minute
                break
            case PeriodOption.DAILY:
                dateTrunc = "DATE_TRUNC('hour', created_at)" // By hour
                break
            case PeriodOption.WEEKLY:
                dateTrunc = "DATE_TRUNC('week', created_at)" // By week
                break
            case PeriodOption.MONTHLY:
                dateTrunc = "DATE_TRUNC('month', created_at)" // By month
                break
        }

        return { period, start, end, dateTrunc }
    }
}
