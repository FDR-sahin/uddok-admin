import { MongoClient } from 'mongodb';
import { initialBlogPosts } from '../src/data/blogsData';

const MONGODB_URI = process.env.MONGODB_URI || '';
let cachedClient: MongoClient | null = null;

async function getDb() {
  if (!MONGODB_URI) return null;
  if (cachedClient) return cachedClient.db('uddokta_db');
  try {
    const client = new MongoClient(MONGODB_URI, { connectTimeoutMS: 2000, serverSelectionTimeoutMS: 2000 });
    await client.connect();
    cachedClient = client;
    return client.db('uddokta_db');
  } catch (err: any) {
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
          const blogs = await db.collection('blogs').find({}).sort({ _id: -1 }).toArray();
          if (blogs && blogs.length > 0) {
            return res.status(200).json({ success: true, count: blogs.length, data: blogs });
          }
        } catch (e: any) {
          console.log('MongoDB query error in blogs:', e.message);
        }
      }
      return res.status(200).json({ success: true, count: initialBlogPosts.length, data: initialBlogPosts });
    }

    if (req.method === 'POST') {
      const {
        title,
        category,
        excerpt,
        content,
        author = 'মোঃ দেলোয়ার হোসেন (মিথুন)',
        readTime = '৫ মিনিট'
      } = req.body || {};

      if (!title || !category || !excerpt || !content) {
        return res.status(400).json({ success: false, message: 'Required fields missing' });
      }

      const newBlog = {
        title,
        category,
        excerpt,
        content,
        author,
        authorTitle: 'Founder & CEO, Regards Tech',
        readTime,
        createdAt: new Date().toLocaleDateString('bn-BD')
      };

      if (db) {
        try {
          const result = await db.collection('blogs').insertOne(newBlog);
          return res.status(201).json({ success: true, data: { ...newBlog, _id: result.insertedId } });
        } catch (e: any) {
          console.log('MongoDB insert error in blogs:', e.message);
        }
      }

      return res.status(201).json({ success: true, data: { ...newBlog, id: `blog-${Date.now()}` } });
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (err: any) {
    return res.status(200).json({ success: true, count: initialBlogPosts.length, data: initialBlogPosts });
  }
}
