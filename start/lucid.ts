import { BaseModel, SnakeCaseNamingStrategy } from "@adonisjs/lucid/orm"

// Always use snake_case
BaseModel.namingStrategy = new SnakeCaseNamingStrategy()
