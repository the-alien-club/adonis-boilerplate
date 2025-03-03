import adonisPrettierConfig from "@adonisjs/prettier-config" assert { type: "json" }

export default {
    ...adonisPrettierConfig,
    singleQuote: false,
    useTabs: false,
    tabWidth: 4,
    printWidth: 120,
}
