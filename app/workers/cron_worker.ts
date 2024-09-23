import workerConfig from "#config/worker"
import { Worker } from "bullmq"
import { cronQueue } from "#queues/index"

/**
 * The worker that processes the cron jobs.
 */
const cronWorker = new Worker(
    cronQueue.name,
    async (_) => {
        // PUT YOUR CODE HERE
    },
    workerConfig
)

export default cronWorker
