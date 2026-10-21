import "reflect-metadata"
import { DataSource } from "typeorm";
import { User } from "./entity/Users";
import { Situation } from "./entity/Situations";


//importar variáveis de ambiente do arquivo .env
import dotenv from 'dotenv';
dotenv.config();

// Configuração do DataSource para o TypeORM
const dialect = process.env.DB_DIALECT ?? "mysql";
export const AppDataSource = new DataSource({
    type: dialect as "mysql" | "postgres"| "mariadb" | "mongodb",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3307,
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "nodeapi",
    synchronize: false,
    logging: true,
    entities: [User, Situation],
    subscribers: [],
    migrations: [__dirname + "/migration/*.js"],
})