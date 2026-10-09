import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || '';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'regardstech.team@gmail.com';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let dbStatus = 'Memory / Fallback';
  if (MONGODB_URI) {
    try {
      const client = new MongoClient(MONGODB_URI, { connectTimeoutMS: 2000, serverSelectionTimeoutMS: 2000 });
      await client.connect();
      await client.db('uddokta_db').command({ ping: 1 });
      dbStatus = 'MongoDB (Connected)';
      await client.close();
    } catch (err: any) {
      dbStatus = `Fallback (${err.message})`;
    }
  }

  return res.status(200).json({
    status: 'ok',
    database: dbStatus,
    adminEmail: ADMIN_EMAIL
  });
}
