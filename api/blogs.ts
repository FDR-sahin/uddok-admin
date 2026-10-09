import { MongoClient } from 'mongodb';
import { initialBlogPosts } from '../src/data/blogsData';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const MONGODB_URI = process.env.MONGODB_URI;

  try {
    if (req.method === 'GET') {
      if (MONGODB_URI) {
        try {
          const { MongoClient } = await import('mongodb');
          const client = new MongoClient(MONGODB_URI, { connectTimeoutMS: 1000, serverSelectionTimeoutMS: 1000 });
          await client.connect();
          const db = client.db('uddokta_db');
          const blogs = await db.collection('blogs').find({}).sort({ _id: -1 }).toArray();
          await client.close().catch(() => {});
          if (blogs && blogs.length > 0) {
            const clean = blogs.map((b: any) => ({ ...b, _id: String(b._id) }));
            return res.status(200).json({ success: true, count: clean.length, data: clean });
          }
        } catch (err: any) {
          console.log('MongoDB Atlas fallback:', err.message);
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

      if (MONGODB_URI) {
        try {
          const { MongoClient } = await import('mongodb');
          const client = new MongoClient(MONGODB_URI, { connectTimeoutMS: 1000, serverSelectionTimeoutMS: 1000 });
          await client.connect();
          const db = client.db('uddokta_db');
          const result = await db.collection('blogs').insertOne(newBlog);
          await client.close().catch(() => {});
          return res.status(201).json({ success: true, data: { ...newBlog, _id: String(result.insertedId) } });
        } catch (err: any) {
          console.log('MongoDB Atlas insert fallback:', err.message);
        }
      }

      return res.status(201).json({ success: true, data: { ...newBlog, id: `blog-${Date.now()}` } });
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (globalErr: any) {
    return res.status(200).json({ success: true, count: initialBlogPosts.length, data: initialBlogPosts });
  }
}
