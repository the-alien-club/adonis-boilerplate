import env from "#start/env"
import type { default as IORedis } from "ioredis"

/**
 * The configuration for the Redis database.
 */
const redisConfig: IORedis.RedisOptions = {
    maxRetriesPerRequest: null, // https://github.com/nocodb/nocodb/issues/2452#issue-1279896470
    connectTimeout: 4096,
    keepAlive: 1000,
    db: env.get("REDIS_DB"),

    retryStrategy: (times) => {
        // Exponential(5) backoff with a maximum of 32 seconds
        return Math.min(times * 500, 32_000)
    },
}

export default redisConfig
