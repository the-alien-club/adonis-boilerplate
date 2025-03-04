<p align="center">
  <br />
  <a href="https://www.alien.club" target="_blank"><img width="64px" src="https://alien-website.cdn.prismic.io/alien-website/Zrn2b0aF0TcGI3Bu_alien-logo.svg" /></a>
  <h2 align="center">@the-alien-club/adonis-boilerplate</h2>
  <p align="center">An AdonisJS and Lucid boilerplate integrating a role system, token scopes and more!</p>
</p>

## Installation
1. Clone the repository
2. Install dependencies
    ```typescript
    $ npm install // yarn
    ```
3. Start the development server
    ```typescript
    $ npm run dev // yarn dev
    ```
## Routes
TODO

## Registration
You can register via the `/register` route, the body should contain the following fields:

- `email`: The email of the user **OR** the `username` (should be unique in both cases).
- `password`: The password of the user.
- `description`: The description of the user.

Note that a registered user is locked on **all** routes by default, meaning that they cannot
access the API until they are unlocked by an admin.

## Sign in
You can sign in via the `/sign-in` route, the body should contain the following fields:

- `email`: The email of the user **OR** the `username`.
- `password`: The password of the user.

It will issue a Bearer token with the `unrestricted` scope, which can be used to access the API,
including the account controls.

## Locking mechanism
Created users are locked by default, meaning that they cannot access the API until they are unlocked by an admin, except if the `isLocked: false` arg is passed when registering the user.

When being locked, neither a user nor an admin can access the API, admins can't lock/unlock themselves too. The only way to unlock a user is by an (unlocked) admin.

## Dev notes
- `queries.` are always with camelCase. `params.` are always with snake_case.
- We're not using `router.group()` every time because it makes the code really hard to read.
- Logging should be done using the `Logger` service, and not `console.log()`, with no uppercase at the beginning and no dots at the end of the log messages.
- Errors returned to the users should always use the standard error constant format:
    ```ts
    export const EC_MISSING_PARAMETER: ErrorCode = {
        status: 400,
        code: "MISSING_PARAMETER",
        message: "A parameter is missing.",
        data: null,
    }
    ```
- The implementation order inside of the controllers should always be:
    - `index`
    - `store`
    - `show`
    - `update`
    - `destroy`
    - `<custom_routes>`
- All index routes must use the `paginate` method to return the metadata for the pagination.
- Verify that PostGreSQL schema constraints are not against data isolation.
- Commands that are **not** registered into `/commands` and must not start the app can be run with `cross-env NO_LC=true`
  `NO_LC` stands for "No Lifecycle" and will prevent the app from starting.
