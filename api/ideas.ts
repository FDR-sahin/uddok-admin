import { initialSourcingIdeas } from './data/ideasData';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const MONGODB_URI = process.env.MONGODB_URI;

  if (req.method === 'GET') {
    if (MONGODB_URI) {
      try {
        const { MongoClient } = await import('mongodb');
        const client = new MongoClient(MONGODB_URI, { connectTimeoutMS: 2000, serverSelectionTimeoutMS: 2000 });
        await client.connect();
        const items = await client.db('uddokta_db').collection('ideas').find({}).sort({ _id: -1 }).toArray();
        await client.close().catch(() => {});
        if (items && Array.isArray(items) && items.length > 0) {
          const clean = items.map((i: any) => ({ ...i, _id: String(i._id) }));
          return res.status(200).json({ success: true, count: clean.length, data: clean });
        }
      } catch (err: any) {
        console.log('MongoDB ideas fetch error:', err.message);
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
      try {
        const { MongoClient } = await import('mongodb');
        const client = new MongoClient(MONGODB_URI, { connectTimeoutMS: 2000, serverSelectionTimeoutMS: 2000 });
        await client.connect();
        const result = await client.db('uddokta_db').collection('ideas').insertOne(newIdea);
        await client.close().catch(() => {});
        return res.status(201).json({ success: true, data: { ...newIdea, _id: String(result.insertedId) } });
      } catch (err: any) {
        console.log('MongoDB insert idea error:', err.message);
      }
    }

    return res.status(201).json({ success: true, data: { ...newIdea, id: `sourcing-${Date.now()}` } });
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
