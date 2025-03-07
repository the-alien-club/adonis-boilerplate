import redisConfig from "#config/redis"
import env from "#start/env"
import { default as IORedis } from "ioredis"

/**
 * A reusable IORedis connector for the Redis database.
 */
const redisConnector = new IORedis.Redis(env.get("REDIS_URL"), redisConfig)

export default redisConnector
