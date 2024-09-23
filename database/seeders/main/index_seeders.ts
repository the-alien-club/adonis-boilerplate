import { BaseSeeder } from "@adonisjs/lucid/seeders"
import app from "@adonisjs/core/services/app"
import logger from "@adonisjs/core/services/logger"

export default class extends BaseSeeder {
    private async seed(Seeder: { default: typeof BaseSeeder }) {
        // Do not run when not in a environment specified in Seeder
        if (
            !Seeder.default.environment ||
            (!Seeder.default.environment.includes("development") && app.inDev) ||
            (!Seeder.default.environment.includes("testing") && app.inTest) ||
            (!Seeder.default.environment.includes("production") && app.inProduction)
        ) {
            logger.warn(`Skipping seeder (invalid environment): ${Seeder.default.name}`)
            return
        }

        await new Seeder.default(this.client).run()
    }

    async run() {
        // Note that the order here is the order of seeding
        await this.seed(await import("#database/seeders/roles_seeder"))
        await this.seed(await import("#database/seeders/users_seeder"))
    }
}
