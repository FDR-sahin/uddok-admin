import { MongoClient } from 'mongodb';
import { initialSourcingIdeas } from '../src/data/sourcingData';

const MONGODB_URI = process.env.MONGODB_URI || '';
let cachedClient: MongoClient | null = null;

async function getDb() {
  if (!MONGODB_URI) return null;
  if (cachedClient) return cachedClient.db('uddokta_db');
  let client: MongoClient | null = null;
  try {
    client = new MongoClient(MONGODB_URI, { connectTimeoutMS: 2000, serverSelectionTimeoutMS: 2000 });
    await client.connect();
    cachedClient = client;
    return client.db('uddokta_db');
  } catch (err: any) {
    if (client) {
      try { await client.close(); } catch (e) {}
    }
    console.log('MongoDB connection fallback:', err.message);
    return null;
  }
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const db = await getDb();

    if (req.method === 'GET') {
      if (db) {
        try {
          const ideas = await db.collection('ideas').find({}).sort({ _id: -1 }).toArray();
          if (ideas && ideas.length > 0) {
            return res.status(200).json({ success: true, count: ideas.length, data: ideas });
          }
        } catch (e: any) {
          console.log('MongoDB query error in ideas:', e.message);
        }
      }
      return res.status(200).json({ success: true, count: initialSourcingIdeas.length, data: initialSourcingIdeas });
    }

    if (req.method === 'POST') {
      const {
        title,
        category,
        district,
        exactLocation,
        wholesalePrice,
        retailPrice,
        unit = 'প্রতি পিস',
        moq = '১০ পিস',
        description = '',
        supplierTip = '',
        coordinates = { lat: 23.8583, lng: 90.2667 }
      } = req.body || {};

      if (!title || !category || !district || !exactLocation || !wholesalePrice || !retailPrice) {
        return res.status(400).json({ success: false, message: 'All required fields must be provided' });
      }

      const newIdea = {
        title,
        category,
        district,
        exactLocation,
        wholesalePrice: Number(wholesalePrice),
        retailPrice: Number(retailPrice),
        unit,
        moq,
        description,
        supplierTip,
        coordinates,
        isVerified: true,
        likes: 12,
        dislikes: 0,
        comments: [],
        createdAt: new Date().toLocaleDateString('bn-BD')
      };

      if (db) {
        try {
          const result = await db.collection('ideas').insertOne(newIdea);
          return res.status(201).json({ success: true, data: { ...newIdea, _id: result.insertedId } });
        } catch (e: any) {
          console.log('MongoDB insert error in ideas:', e.message);
        }
      }

      return res.status(201).json({ success: true, data: { ...newIdea, id: `sourcing-${Date.now()}` } });
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (err: any) {
    return res.status(200).json({ success: true, count: initialSourcingIdeas.length, data: initialSourcingIdeas });
  }
}
