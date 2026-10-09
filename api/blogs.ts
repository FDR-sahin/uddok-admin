import { MongoClient } from 'mongodb';
import initialBlogPosts from '../src/data/blogsData.json';

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
          const blogs = await dbObj.db.collection('blogs').find({}).sort({ _id: -1 }).toArray();
          await dbObj.client.close().catch(() => {});
          if (blogs && blogs.length > 0) {
            const cleanBlogs = blogs.map((b: any) => ({
              ...b,
              _id: b._id ? b._id.toString() : b.id
            }));
            return res.status(200).json({ success: true, count: cleanBlogs.length, data: cleanBlogs });
          }
        } catch (e: any) {
          if (dbObj.client) await dbObj.client.close().catch(() => {});
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
        if (dbObj?.client) await dbObj.client.close().catch(() => {});
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

      if (dbObj) {
        try {
          const result = await dbObj.db.collection('blogs').insertOne(newBlog);
          await dbObj.client.close().catch(() => {});
          return res.status(201).json({ success: true, data: { ...newBlog, _id: result.insertedId.toString() } });
        } catch (e: any) {
          if (dbObj.client) await dbObj.client.close().catch(() => {});
        }
      }

      return res.status(201).json({ success: true, data: { ...newBlog, id: `blog-${Date.now()}` } });
    }

    if (dbObj?.client) await dbObj.client.close().catch(() => {});
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (err: any) {
    return res.status(200).json({ success: true, count: initialBlogPosts.length, data: initialBlogPosts });
  }
}
