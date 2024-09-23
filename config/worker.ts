import redisConnector from "#config/redis"
import { WorkerOptions } from "bullmq"

/**
 * The default configuration for workers.
 */
const workerConfig: WorkerOptions = {
    connection: redisConnector,
    autorun: true,
    concurrency: 1,
}

export default workerConfig
