import "reflect-metadata";
import express from "express";
import bodyParser from "body-parser";
import routes from "./routes";
import { PostgresDataSource } from "./providers/db";
import "dotenv/config";

const app = express();

app.use(bodyParser.json());

app.use(routes);
const port = process.env.PORT || 8080;

const startServer = async () => {
  try {
    await PostgresDataSource.initialize();
    console.log("Data Source has been initialized!");

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Error during Data Source initialization:", error);
  }
};

startServer();

export default app;
