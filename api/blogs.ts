import { MongoClient, ObjectId } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || '';

const fallbackBlogs = [
  {
    id: 'blog-1',
    title: '৫,০০০ টাকার মধ্যে জামদানি ও থ্রি-পিস ব্যবসা শুরু করার পূর্ণাঙ্গ গাইডলাইন',
    category: 'বাজেট প্ল্যানিং',
    excerpt: 'কম পুঁজিতে তাঁতপল্লী থেকে সরাসরি ড্রেস সংগ্রহ করে অনলাইন পেজ ও এফ-কমার্সে সফলভাবে বিক্রয়ের কার্যকরী গাইড।',
    content: 'বাংলাদেশের এফ-কমার্স ও অনলাইন ড্রেস বিজনেসের সবচেয়ে বড় সুবিধা হলো অল্প পুঁজিতে ব্যবসা শুরু করার সুযোগ।...',
    author: 'মোঃ দেলোয়ার হোসেন (মিথুন)',
    authorTitle: 'Founder & CEO, Regards Tech',
    readTime: '৫ মিনিট',
    createdAt: '2026-01-15T00:00:00.000Z'
  }
];

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const rawId = req.query?.id || req.body?.id || req.body?._id;

  if (req.method === 'GET') {
    let mongoBlogs: any[] = [];
    let deletedIds: string[] = [];

    if (MONGODB_URI) {
      let client: any = null;
      try {
        client = new MongoClient(MONGODB_URI, { connectTimeoutMS: 5000, serverSelectionTimeoutMS: 5000 });
        await client.connect();
        const db = client.db('uddokta_db');

        const delDocs = await db.collection('deleted_blogs').find({}).toArray();
        deletedIds = delDocs.map((d: any) => String(d.id));

        const blogs = await db.collection('blogs').find({}).sort({ _id: -1 }).toArray();
        await client.close().catch(() => {});

        if (blogs && Array.isArray(blogs) && blogs.length > 0) {
          mongoBlogs = JSON.parse(JSON.stringify(blogs)).map((b: any) => ({
            ...b,
            _id: String(b._id || b.id || ''),
            id: String(b.id || b._id || '')
          }));
        }
      } catch (err: any) {
        if (client) await client.close().catch(() => {});
        console.error('MongoDB Atlas blogs fetch error:', err.message);
      }
    }

    const deletedSet = new Set(deletedIds);
    const activeMongo = mongoBlogs.filter(
      (b) => !deletedSet.has(String(b.id)) && !deletedSet.has(String(b._id))
    );
    const mongoIds = new Set(activeMongo.map((b) => String(b.id)));
    const remainingFallback = fallbackBlogs.filter(
      (f) => !mongoIds.has(String(f.id)) && !deletedSet.has(String(f.id))
    );
    const combined = [...activeMongo, ...remainingFallback];

    return res.status(200).json({ success: true, count: combined.length, data: combined });
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
        createdAt: new Date().toISOString()
      };

      if (MONGODB_URI) {
        let client: any = null;
        try {
          client = new MongoClient(MONGODB_URI, { connectTimeoutMS: 5000, serverSelectionTimeoutMS: 5000 });
          await client.connect();
          const db = client.db('uddokta_db');
          const result = await db.collection('blogs').insertOne(newBlog);
          await client.close().catch(() => {});
          const insertedIdStr = String(result.insertedId);
          return res.status(201).json({
            success: true,
            data: { ...newBlog, _id: insertedIdStr, id: insertedIdStr }
          });
        } catch (err: any) {
          if (client) await client.close().catch(() => {});
          console.error('MongoDB Atlas insert blog error:', err.message);
        }
      }

      const memoryId = `blog-${Date.now()}`;
      return res.status(201).json({ success: true, data: { ...newBlog, _id: memoryId, id: memoryId } });
    } catch (postErr: any) {
      return res.status(500).json({ success: false, error: postErr.message });
    }
  }

  if (req.method === 'PUT') {
    if (!rawId) return res.status(400).json({ success: false, message: 'ID required' });

    if (MONGODB_URI) {
      let client: any = null;
      try {
        client = new MongoClient(MONGODB_URI, { connectTimeoutMS: 5000, serverSelectionTimeoutMS: 5000 });
        await client.connect();
        const db = client.db('uddokta_db');
        const filter = ObjectId.isValid(rawId) ? { _id: new ObjectId(rawId) } : { id: String(rawId) };
        const { _id, ...updateData } = req.body || {};
        await db.collection('blogs').updateOne(filter, { $set: updateData });
        await client.close().catch(() => {});
        return res.status(200).json({ success: true, message: 'Updated successfully' });
      } catch (err: any) {
        if (client) await client.close().catch(() => {});
        console.error('MongoDB Atlas update blog error:', err.message);
      }
    }
    return res.status(200).json({ success: true, message: 'Updated (memory)' });
  }

  if (req.method === 'DELETE') {
    if (!rawId) return res.status(400).json({ success: false, message: 'ID required' });

    if (MONGODB_URI) {
      let client: any = null;
      try {
        client = new MongoClient(MONGODB_URI, { connectTimeoutMS: 5000, serverSelectionTimeoutMS: 5000 });
        await client.connect();
        const db = client.db('uddokta_db');

        const filter = ObjectId.isValid(rawId) ? { _id: new ObjectId(rawId) } : { id: String(rawId) };
        await db.collection('blogs').deleteOne(filter);

        await db.collection('deleted_blogs').updateOne(
          { id: String(rawId) },
          { $set: { id: String(rawId), deletedAt: new Date().toISOString() } },
          { upsert: true }
        );

        await client.close().catch(() => {});
        return res.status(200).json({ success: true, message: 'Deleted successfully' });
      } catch (err: any) {
        if (client) await client.close().catch(() => {});
        console.error('MongoDB Atlas delete blog error:', err.message);
      }
    }
    return res.status(200).json({ success: true, message: 'Deleted (memory)' });
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
