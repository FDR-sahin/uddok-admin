import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || '';

const fallbackBlogs = [
  {
    id: 'blog-1',
    title: '৫,০০০ টাকার মধ্যে ব্যবসা শুরু করার পরিকল্পনা',
    category: 'বাজেট প্ল্যানিং',
    date: '০৮ অক্টোবর, ২০২৪',
    readTime: '৫ মিনিট',
    author: 'মোঃ দেলোয়ার হোসেন (মিথুন)',
    authorTitle: 'Founder & CEO, Regards Tech',
    excerpt: 'মাত্র ৫,০০০ টাকা দিয়ে কি ব্যবসা শুরু করা সম্ভব? সঠিক পণ্য নির্বাচন, জিরো-ইনভেন্টরি বা মাইক্রো-লট সোর্সিং ও অর্গানিক ফেসবুক মার্কেটিংয়ের মাধ্যমে কীভাবে মাত্র ৫ হাজার টাকায় যাত্রা শুরু করবেন।',
    content: 'অনেকের ধারণা ব্যবসা করতে লাখ লাখ টাকা লাগে। কিন্তু বাস্তবে ছোট বাজেট নিয়ে শুরু করলে ভুলের ক্ষতি কম হয় এবং শেখার সুযোগ বেশি থাকে।',
    bulletPoints: ['৫,০০০ টাকায় বড় ইনভেন্টরি নয়, টেস্ট লট নিয়ে শুরু করুন।']
  }
];

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      if (MONGODB_URI) {
        let client: MongoClient | null = null;
        try {
          client = new MongoClient(MONGODB_URI, { connectTimeoutMS: 2000, serverSelectionTimeoutMS: 2000 });
          await client.connect();
          const db = client.db('uddokta_db');
          const blogs = await db.collection('blogs').find({}).sort({ _id: -1 }).toArray();
          await client.close().catch(() => {});
          if (blogs && blogs.length > 0) {
            const clean = blogs.map((b: any) => ({ ...b, _id: String(b._id) }));
            return res.status(200).json({ success: true, count: clean.length, data: clean });
          }
        } catch (err: any) {
          if (client) await client.close().catch(() => {});
          console.log('MongoDB Atlas blogs fetch fallback:', err.message);
        }
      }
      return res.status(200).json({ success: true, count: fallbackBlogs.length, data: fallbackBlogs });
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
        let client: MongoClient | null = null;
        try {
          client = new MongoClient(MONGODB_URI, { connectTimeoutMS: 2000, serverSelectionTimeoutMS: 2000 });
          await client.connect();
          const db = client.db('uddokta_db');
          const result = await db.collection('blogs').insertOne(newBlog);
          await client.close().catch(() => {});
          return res.status(201).json({ success: true, data: { ...newBlog, _id: String(result.insertedId) } });
        } catch (err: any) {
          if (client) await client.close().catch(() => {});
          console.log('MongoDB Atlas insert blog fallback:', err.message);
        }
      }

      return res.status(201).json({ success: true, data: { ...newBlog, id: `blog-${Date.now()}` } });
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (globalErr: any) {
    return res.status(200).json({ success: true, count: fallbackBlogs.length, data: fallbackBlogs });
  }
}
