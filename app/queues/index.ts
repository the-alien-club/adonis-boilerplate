import queueConfig from "#config/queue"
import { Queue } from "bullmq"

/**
 * The queue used to process basic jobs.
 */
export const basicQueue = new Queue("basic", { ...queueConfig })

/**
 * The queue used to process cron jobs.
 */
export const cronQueue = new Queue("cron", { ...queueConfig, defaultJobOptions: { attempts: 1 } })
