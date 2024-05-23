import { DataSource } from "typeorm";
import { Contact } from "../models/contact";
import "dotenv/config";
export const PostgresDataSource = new DataSource({
  type: "postgres",
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || "5432", 10),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  logging: false,
  entities: [Contact],
  migrations: [],
  subscribers: [],
  synchronize: true,
});
