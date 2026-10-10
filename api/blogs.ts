import { MongoClient } from 'mongodb';
import { initialBlogPosts } from './data/blogsData';

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
      try {
        const client = new MongoClient(MONGODB_URI, { connectTimeoutMS: 2000, serverSelectionTimeoutMS: 2000 });
        await client.connect();
        const db = client.db('uddokta_db');
        const blogs = await db.collection('blogs').find({}).sort({ _id: -1 }).toArray();
        await client.close();

        if (blogs && Array.isArray(blogs) && blogs.length > 0) {
          const clean = blogs.map((b: any) => ({
            id: String(b._id || b.id),
            _id: String(b._id || b.id),
            title: String(b.title || ''),
            category: String(b.category || ''),
            excerpt: String(b.excerpt || ''),
            content: String(b.content || ''),
            author: String(b.author || 'মোঃ দেলোয়ার হোসেন (মিথুন)'),
            authorTitle: String(b.authorTitle || 'Founder & CEO, Regards Tech'),
            readTime: String(b.readTime || '৫ মিনিট'),
            createdAt: String(b.createdAt || '')
          }));
          return res.status(200).json({ success: true, count: clean.length, data: clean });
        }
      } catch (err: any) {
        console.log('MongoDB Atlas blogs fetch error:', err.message);
      }
    }
    return res.status(200).json({ success: true, count: initialBlogPosts.length, data: initialBlogPosts });
  }

  if (req.method === 'POST') {
    try {
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
          const client = new MongoClient(MONGODB_URI, { connectTimeoutMS: 2000, serverSelectionTimeoutMS: 2000 });
          await client.connect();
          const db = client.db('uddokta_db');
          const result = await db.collection('blogs').insertOne(newBlog);
          await client.close();
          return res.status(201).json({ success: true, data: { ...newBlog, _id: String(result.insertedId) } });
        } catch (err: any) {
          console.log('MongoDB Atlas insert blog error:', err.message);
        }
      }

      return res.status(201).json({ success: true, data: { ...newBlog, id: `blog-${Date.now()}` } });
    } catch (postErr: any) {
      return res.status(500).json({ success: false, error: postErr.message });
    }
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
