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

  const userId =
    req.body?.userId ||
    req.query?.userId ||
    req.headers['x-user-id'] ||
    req.headers['x-user-email'] ||
    req.headers['x-forwarded-for'] ||
    'guest';

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
          const likedBy = Array.isArray(idea.likedBy) ? idea.likedBy : [];
          const dislikedBy = Array.isArray(idea.dislikedBy) ? idea.dislikedBy : [];
          const hasLiked = likedBy.includes(userId);
          const hasDisliked = dislikedBy.includes(userId);

          return res.status(200).json({
            success: true,
            likesCount: idea.likes || 0,
            dislikesCount: idea.dislikes || 0,
            userReaction: hasLiked ? 'like' : hasDisliked ? 'dislike' : null
          });
        }
        return res.status(404).json({ success: false, message: 'Idea not found' });
      } catch (err: any) {
        if (client) await client.close().catch(() => {});
        return res.status(500).json({ success: false, error: err.message });
      }
    }
    return res.status(200).json({ success: true, likesCount: 0, dislikesCount: 0, userReaction: null });
  }

  if (req.method === 'POST') {
    const action = req.body?.action || req.body?.target || 'like'; // 'like' | 'dislike'

    if (MONGODB_URI) {
      let client: any = null;
      try {
        client = new MongoClient(MONGODB_URI, { connectTimeoutMS: 5000, serverSelectionTimeoutMS: 5000 });
        await client.connect();
        const db = client.db('uddokta_db');
        const idea = await db.collection('ideas').findOne(filter);

        if (!idea) {
          await client.close().catch(() => {});
          return res.status(404).json({ success: false, message: 'Idea not found' });
        }

        let likedBy: string[] = Array.isArray(idea.likedBy) ? [...idea.likedBy] : [];
        let dislikedBy: string[] = Array.isArray(idea.dislikedBy) ? [...idea.dislikedBy] : [];
        let likes = typeof idea.likes === 'number' ? idea.likes : 0;
        let dislikes = typeof idea.dislikes === 'number' ? idea.dislikes : 0;

        const hasLiked = likedBy.includes(userId);
        const hasDisliked = dislikedBy.includes(userId);

        let userReaction: 'like' | 'dislike' | null = null;

        if (action === 'like') {
          if (hasLiked) {
            // Withdraw like
            likedBy = likedBy.filter((u) => u !== userId);
            likes = Math.max(0, likes - 1);
            userReaction = null;
          } else {
            // Add like
            likedBy.push(userId);
            likes += 1;
            if (hasDisliked) {
              dislikedBy = dislikedBy.filter((u) => u !== userId);
              dislikes = Math.max(0, dislikes - 1);
            }
            userReaction = 'like';
          }
        } else if (action === 'dislike') {
          if (hasDisliked) {
            // Withdraw dislike
            dislikedBy = dislikedBy.filter((u) => u !== userId);
            dislikes = Math.max(0, dislikes - 1);
            userReaction = null;
          } else {
            // Add dislike
            dislikedBy.push(userId);
            dislikes += 1;
            if (hasLiked) {
              likedBy = likedBy.filter((u) => u !== userId);
              likes = Math.max(0, likes - 1);
            }
            userReaction = 'dislike';
          }
        }

        await db.collection('ideas').updateOne(filter, {
          $set: {
            likes,
            dislikes,
            likedBy,
            dislikedBy
          }
        });

        await client.close().catch(() => {});

        return res.status(200).json({
          success: true,
          likesCount: likes,
          dislikesCount: dislikes,
          userReaction
        });
      } catch (err: any) {
        if (client) await client.close().catch(() => {});
        return res.status(500).json({ success: false, error: err.message });
      }
    }

    return res.status(200).json({ success: true, likesCount: 1, dislikesCount: 0, userReaction: 'like' });
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
