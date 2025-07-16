import BaseController from "#controllers/templates/base_controller"
import type { HttpContext } from "@adonisjs/core/http"
import RolePolicy from "#policies/role_policy"
import Role from "#models/role"
import type User from "#models/user"
import { roleCreationValidator, roleUpdateValidator } from "#validators/role_validator"
import { AppErrors } from "#lib/errors"
import { tryCatchLog } from "#lib/utils/logger"
import { isValidIntId } from "#lib/utils/miscellaneous"

export default class RolesController extends BaseController {
    /**
     * Get all user's roles.
     */
    async index({ auth, bouncer, request }: HttpContext) {
        if (await bouncer.with(RolePolicy).denies("index")) {
            return this.errorResponse(AppErrors.UNAUTHORIZED)
        }

        const queries = request.qs()
        const options = this.getQueryOptions(queries)

        const roles = await (auth.user as User)
            .related("roles")
            .query()
            .orderBy(options.orderBy, options.direction)
            .paginate(options.page, options.limit)

        const tmp = roles.toJSON()
        return this.successResponse(tmp.data, tmp.meta)
    }

    /**
     * Get all roles.
     *
     * Note: This route is only accessible by admins in order to get ALL data.
     */
    async adminIndex({ bouncer, request }: HttpContext) {
        if (await bouncer.with(RolePolicy).denies("adminIndex")) {
            return this.errorResponse(AppErrors.UNAUTHORIZED)
        }

        const queries = request.qs()
        const options = this.getQueryOptions(queries)

        const roles = await Role.query()
            .orderBy(options.orderBy, options.direction)
            .paginate(options.page, options.limit)

        const tmp = roles.toJSON()
        return this.successResponse(tmp.data, tmp.meta)
    }

    /**
     * Add a new role.
     */
    async store({ auth, bouncer, request }: HttpContext) {
        if (await bouncer.with(RolePolicy).denies("store")) {
            return this.errorResponse(AppErrors.UNAUTHORIZED)
        }

        const { name, slug, description } = await request.validateUsing(roleCreationValidator)

        // Non-isolated
        if (await Role.findBy("slug", slug)) return this.errorResponse(AppErrors.ROLE_ALREADY_EXISTS)

        let role: Role
        try {
            role = await Role.create({ name, description })
        } catch (error) {
            tryCatchLog(`failed to create role with slug ${slug}`, error, auth.user)
            return this.errorResponse(AppErrors.INTERNAL_SERVER_ERROR, undefined, "This role could not be created.")
        }

        return this.successResponse(role)
    }

    /**
     * Get role by ID.
     */
    async show({ bouncer, params }: HttpContext) {
        if (!isValidIntId(params.role_id)) {
            return this.errorResponse(AppErrors.MISSING_PARAMETER, undefined, "Role ID is required.")
        }

        const role = await Role.find(params.role_id)
        if (!role) return this.errorResponse(AppErrors.ROLE_NOT_FOUND)

        if (await bouncer.with(RolePolicy).denies("show", role)) {
            return this.errorResponse(AppErrors.UNAUTHORIZED)
        }

        return this.successResponse(role)
    }

    /**
     * Update a role.
     */
    async update({ bouncer, request, params }: HttpContext) {
        if (await bouncer.with(RolePolicy).denies("update")) {
            return this.errorResponse(AppErrors.UNAUTHORIZED)
        }

        if (!isValidIntId(params.role_id)) {
            return this.errorResponse(AppErrors.MISSING_PARAMETER, undefined, "Role ID is required.")
        }

        const role = await Role.find(params.role_id)
        if (!role) return this.errorResponse(AppErrors.ROLE_NOT_FOUND)

        const { name, slug, description } = await request.validateUsing(roleUpdateValidator)

        role.name = name ?? role.name
        role.slug = slug ?? role.slug
        role.description = description ?? role.description
        await role.save()

        return this.successResponse(role)
    }

    /**
     * Delete a role.
     */
    async destroy({ auth, bouncer, params }: HttpContext) {
        if (await bouncer.with(RolePolicy).denies("destroy")) {
            return this.errorResponse(AppErrors.UNAUTHORIZED)
        }

        if (!isValidIntId(params.role_id)) {
            return this.errorResponse(AppErrors.MISSING_PARAMETER, undefined, "Role ID is required.")
        }

        const role = await Role.find(params.role_id)
        if (!role) return this.errorResponse(AppErrors.ROLE_NOT_FOUND)

        try {
            await role.delete()
        } catch (error) {
            tryCatchLog(`failed to delete role ${params.role_id}`, error, auth.user)
            return this.errorResponse(AppErrors.INTERNAL_SERVER_ERROR, undefined, "This role could not be deleted.")
        }

        return this.successResponse(role)
    }
}
