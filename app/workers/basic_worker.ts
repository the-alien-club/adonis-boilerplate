import workerConfig from "#config/worker"
import { type Job, Worker } from "bullmq"
import { basicQueue } from "#queues/index"
import logger from "@adonisjs/core/services/logger"

/**
 * The basic worker that processes basic jobs.
 */
const basicWorker = new Worker(
    basicQueue.name,
    async (job) => {
        logger.debug(`processing basic job ${job.id}`)

        // PUT YOUR CODE HERE

        logger.debug(`basic job ${job.id} processed`)
    },
    workerConfig
)

/**
 * Event listener for the basic worker to handle failed jobs.
 */
basicWorker.on("failed", async (job: Job | undefined) => {
    if (!job) {
        logger.error("basic job failed without any job details")
        return
    }

    logger.warn(`basic job ${job?.id} failed with the reason: ${job?.failedReason}`)
})

/**
 * Event listener for the basic worker to handle successful jobs.
 */
basicWorker.on("completed", async (job: Job) => {
    logger.info(`basic job ${job.id} completed successfully`)
})

// Check: https://docs.bullmq.io/guide/events
// for more events that can be listened to.

export default basicWorker
