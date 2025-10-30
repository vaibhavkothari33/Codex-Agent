import { DataAPIClient } from '@datastax/astra-db-ts';
import dotenv from 'dotenv';

dotenv.config();

let dbInstance = null;
let collectionsCache = new Map();

export function hasAstraEnv() {
  return Boolean(process.env.ASTRA_DB_APPLICATION_TOKEN && process.env.ASTRA_DB_API_ENDPOINT);
}

export async function getAstraDb() {
  if (!hasAstraEnv()) throw new Error('Astra env vars not set');
  if (!dbInstance) {
    const client = new DataAPIClient(process.env.ASTRA_DB_APPLICATION_TOKEN);
    dbInstance = client.db(process.env.ASTRA_DB_API_ENDPOINT);
  }
  return dbInstance;
}

export async function getCollection(name = 'codex_messages') {
  if (collectionsCache.has(name)) return collectionsCache.get(name);
  const db = await getAstraDb();
  const collection = await db.collection(name);
  collectionsCache.set(name, collection);
  return collection;
}


