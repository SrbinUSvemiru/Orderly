import { migrate } from "drizzle-orm/neon-http/migrator";

import { db } from "./index";

const main = async () => {
  try {
    await migrate(db, {
      migrationsFolder: "src/db/migrations",
    });
    console.log("migration completed");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

main();
