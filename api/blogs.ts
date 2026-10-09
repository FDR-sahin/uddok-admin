import mongoose from 'mongoose';
import { initialBlogPosts } from '../src/data/blogsData';

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

const BlogModel: mongoose.Model<any> = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (MONGODB_URI && mongoose.connection.readyState !== 1) {
      try {
        await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 3000 });
      } catch (e: any) {
        console.log('Mongo connect error in blogs.ts:', e.message);
      }
    }

    if (req.method === 'GET') {
      if (mongoose.connection.readyState === 1) {
        const blogs = await BlogModel.find().sort({ _id: -1 });
        return res.status(200).json({ success: true, count: blogs.length, data: blogs });
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

      if (mongoose.connection.readyState === 1) {
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
        date: new Date().toLocaleDateString('bn-BD'),
        bulletPoints: [],
        actionChecklist: [],
        tags: [category]
      };
      return res.status(201).json({ success: true, data: memoryBlog });
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (err: any) {
    return res.status(200).json({ success: true, count: initialBlogPosts.length, data: initialBlogPosts });
  }
}
