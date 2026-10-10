import { MongoClient } from 'mongodb';
import { initialSourcingIdeas } from './data/ideasData';

const MONGODB_URI = process.env.MONGODB_URI || '';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    if (MONGODB_URI) {
      let client: MongoClient | null = null;
      try {
        client = new MongoClient(MONGODB_URI, { connectTimeoutMS: 2000, serverSelectionTimeoutMS: 2000 });
        await client.connect();
        const db = client.db('uddokta_db');
        const ideas = await db.collection('ideas').find({}).sort({ _id: -1 }).toArray();
        await client.close().catch(() => {});

        if (ideas && Array.isArray(ideas) && ideas.length > 0) {
          const clean = ideas.map((i: any) => ({
            id: String(i._id || i.id),
            _id: String(i._id || i.id),
            title: String(i.title || ''),
            category: String(i.category || ''),
            district: String(i.district || ''),
            exactLocation: String(i.exactLocation || ''),
            wholesalePrice: Number(i.wholesalePrice || 0),
            retailPrice: Number(i.retailPrice || 0),
            unit: String(i.unit || 'প্রতি পিস'),
            moq: String(i.moq || '১০ পিস'),
            description: String(i.description || ''),
            supplierTip: String(i.supplierTip || ''),
            coordinates: i.coordinates || { lat: 23.8583, lng: 90.2667 },
            isVerified: true,
            likes: Number(i.likes || 0),
            dislikes: Number(i.dislikes || 0),
            comments: Array.isArray(i.comments) ? i.comments : [],
            createdAt: String(i.createdAt || '')
          }));
          return res.status(200).json({ success: true, count: clean.length, data: clean });
        }
      } catch (err: any) {
        if (client) await client.close().catch(() => {});
      }
    }
    return res.status(200).json({ success: true, count: initialSourcingIdeas.length, data: initialSourcingIdeas });
  }

  if (req.method === 'POST') {
    try {
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
          client = new MongoClient(MONGODB_URI, { connectTimeoutMS: 2000, serverSelectionTimeoutMS: 2000 });
          await client.connect();
          const db = client.db('uddokta_db');
          const result = await db.collection('ideas').insertOne(newIdea);
          await client.close().catch(() => {});
          return res.status(201).json({ success: true, data: { ...newIdea, _id: String(result.insertedId) } });
        } catch (err: any) {
          if (client) await client.close().catch(() => {});
        }
      }

      return res.status(201).json({ success: true, data: { ...newIdea, id: `sourcing-${Date.now()}` } });
    } catch (postErr: any) {
      return res.status(500).json({ success: false, error: postErr.message });
    }
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
