import type User from "#models/user"
import type { AuthorizerResponse } from "@adonisjs/bouncer/types"
import BasePolicy from "#policies/templates/base_policy"
import type { AccessToken } from "@adonisjs/auth/access_tokens"
import { AccessTokenAbility, userAccessTokenHasAbility } from "#lib/utils/access_tokens"

export default class AccessTokenPolicy extends BasePolicy {
    // Every user can view their own access tokens
    index(user: User | null, userToGetAccessTokensFrom: User | null): AuthorizerResponse {
        return (
            userAccessTokenHasAbility(user, AccessTokenAbility.ACCESS_TOKEN_READ) &&
            user?.id === userToGetAccessTokensFrom?.id
        )
    }

    // Admin only
    // Only admins can view all access tokens
    adminIndex(): AuthorizerResponse {
        return false
    }

    // Every user can create a access token
    store(user: User | null, userToGetAccessTokensFrom: User | null): AuthorizerResponse {
        return (
            userAccessTokenHasAbility(user, AccessTokenAbility.ACCESS_TOKEN_WRITE) &&
            user?.id === userToGetAccessTokensFrom?.id
        )
    }

    // Every user can view their own access token
    show(user: User | null, accessToken: AccessToken): AuthorizerResponse {
        return (
            userAccessTokenHasAbility(user, AccessTokenAbility.ACCESS_TOKEN_READ) &&
            user?.id === accessToken.tokenableId
        )
    }

    // Every user can update their own access token
    update(user: User | null, accessToken: AccessToken): AuthorizerResponse {
        return (
            userAccessTokenHasAbility(user, AccessTokenAbility.ACCESS_TOKEN_READ) &&
            user?.id === accessToken.tokenableId
        )
    }

    // Every user can delete their own access token
    destroy(user: User | null, accessToken: AccessToken): AuthorizerResponse {
        return (
            userAccessTokenHasAbility(user, AccessTokenAbility.ACCESS_TOKEN_READ) &&
            user?.id === accessToken.tokenableId
        )
    }
}
