import { defineConfig, store, drivers } from "@adonisjs/cache"

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

        /**
         * Cache using the database.
         */
        // database: store().useL2Layer(
        //     drivers.database({
        //         connectionName: "main",
        //         tableName: "cache",
        //         autoCreateTable: true,
        //         pruneInterval: "24h",
        //     })
        // ),
    },
})

export default cacheConfig
