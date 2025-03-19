import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import * as schema from "@/db/schema";

config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);

//logger
//const db = drizzle(sql, {logger: true})
const db = drizzle(sql, { schema, logger: true, casing: "snake_case" });

export { db };
