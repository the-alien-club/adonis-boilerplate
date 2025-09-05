import BaseController from "#controllers/templates/base_controller"
import env from "#start/env"
import type { HttpContext } from "@adonisjs/core/http"
import cache from "@adonisjs/cache/services/main"
import yaml from "js-yaml"
import type { OpenAPIV3_1 } from "openapi-types"

export default class OpenApiController extends BaseController {
    /**
     * Overwrite a set of `requestBody` properties depending on a set of rules.
     * @param properties The properties to overwrite.
     */
    private _overwriteRequestBodyProperties(properties: { [key: string]: OpenAPIV3_1.SchemaObject }) {
        for (let name of Object.keys(properties)) {
            // All conditions
            if (name === "rememberMe") properties[name] = { type: "boolean" }
            if (name.startsWith("is")) properties[name] = { type: "boolean" }
            if (name === "expiresIn") properties[name] = { type: "number" }
            if (name.endsWith("Id")) properties[name] = { type: "number" }
            if (name.endsWith("Ids")) properties[name] = { type: "array", items: { type: "number" } }
        }

        return properties
    }

    /**
     * Overwrite the OpenAPI specification with new data.
     * @param rawSpec The raw OpenAPI specification to overwrite.
     * @returns The updated OpenAPI document.
     */
    private async _overwriteSpec(rawSpec: string) {
        const doc = yaml.load(rawSpec) as OpenAPIV3_1.Document

        if (doc.paths) {
            for (let [path, pathItem] of Object.entries(doc.paths)) {
                for (let [method, operation] of Object.entries(pathItem as OpenAPIV3_1.PathItemObject)) {
                    if (typeof operation === "object") {
                        let typedOperation = operation as OpenAPIV3_1.OperationObject

                        if (typedOperation.parameters) {
                            let typedParameters = typedOperation.parameters as OpenAPIV3_1.ParameterObject[]

                            // Do something with the parameters

                            typedOperation.parameters = typedParameters
                        }

                        if (typedOperation.requestBody) {
                            let typedRequestBody = typedOperation.requestBody as OpenAPIV3_1.RequestBodyObject

                            // Do something with the requestBody

                            if (typedRequestBody?.content["application/json"]?.schema) {
                                let typedSchema = typedRequestBody.content["application/json"]
                                    ?.schema as OpenAPIV3_1.SchemaObject

                                // Do something with the request schema
                                // TODO: Fix the issue with required fields

                                if (typedSchema.properties) {
                                    typedSchema.properties = this._overwriteRequestBodyProperties(
                                        typedSchema.properties
                                    )
                                }

                                typedRequestBody.content["application/json"].schema = typedSchema
                            }

                            typedOperation.requestBody = typedRequestBody
                        }

                        ;(pathItem as any)[method] = typedOperation
                    }
                }

                doc.paths[path] = pathItem
            }
        }

        return doc
    }

    /**
     * Allows to overwrite some data within the automatically generated OpenAPI documentation
     * and stores the generated specification in cache.
     */
    async spec({ response }: HttpContext) {
        const rawOpenApiSpec = await cache.use("filesystem").getOrSet({
            key: "raw-openapi-spec",
            factory: async () => {
                const rawOpenApiResponse = await fetch(`${env.get("APP_URL")}/raw-openapi`)
                return await rawOpenApiResponse.text()
            },
            ttl: "30s", // 30 seconds
        })

        const doc = await this._overwriteSpec(rawOpenApiSpec)
        return response.status(200).send(yaml.dump(doc))
    }
}
