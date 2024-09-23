import { cronQueue } from "#queues/index"
import cronWorker from "#workers/cron_worker"
import basicWorker from "#workers/basic_worker"
import logger from "@adonisjs/core/services/logger"
import { Worker } from "bullmq"

// List all the workers that should be started on AdonisJs boot
const workers: { [workerName: string]: Worker } = {
    basicWorker,
    cronWorker,
}

export default class WorkersProvider {
    /**
     * The repeatable cron job options.
     */
    private readonly cronJobOptions = {
        delay: 10000,
        repeat: { every: 1000 },
        removeOnFail: true,
        removeOnComplete: true,
    }

    /**
     * Starts all the workers during when the application is ready to accept incoming requests.
     * also initializes the stacks queue cron job.
     *
     * More info: https://docs.adonisjs.com/guides/concepts/service-providers#ready
     */
    async ready() {
        if (process.env.NO_LC === "true") {
            // Ensures that the queue cron job is removed when running ace commands
            await cronQueue.removeRepeatable("cronSeconds", this.cronJobOptions.repeat)
            return
        }

        // Start all the workers if they are not already running
        for (const workerName in workers) {
            const worker = workers[workerName]
            if (!worker.isRunning()) worker.run()

            const cronWorkerName = Object.keys({ cronWorker })[0]

            if (workerName === cronWorkerName) {
                await cronQueue.add("cronSeconds", {}, this.cronJobOptions)
                logger.info(
                    `scheduled ${cronWorkerName} to run every ${this.cronJobOptions.repeat.every / 1000} second(s)`
                )
            }
        }

        if (Object.keys(workers).length === 0) {
            logger.info("no workers to start, skipping...")
            return
        }

        logger.info(`started all workers successfully (${Object.keys(workers).join(", ")})`)
    }

    /**
     * Stops all the workers when the application is shutting down.
     *
     * More info: https://docs.adonisjs.com/guides/concepts/service-providers#shutdown
     */
    async shutdown() {
        if (process.env.NO_LC === "true") return

        // Stop all the workers if they are running
        for (const workerName in workers) {
            const worker = workers[workerName]
            if (worker.isRunning()) worker.close()
        }

        logger.info(`stopped all workers successfully (${Object.keys(workers).join(", ")})`)
    }
}
