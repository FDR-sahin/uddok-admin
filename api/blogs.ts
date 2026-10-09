import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { initialBlogPosts } from '../src/data/blogsData.js';

dotenv.config();

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

let isMongoConnected = false;

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    isMongoConnected = true;
    return;
  }
  if (!MONGODB_URI) {
    isMongoConnected = false;
    return;
  }
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 3000 });
    isMongoConnected = true;
  } catch {
    isMongoConnected = false;
  }
}

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  await connectDB();

  if (req.method === "GET") {
    try {
      if (isMongoConnected) {
        const blogs = await BlogModel.find().sort({ _id: -1 });
        return res.status(200).json({ success: true, count: blogs.length, data: blogs });
      }
      return res.status(200).json({ success: true, count: initialBlogPosts.length, data: initialBlogPosts });
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

      if (isMongoConnected) {
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
