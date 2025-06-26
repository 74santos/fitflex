import { Client } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

async function test() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL not set');
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  await client.connect();

  const res = await client.query('SELECT NOW()');
  console.log('Time from DB:', res.rows[0]);

  await client.end();
}

test().catch(console.error);
