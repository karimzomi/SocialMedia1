import { Pool } from 'pg'
import dotenv from 'dotenv';

dotenv.config({ path: "../../.env" })
const PGUSER = process.env.PGUSER
const PGHOST = process.env.PGHOST
const PGPASSWORD = process.env.PGPASSWORD
const GDATABASE = process.env.GDATABASE
const PGPORT = Number.parseInt(process.env.PGPORT)

declare global {
  var pool: Pool
}

if (!global.pool) {
  console.log('🐘 Initializing Postgres connection!');
  global.pool = new Pool({
    user: PGUSER,
    host: PGHOST,
    database: GDATABASE,
    password: PGPASSWORD,
    port: PGPORT,
    max: 100,
    idleTimeoutMillis: 0,
    connectionTimeoutMillis: 0
  });
  pool = global.pool
}


export default pool;