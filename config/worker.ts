import redisConnector from "#database/connectors/redis"
import type { WorkerOptions } from "bullmq"

/**
 * The default configuration for workers.
 */
const workerConfig: WorkerOptions = {
    connection: redisConnector,
    autorun: true,
    concurrency: 1,
}

export default workerConfig
