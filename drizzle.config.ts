import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";
dotenv.config();



export default defineConfig({
  schema: "./server/db/schema.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    host: process.env.DATABASE_HOST as string,
    user: process.env.DATABASE_USER as string,
    password: process.env.DATABASE_PASSWORD as string,
    database: process.env.DATABASE_NAME as string,
  },
});
