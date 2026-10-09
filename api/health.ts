import mongoose from 'mongoose';

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
  try {
    if (MONGODB_URI && mongoose.connection.readyState !== 1) {
      await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 3000 });
    }
    if (mongoose.connection.readyState === 1) {
      dbStatus = 'MongoDB (Connected)';
    }
  } catch (err: any) {
    dbStatus = `Fallback (${err.message})`;
  }

  return res.status(200).json({
    status: 'ok',
    database: dbStatus,
    adminEmail: ADMIN_EMAIL
  });
}
