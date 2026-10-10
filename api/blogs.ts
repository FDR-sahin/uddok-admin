import { initialBlogPosts } from './data/blogsData';

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
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(MONGODB_URI, { connectTimeoutMS: 1500, serverSelectionTimeoutMS: 1500 });
        await client.connect();
        const items = await client.db('uddokta_db').collection('blogs').find({}).toArray();
        await client.close();
        if (items && Array.isArray(items) && items.length > 0) {
          const clean = JSON.parse(JSON.stringify(items));
          return res.status(200).json({ success: true, count: clean.length, data: clean });
        }
      } catch (err: any) {
        console.log('MongoDB fetch error:', err.message);
      }
    }
    return res.status(200).json({ success: true, count: initialBlogPosts.length, data: initialBlogPosts });
  }

  if (req.method === 'POST') {
    if (MONGODB_URI && req.body) {
      try {
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(MONGODB_URI, { connectTimeoutMS: 1500, serverSelectionTimeoutMS: 1500 });
        await client.connect();
        const result = await client.db('uddokta_db').collection('blogs').insertOne(req.body);
        await client.close();
        return res.status(201).json({ success: true, data: { ...req.body, _id: String(result.insertedId) } });
      } catch (err: any) {
        console.log('MongoDB insert error:', err.message);
      }
    }
    return res.status(201).json({ success: true, data: { ...req.body, id: `blog-${Date.now()}` } });
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
