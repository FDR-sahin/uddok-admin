import { MongoClient } from 'mongodb';
import { initialSourcingIdeas } from '../src/data/sourcingData';

const MONGODB_URI = process.env.MONGODB_URI || '';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Suppress unhandled background driver rejections in serverless functions
  if (typeof process !== 'undefined' && !(process as any)._mongoListenersAdded) {
    (process as any)._mongoListenersAdded = true;
    process.on('unhandledRejection', (reason: any) => {
      console.log('Suppressed background rejection:', reason?.message || reason);
    });
    process.on('uncaughtException', (err: any) => {
      console.log('Suppressed background exception:', err?.message || err);
    });
  }

  try {
    if (req.method === 'GET') {
      if (MONGODB_URI) {
        let client: MongoClient | null = null;
        try {
          client = new MongoClient(MONGODB_URI, {
            connectTimeoutMS: 2500,
            serverSelectionTimeoutMS: 2500,
            socketTimeoutMS: 2500
          });
          
          await Promise.race([
            client.connect(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Connect Timeout')), 2500))
          ]);

          const db = client.db('uddokta_db');
          const ideas = await db.collection('ideas').find({}).sort({ _id: -1 }).toArray();
          await client.close().catch(() => {});
          
          if (ideas && ideas.length > 0) {
            const clean = ideas.map((i: any) => ({ ...i, _id: String(i._id) }));
            return res.status(200).json({ success: true, count: clean.length, data: clean });
          }
        } catch (err: any) {
          if (client) await client.close().catch(() => {});
          console.log('MongoDB Atlas ideas fetch fallback:', err.message);
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
        likes: 0,
        dislikes: 0,
        comments: [],
        createdAt: new Date().toLocaleDateString('bn-BD')
      };

      if (MONGODB_URI) {
        let client: MongoClient | null = null;
        try {
          client = new MongoClient(MONGODB_URI, {
            connectTimeoutMS: 2500,
            serverSelectionTimeoutMS: 2500,
            socketTimeoutMS: 2500
          });

          await Promise.race([
            client.connect(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Connect Timeout')), 2500))
          ]);

          const db = client.db('uddokta_db');
          const result = await db.collection('ideas').insertOne(newIdea);
          await client.close().catch(() => {});
          return res.status(201).json({ success: true, data: { ...newIdea, _id: String(result.insertedId) } });
        } catch (err: any) {
          if (client) await client.close().catch(() => {});
          console.log('MongoDB Atlas insert idea fallback:', err.message);
        }
      }

      return res.status(201).json({ success: true, data: { ...newIdea, id: `sourcing-${Date.now()}` } });
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (globalErr: any) {
    return res.status(200).json({ success: true, count: initialSourcingIdeas.length, data: initialSourcingIdeas });
  }
}
