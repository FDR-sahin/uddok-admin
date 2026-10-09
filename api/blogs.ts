import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  author: { type: String, default: 'মোঃ দেলোয়ার হোসেন (মিথুন)' },
  authorTitle: { type: String, default: 'Founder & CEO, Regards Tech' },
  readTime: { type: String, default: '৫ মিনিট' },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  bulletPoints: [String],
  actionChecklist: [String],
  createdAt: { type: String, default: () => new Date().toLocaleDateString('bn-BD') }
});

const BlogModel = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return true;
  }
  if (!MONGODB_URI) {
    return false;
  }
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 3000 });
    return mongoose.connection.readyState === 1;
  } catch (err: any) {
    console.error('MongoDB Atlas connection error:', err.message);
    return false;
  }
}

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const isConnected = await connectDB();

  if (req.method === "GET") {
    try {
      if (isConnected && mongoose.connection.readyState === 1) {
        const blogs = await BlogModel.find().sort({ _id: -1 });
        return res.status(200).json({ success: true, count: blogs.length, data: blogs });
      }

      return res.status(200).json({
        success: true,
        count: 1,
        data: [{
          id: 'blog-demo-1',
          title: 'উদ্যোক্তাদের জন্য ব্যবসায় সফলতার সহজ গাইড',
          category: 'Entrepreneurship',
          author: 'MD. Delowar Hossen (Mithun)',
          excerpt: 'নতুন ব্যবসায় সিদ্ধান্ত নিতে সঠিক গাইডলাইন ও পরিকল্পনা।',
          content: 'ব্যবসা শুরু করতে প্রোডাক্ট সোর্সিং ও মার্কেটিং কিভাবে করবেন...',
          readTime: '৫ মিনিট'
        }]
      });
    } catch (e: any) {
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  if (req.method === "POST") {
    try {
      const {
        title,
        category,
        excerpt,
        content,
        author = 'মোঃ দেলোয়ার হোসেন (মিথুন)',
        readTime = '৫ মিনিট'
      } = req.body || {};

      if (!title || !category || !content || !excerpt) {
        return res.status(400).json({ success: false, message: 'Required fields missing' });
      }

      if (isConnected && mongoose.connection.readyState === 1) {
        const newBlog = await BlogModel.create({
          title,
          category,
          excerpt,
          content,
          author,
          readTime
        });
        return res.status(201).json({ success: true, data: newBlog });
      }

      const memoryBlog = {
        id: `blog-${Date.now()}`,
        title,
        category,
        excerpt,
        content,
        author,
        authorTitle: 'Founder & CEO, Regards Tech',
        readTime,
        date: new Date().toLocaleDateString('bn-BD')
      };
      return res.status(201).json({ success: true, data: memoryBlog });
    } catch (e: any) {
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
