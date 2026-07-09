import "dotenv/config";
import pg, { type PoolClient, type QueryResultRow } from "pg";

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL não foi configurada.");
}

export const db = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000
});

const schema = `
  CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL CHECK(role IN ('admin','professional','client')),
    avatar TEXT,
    google_sub TEXT,
    email_verified_at TIMESTAMPTZ,
    email_verification_token_hash TEXT,
    email_verification_sent_at TIMESTAMPTZ,
    active INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS professionals (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    nickname TEXT,
    bio TEXT,
    commission_rate DOUBLE PRECISION NOT NULL DEFAULT 40,
    color TEXT NOT NULL DEFAULT '#C9A96E',
    available_online INTEGER NOT NULL DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS clients (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE REFERENCES users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    birth_date DATE,
    cpf TEXT,
    notes TEXT,
    loyalty_points INTEGER NOT NULL DEFAULT 0,
    blocked INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  ALTER TABLE clients ADD COLUMN IF NOT EXISTS gender TEXT;
  ALTER TABLE clients ADD COLUMN IF NOT EXISTS country TEXT;
  ALTER TABLE clients ADD COLUMN IF NOT EXISTS zip TEXT;
  ALTER TABLE clients ADD COLUMN IF NOT EXISTS address TEXT;
  ALTER TABLE clients ADD COLUMN IF NOT EXISTS district TEXT;
  ALTER TABLE clients ADD COLUMN IF NOT EXISTS number TEXT;
  ALTER TABLE clients ADD COLUMN IF NOT EXISTS complement TEXT;
  ALTER TABLE clients ADD COLUMN IF NOT EXISTS state TEXT;
  ALTER TABLE clients ADD COLUMN IF NOT EXISTS city TEXT;

  CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('service','product','finance'))
  );

  CREATE TABLE IF NOT EXISTS services (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    duration_minutes INTEGER NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    cost DOUBLE PRECISION NOT NULL DEFAULT 0,
    commission_rate DOUBLE PRECISION,
    image TEXT,
    active INTEGER NOT NULL DEFAULT 1,
    online_booking INTEGER NOT NULL DEFAULT 1,
    loyalty_points INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS professional_services (
    professional_id BIGINT NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
    service_id BIGINT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    custom_price DOUBLE PRECISION,
    custom_duration INTEGER,
    PRIMARY KEY(professional_id, service_id)
  );

  CREATE TABLE IF NOT EXISTS work_hours (
    id BIGSERIAL PRIMARY KEY,
    professional_id BIGINT NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
    weekday INTEGER NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    break_start TEXT,
    break_end TEXT,
    active INTEGER NOT NULL DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS appointments (
    id BIGSERIAL PRIMARY KEY,
    client_id BIGINT NOT NULL REFERENCES clients(id),
    professional_id BIGINT NOT NULL REFERENCES professionals(id),
    service_id BIGINT NOT NULL REFERENCES services(id),
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK(status IN ('scheduled','confirmed','in_progress','completed','cancelled','no_show')),
    price DOUBLE PRECISION NOT NULL,
    notes TEXT,
    source TEXT NOT NULL DEFAULT 'admin',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    sku TEXT UNIQUE,
    price DOUBLE PRECISION NOT NULL,
    cost DOUBLE PRECISION NOT NULL DEFAULT 0,
    stock INTEGER NOT NULL DEFAULT 0,
    min_stock INTEGER NOT NULL DEFAULT 0,
    image TEXT,
    active INTEGER NOT NULL DEFAULT 1,
    online_store INTEGER NOT NULL DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS commands (
    id BIGSERIAL PRIMARY KEY,
    client_id BIGINT REFERENCES clients(id),
    professional_id BIGINT REFERENCES professionals(id),
    appointment_id BIGINT REFERENCES appointments(id),
    status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open','paid','cancelled')),
    discount DOUBLE PRECISION NOT NULL DEFAULT 0,
    total DOUBLE PRECISION NOT NULL DEFAULT 0,
    notes TEXT,
    opened_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMPTZ
  );

  CREATE TABLE IF NOT EXISTS command_items (
    id BIGSERIAL PRIMARY KEY,
    command_id BIGINT NOT NULL REFERENCES commands(id) ON DELETE CASCADE,
    item_type TEXT NOT NULL CHECK(item_type IN ('service','product')),
    item_id BIGINT NOT NULL,
    description TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DOUBLE PRECISION NOT NULL,
    discount DOUBLE PRECISION NOT NULL DEFAULT 0,
    professional_id BIGINT REFERENCES professionals(id)
  );

  CREATE TABLE IF NOT EXISTS payments (
    id BIGSERIAL PRIMARY KEY,
    command_id BIGINT REFERENCES commands(id),
    method TEXT NOT NULL,
    amount DOUBLE PRECISION NOT NULL,
    status TEXT NOT NULL DEFAULT 'paid',
    paid_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS cash_entries (
    id BIGSERIAL PRIMARY KEY,
    type TEXT NOT NULL CHECK(type IN ('income','expense')),
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    amount DOUBLE PRECISION NOT NULL,
    due_date DATE,
    paid_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'paid',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS messages (
    id BIGSERIAL PRIMARY KEY,
    sender_id BIGINT NOT NULL REFERENCES users(id),
    receiver_id BIGINT NOT NULL REFERENCES users(id),
    body TEXT NOT NULL,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS coupons (
    id BIGSERIAL PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    discount_percent DOUBLE PRECISION NOT NULL,
    expires_at TIMESTAMPTZ,
    max_uses INTEGER,
    active INTEGER NOT NULL DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS module_records (
    id BIGSERIAL PRIMARY KEY,
    module TEXT NOT NULL,
    title TEXT NOT NULL,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_appointments_start ON appointments(starts_at);
  CREATE INDEX IF NOT EXISTS idx_appointments_professional ON appointments(professional_id);
  CREATE INDEX IF NOT EXISTS idx_messages_users ON messages(sender_id, receiver_id);
  CREATE INDEX IF NOT EXISTS idx_module_records_module ON module_records(module);
  CREATE UNIQUE INDEX IF NOT EXISTS idx_users_google_sub ON users(google_sub) WHERE google_sub IS NOT NULL;
`;

export const databaseReady = db.query(schema).then(() => undefined);

export type Row = Record<string, unknown>;

function postgresSql(sql: string) {
  let index = 0;
  return sql.replace(/\?/g, () => `$${++index}`);
}

type Queryable = Pick<PoolClient, "query"> | typeof db;

export async function all<T extends QueryResultRow = QueryResultRow>(
  sql: string,
  params: unknown[] = [],
  client: Queryable = db
): Promise<T[]> {
  await databaseReady;
  const result = await client.query<T>(postgresSql(sql), params);
  return result.rows;
}

export async function get<T extends QueryResultRow = QueryResultRow>(
  sql: string,
  params: unknown[] = [],
  client: Queryable = db
): Promise<T | undefined> {
  const rows = await all<T>(sql, params, client);
  return rows[0];
}

export async function run(
  sql: string,
  params: unknown[] = [],
  client: Queryable = db
) {
  await databaseReady;
  const result = await client.query(postgresSql(sql), params);
  return { changes: result.rowCount || 0 };
}

export async function insert(
  sql: string,
  params: unknown[] = [],
  client: Queryable = db
) {
  await databaseReady;
  const result = await client.query<{ id: string }>(`${postgresSql(sql)} RETURNING id`, params);
  return Number(result.rows[0].id);
}

export async function transaction<T>(callback: (client: PoolClient) => Promise<T>) {
  await databaseReady;
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    const value = await callback(client);
    await client.query("COMMIT");
    return value;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
