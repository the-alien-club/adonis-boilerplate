import { configApp, INCLUDE_LIST, ADONIS_IGNORE_LIST, RULES_LIST } from "@adonisjs/eslint-config"

export default configApp({
    ignores: [ "ace.js" ],
    rules: {
        ...RULES_LIST,
        '@adonisjs/prefer-lazy-controller-import': [ 'error' ],
        '@adonisjs/prefer-lazy-listener-import': [ 'error' ],
        "@typescript-eslint/consistent-type-imports": [ "error" ],
    },
})
