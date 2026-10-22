
import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/Users";
import { Situation } from "./entity/Situations";
import { Product } from "./entity/Products";
import { ProductCategory } from "./entity/ProductCategories";
import { ProductSituation } from "./entity/ProductSituations";

import dotenv from "dotenv";
dotenv.config();

const dialect = process.env.DB_DIALECT ?? "mysql";

export const AppDataSource = new DataSource({
    type: dialect as "mysql" | "postgres" | "mariadb",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT
        ? parseInt(process.env.DB_PORT, 10)
        : 3307,
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "nodeapi",
    synchronize: false,
    logging: true,
    entities: [
        User,
        Situation,
        Product,
        ProductCategory,
        ProductSituation
    ],
    subscribers: [],
    migrations: [__dirname + "/migration/*.js"],
});
