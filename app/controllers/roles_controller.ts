import { EC_ROLE_ALREADY_EXISTS, EC_ROLE_NOT_FOUND, EC_UNAUTHORIZED } from "#config/errors"
import BaseController from "#controllers/templates/base_controller"
import type { HttpContext } from "@adonisjs/core/http"
import RolePolicy from "#policies/role_policy"
import Role from "#models/role"
import User from "#models/user"
import { roleCreationValidator, roleUpdateValidator } from "#validators/role_validator"

export default class RolesController extends BaseController {
    /**
     * Get all user's roles.
     */
    async index({ auth, bouncer, request }: HttpContext) {
        if (!auth.user) this.errorResponse(EC_UNAUTHORIZED)

        if (await bouncer.with(RolePolicy).denies("index")) {
            return this.errorResponse(EC_UNAUTHORIZED)
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
     * Note: This route is only accessible by admins to get ALL data.
     */
    async adminIndex({ bouncer, request }: HttpContext) {
        if (await bouncer.with(RolePolicy).denies("adminIndex")) {
            return this.errorResponse(EC_UNAUTHORIZED)
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
    async store({ bouncer, request }: HttpContext) {
        if (await bouncer.with(RolePolicy).denies("store")) {
            return this.errorResponse(EC_UNAUTHORIZED)
        }

        const { name, description } = await request.validateUsing(roleCreationValidator)

        if (name && (await Role.findBy("name", name))) return this.errorResponse(EC_ROLE_ALREADY_EXISTS)

        const role = await Role.create({ name, description })
        return this.successResponse(role)
    }

    /**
     * Get role by ID.
     */
    async show({ bouncer, params }: HttpContext) {
        const role = await Role.find(params.role_id)
        if (!role) return this.errorResponse(EC_ROLE_NOT_FOUND)

        if (await bouncer.with(RolePolicy).denies("show", role)) {
            return this.errorResponse(EC_UNAUTHORIZED)
        }

        return this.successResponse(role)
    }

    /**
     * Update a role.
     */
    async update({ bouncer, request, params }: HttpContext) {
        if (await bouncer.with(RolePolicy).denies("update")) {
            return this.errorResponse(EC_UNAUTHORIZED)
        }

        const role = await Role.find(params.role_id)
        if (!role) return this.errorResponse(EC_ROLE_NOT_FOUND)

        const { name, description } = await request.validateUsing(roleUpdateValidator)

        role.name = name || role.name
        role.description = description || role.description
        await role.save()

        return this.successResponse(role)
    }

    /**
     * Delete a role.
     */
    async destroy({ bouncer, params }: HttpContext) {
        if (await bouncer.with(RolePolicy).denies("destroy")) {
            return this.errorResponse(EC_UNAUTHORIZED)
        }

        const role = await Role.find(params.role_id)
        if (!role) return this.errorResponse(EC_ROLE_NOT_FOUND)

        await role.delete()
        return this.successResponse(role)
    }
}
