import "reflect-metadata"
import { DataSource } from "typeorm";

// Configuração do DataSource para o TypeORM
const dialect = process.env.DB_DIALECT ?? "mysql";
export const AppDataSource = new DataSource({
    type: dialect as "mysql" | "postgres"| "mariadb" | "mongodb",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "mysql090306",
    database: process.env.DB_NAME || "nodeapi",
    synchronize: true,
    logging: true,
    entities: [],
    subscribers: [],
    migrations: [],
})