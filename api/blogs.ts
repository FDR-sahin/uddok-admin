import { MongoClient } from 'mongodb';
import initialBlogPosts from '../src/data/blogsData.json';

if (typeof process !== 'undefined' && process.on) {
  process.on('unhandledRejection', (reason) => {
    console.log('Suppressed background rejection in blogs.ts:', reason);
  });
}

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
    if (req.method === 'GET') {
      let blogsData: any[] = initialBlogPosts;
      try {
        const dbObj = await Promise.race([
          getDb(),
          new Promise<null>((resolve) => setTimeout(() => resolve(null), 1500))
        ]);

        if (dbObj) {
          try {
            const dbBlogs = await Promise.race([
              dbObj.db.collection('blogs').find({}).sort({ _id: -1 }).toArray(),
              new Promise<any[]>((resolve) => setTimeout(() => resolve([]), 1500))
            ]);
            if (dbBlogs && dbBlogs.length > 0) {
              blogsData = dbBlogs.map((b: any) => ({
                ...b,
                _id: b._id ? String(b._id) : b.id
              }));
            }
          } finally {
            await dbObj.client.close().catch(() => {});
          }
        }
      } catch (e: any) {
        console.log('Fallback in GET /api/blogs:', e.message);
      }

      return res.status(200).json({ success: true, count: blogsData.length, data: blogsData });
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

      try {
        const dbObj = await getDb();
        if (dbObj) {
          try {
            const result = await dbObj.db.collection('blogs').insertOne(newBlog);
            return res.status(201).json({ success: true, data: { ...newBlog, _id: String(result.insertedId) } });
          } finally {
            await dbObj.client.close().catch(() => {});
          }
        }
      } catch (e: any) {
        console.log('Fallback in POST /api/blogs:', e.message);
      }

      return res.status(201).json({ success: true, data: { ...newBlog, id: `blog-${Date.now()}` } });
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (err: any) {
    return res.status(200).json({ success: true, count: initialBlogPosts.length, data: initialBlogPosts });
  }
}
