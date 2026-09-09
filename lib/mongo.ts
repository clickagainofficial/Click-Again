import "server-only";
import { MongoClient, type Db } from "mongodb";

/**
 * One MongoClient per server instance.
 *
 * Serverless functions get re-invoked on a warm container, and dev reloads the
 * module on every change — both would open a new pool each time. Caching the
 * connect promise on globalThis keeps it to a single pool either way.
 */

const globalForMongo = globalThis as unknown as {
  _mongoClientPromise?: Promise<MongoClient>;
};

function clientPromise() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");

  if (!globalForMongo._mongoClientPromise) {
    const client = new MongoClient(uri, {
      // keep the pool small: many short-lived serverless instances
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 8000,
    });
    globalForMongo._mongoClientPromise = client.connect();
  }

  return globalForMongo._mongoClientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await clientPromise();
  // database name comes from the connection string
  return client.db();
}
