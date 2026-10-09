import { MongoClient } from 'mongodb';
import initialSourcingIdeas from '../src/data/sourcingData.json';

const MONGODB_URI = process.env.MONGODB_URI || '';

async function getDb() {
  if (!MONGODB_URI) return null;
  let client: MongoClient | null = null;
  try {
    client = new MongoClient(MONGODB_URI, { connectTimeoutMS: 1500, serverSelectionTimeoutMS: 1500 });
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
    const dbObj = await getDb();

    if (req.method === 'GET') {
      if (dbObj) {
        try {
          const ideas = await dbObj.db.collection('ideas').find({}).sort({ _id: -1 }).toArray();
          await dbObj.client.close().catch(() => {});
          if (ideas && ideas.length > 0) {
            const cleanIdeas = ideas.map((i: any) => ({
              ...i,
              _id: i._id ? i._id.toString() : i.id
            }));
            return res.status(200).json({ success: true, count: cleanIdeas.length, data: cleanIdeas });
          }
        } catch (e: any) {
          if (dbObj.client) await dbObj.client.close().catch(() => {});
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
        if (dbObj?.client) await dbObj.client.close().catch(() => {});
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

      if (dbObj) {
        try {
          const result = await dbObj.db.collection('ideas').insertOne(newIdea);
          await dbObj.client.close().catch(() => {});
          return res.status(201).json({ success: true, data: { ...newIdea, _id: result.insertedId.toString() } });
        } catch (e: any) {
          if (dbObj.client) await dbObj.client.close().catch(() => {});
        }
      }

      return res.status(201).json({ success: true, data: { ...newIdea, id: `sourcing-${Date.now()}` } });
    }

    if (dbObj?.client) await dbObj.client.close().catch(() => {});
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (err: any) {
    return res.status(200).json({ success: true, count: initialSourcingIdeas.length, data: initialSourcingIdeas });
  }
}
