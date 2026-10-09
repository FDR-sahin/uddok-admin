import dns from 'dns';
import { MongoClient } from 'mongodb';
import initialSourcingIdeas from '../src/data/sourcingData.json';

// Use Google & Cloudflare DNS to resolve MongoDB Atlas SRV records reliably on Vercel
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

if (typeof process !== 'undefined' && process.on) {
  process.on('uncaughtException', (err) => {
    console.log('Suppressed uncaughtException in ideas.ts:', err.message);
  });
  process.on('unhandledRejection', (reason: any) => {
    console.log('Suppressed unhandledRejection in ideas.ts:', reason);
  });
}

const MONGODB_URI = process.env.MONGODB_URI || '';

async function getDb() {
  if (!MONGODB_URI) return null;
  let client: MongoClient | null = null;
  try {
    client = new MongoClient(MONGODB_URI, { connectTimeoutMS: 2000, serverSelectionTimeoutMS: 2000 });
    await client.connect();
    return { client, db: client.db('uddokta_db') };
  } catch (err: any) {
    if (client) {
      try { await client.close(); } catch (e) {}
    }
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
    if (req.method === 'GET') {
      let ideasData: any[] = initialSourcingIdeas;
      try {
        const dbObj = await Promise.race([
          getDb(),
          new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000))
        ]);

        if (dbObj) {
          try {
            const dbIdeas = await Promise.race([
              dbObj.db.collection('ideas').find({}).sort({ _id: -1 }).toArray(),
              new Promise<any[]>((resolve) => setTimeout(() => resolve([]), 2000))
            ]);
            if (dbIdeas && dbIdeas.length > 0) {
              ideasData = dbIdeas.map((i: any) => ({
                ...i,
                _id: i._id ? String(i._id) : i.id
              }));
            }
          } finally {
            await dbObj.client.close().catch(() => {});
          }
        }
      } catch (e: any) {
        console.log('Fallback in GET /api/ideas:', e.message);
      }

      return res.status(200).json({ success: true, count: ideasData.length, data: ideasData });
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

      try {
        const dbObj = await getDb();
        if (dbObj) {
          try {
            const result = await dbObj.db.collection('ideas').insertOne(newIdea);
            return res.status(201).json({ success: true, data: { ...newIdea, _id: String(result.insertedId) } });
          } finally {
            await dbObj.client.close().catch(() => {});
          }
        }
      } catch (e: any) {
        console.log('Fallback in POST /api/ideas:', e.message);
      }

      return res.status(201).json({ success: true, data: { ...newIdea, id: `sourcing-${Date.now()}` } });
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (err: any) {
    return res.status(200).json({ success: true, count: initialSourcingIdeas.length, data: initialSourcingIdeas });
  }
}
