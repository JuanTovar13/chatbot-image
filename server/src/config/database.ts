import { Pool } from "pg";
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from "./index";

export const pool = new Pool({
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
});

export const initDb = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.bot_messages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      content TEXT NOT NULL,
      role TEXT NOT NULL,
      parent_id UUID REFERENCES public.bot_messages(id),
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
};
