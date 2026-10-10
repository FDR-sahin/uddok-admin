import { MongoClient, ObjectId } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || '';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-User-Id, X-User-Email');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const rawId = req.query?.id || req.body?.id || req.body?._id;
  if (!rawId) {
    return res.status(400).json({ success: false, message: 'Idea ID is required' });
  }

  const filter = ObjectId.isValid(String(rawId)) ? { _id: new ObjectId(String(rawId)) } : { id: String(rawId) };

  if (req.method === 'GET') {
    if (MONGODB_URI) {
      let client: any = null;
      try {
        client = new MongoClient(MONGODB_URI, { connectTimeoutMS: 5000, serverSelectionTimeoutMS: 5000 });
        await client.connect();
        const db = client.db('uddokta_db');
        const idea = await db.collection('ideas').findOne(filter);
        await client.close().catch(() => {});

        if (idea) {
          return res.status(200).json({
            success: true,
            count: idea.comments?.length || 0,
            data: idea.comments || []
          });
        }
        return res.status(404).json({ success: false, message: 'Idea not found' });
      } catch (err: any) {
        if (client) await client.close().catch(() => {});
        return res.status(500).json({ success: false, error: err.message });
      }
    }
    return res.status(200).json({ success: true, count: 0, data: [] });
  }

  if (req.method === 'POST') {
    const commentText = req.body?.comment || req.body?.content || '';
    if (!commentText.trim()) {
      return res.status(400).json({ success: false, message: 'Comment content cannot be empty' });
    }

    const newComment = {
      id: `c-${Date.now()}`,
      authorName: req.body?.authorName || 'উদ্যোক্তা',
      authorRole: req.body?.authorRole || 'ভিজিটর',
      comment: commentText.trim(),
      createdAt: new Date().toLocaleDateString('bn-BD'),
      likes: 0
    };

    if (MONGODB_URI) {
      let client: any = null;
      try {
        client = new MongoClient(MONGODB_URI, { connectTimeoutMS: 5000, serverSelectionTimeoutMS: 5000 });
        await client.connect();
        const db = client.db('uddokta_db');
        const result = await db.collection('ideas').updateOne(filter, {
          $push: { comments: newComment } as any
        });
        await client.close().catch(() => {});

        if (result.matchedCount > 0) {
          return res.status(201).json({ success: true, data: newComment });
        }
        return res.status(404).json({ success: false, message: 'Idea not found to add comment' });
      } catch (err: any) {
        if (client) await client.close().catch(() => {});
        return res.status(500).json({ success: false, error: err.message });
      }
    }

    return res.status(201).json({ success: true, data: newComment });
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
