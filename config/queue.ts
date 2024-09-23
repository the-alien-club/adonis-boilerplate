import redisConnector from "#config/redis"
import env from "#start/env"
import { QueueOptions } from "bullmq"

/**
 * The default configuration for queues.
 */
const queueConfig: QueueOptions = {
    connection: redisConnector,
    defaultJobOptions: {
        // Job attempts
        attempts: 4,

        // Delayed jobs
        backoff: {
            type: "exponential",
            // Reduce the delay for development & testing environments
            delay: env.get("NODE_ENV") === "production" ? 2048 : 1024,
        },

        // Auto-removal
        removeOnComplete: true,
        removeOnFail: true,
    },
}

export default queueConfig
