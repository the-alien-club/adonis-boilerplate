import { defineConfig, store, drivers } from "@adonisjs/cache"

/**
 * The configuration settings for the cache system.
 */
const cacheConfig = defineConfig({
    default: "memory",

    stores: {
        /**
         * Cache using memory only.
         */
        memory: store().useL1Layer(drivers.memory({ maxSize: "128mb" })),

        /**
         * Cache using the filesystem.
         */
        filesystem: store().useL2Layer(
            drivers.file({
                directory: "./.cache",
                pruneInterval: "24h",
            })
        ),
    },
})

export default cacheConfig
