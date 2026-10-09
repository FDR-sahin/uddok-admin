import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { initialBlogPosts } from './src/data/blogsData';
import { initialSourcingIdeas } from './src/data/sourcingData';

dotenv.config();

const dirName = typeof __dirname !== 'undefined' ? __dirname : process.cwd();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'regardstech.team@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'redardstech123';
const MONGODB_URI = process.env.MONGODB_URI || '';

// --- Mongoose Schemas & Models ---
const CommentSchema = new mongoose.Schema({
  authorName: { type: String, default: 'উদ্যোক্তা' },
  authorRole: { type: String, default: 'ভিজিটর' },
  comment: { type: String, required: true },
  createdAt: { type: String, default: () => new Date().toLocaleDateString('bn-BD') },
  likes: { type: Number, default: 0 }
});

const BusinessIdeaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  district: { type: String, required: true },
  exactLocation: { type: String, required: true },
  wholesalePrice: { type: Number, required: true },
  retailPrice: { type: Number, required: true },
  unit: { type: String, default: 'প্রতি পিস' },
  moq: { type: String, default: '১০ পিস' },
  description: { type: String, default: '' },
  supplierTip: { type: String, default: '' },
  coordinates: {
    lat: { type: Number, default: 23.8583 },
    lng: { type: Number, default: 90.2667 }
  },
  isVerified: { type: Boolean, default: true },
  likes: { type: Number, default: 12 },
  dislikes: { type: Number, default: 0 },
  comments: [CommentSchema],
  createdAt: { type: String, default: () => new Date().toLocaleDateString('bn-BD') }
});

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

const IdeaModel = mongoose.models.BusinessIdea || mongoose.model('BusinessIdea', BusinessIdeaSchema);
const BlogModel = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);

// In-memory fallback if MongoDB instance is not reachable
let isMongoConnected = false;
let memoryIdeas = [...initialSourcingIdeas];
let memoryBlogs = [...initialBlogPosts];

let dbInitPromise: Promise<void> | null = null;

export async function initDatabase() {
  if (dbInitPromise) return dbInitPromise;

  dbInitPromise = (async () => {
    try {
      if (!MONGODB_URI) {
        isMongoConnected = false;
        return;
      }
      if (mongoose.connection.readyState === 1) {
        isMongoConnected = true;
        return;
      }
      await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 3000
      });
      isMongoConnected = true;

      // Seed database if empty
      const count = await IdeaModel.countDocuments();
      if (count === 0) {
        await IdeaModel.insertMany(initialSourcingIdeas);
        await BlogModel.insertMany(initialBlogPosts);
      }
    } catch (err: any) {
      isMongoConnected = false;
      console.log('MongoDB connection fallback:', err.message);
    }
  })();

  return dbInitPromise;
}

export const app = express();

app.use(express.json());

// Enable CORS for frontend communication
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Lazy DB initialization middleware for Serverless & Local
app.use(async (req, res, next) => {
  try {
    await initDatabase();
  } catch (err) {
    console.error('Database connection middleware error:', err);
  }
  next();
});

// --- API ROUTES ---

// Health & DB status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: isMongoConnected ? 'MongoDB (Connected)' : 'Memory / Local Fallback',
    adminEmail: ADMIN_EMAIL
  });
});

// Admin Login (Email & Password)
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  const isValidEmail = email?.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase() || email?.toLowerCase().trim() === 'regardstech.team@gmail.com';
  const isValidPass = password === ADMIN_PASSWORD || password === 'redardstech123' || password === 'regardstech123';
  
  if (isValidEmail && isValidPass) {
    return res.json({
      success: true,
      message: 'Login successful',
      admin: { email: 'regardstech.team@gmail.com' }
    });
  }
  return res.status(401).json({
    success: false,
    message: 'ভুল ইমেইল অথবা পাসওয়ার্ড! (regardstech.team@gmail.com / redardstech123)'
  });
});

// --- BUSINESS IDEAS / SOURCING ---

// GET all ideas
app.get('/api/ideas', async (req, res) => {
  try {
    if (isMongoConnected) {
      const ideas = await IdeaModel.find().sort({ _id: -1 });
      return res.json({ success: true, count: ideas.length, data: ideas });
    }
    return res.json({ success: true, count: memoryIdeas.length, data: memoryIdeas });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// POST new idea (Admin)
app.post('/api/ideas', async (req, res) => {
  try {
    const {
      title,
      category,
      district,
      exactLocation,
      wholesalePrice,
      retailPrice,
      unit = 'প্রতি পিস',
      moq = '১০ পিস',
      description = '',
      supplierTip = '',
      coordinates = { lat: 23.8583, lng: 90.2667 }
    } = req.body;

    if (!title || !category || !district || !exactLocation || !wholesalePrice || !retailPrice) {
      return res.status(400).json({ success: false, message: 'All required fields must be provided' });
    }

    if (isMongoConnected) {
      const newIdea = await IdeaModel.create({
        title,
        category,
        district,
        exactLocation,
        wholesalePrice: Number(wholesalePrice),
        retailPrice: Number(retailPrice),
        unit,
        moq,
        description,
        supplierTip,
        coordinates,
        isVerified: true
      });
      return res.status(201).json({ success: true, data: newIdea });
    }

    const memoryItem: any = {
      id: `sourcing-${Date.now()}`,
      title,
      category,
      district,
      upazilaOrArea: district,
      exactLocation,
      wholesalePrice: Number(wholesalePrice),
      retailPrice: Number(retailPrice),
      unit,
      moq,
      description,
      supplierTip,
      coordinates,
      isVerified: true,
      verificationBadgeText: 'ভেরিফায়েড প্রজেক্ট',
      lastUpdated: new Date().toLocaleDateString('bn-BD'),
      tags: [`#${district}`, `#${category}`],
      likes: 0,
      dislikes: 0,
      comments: []
    };
    memoryIdeas.unshift(memoryItem);
    return res.status(201).json({ success: true, data: memoryItem });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// PUT update idea (Admin)
app.put('/api/ideas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (isMongoConnected) {
      const updated = await IdeaModel.findByIdAndUpdate(id, updates, { new: true });
      return res.json({ success: true, data: updated });
    }

    const index = memoryIdeas.findIndex((i: any) => i.id === id || i._id?.toString() === id);
    if (index !== -1) {
      memoryIdeas[index] = { ...memoryIdeas[index], ...updates };
      return res.json({ success: true, data: memoryIdeas[index] });
    }

    res.status(404).json({ success: false, message: 'Idea not found' });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// DELETE idea (Admin)
app.delete('/api/ideas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected) {
      await IdeaModel.findByIdAndDelete(id);
    }
    memoryIdeas = memoryIdeas.filter((i: any) => i.id !== id && i._id?.toString() !== id);
    res.json({ success: true, message: 'Idea deleted' });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// POST comment to an idea
app.post('/api/ideas/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;
    const { authorName, comment } = req.body;

    if (isMongoConnected) {
      const item = await IdeaModel.findById(id);
      if (item) {
        item.comments.push({
          authorName: authorName || 'উদ্যোক্তা',
          authorRole: 'ভিজিটর',
          comment,
          createdAt: new Date().toLocaleDateString('bn-BD'),
          likes: 0
        } as any);
        await item.save();
        return res.status(201).json({ success: true, data: item.comments[item.comments.length - 1] });
      }
    }

    const item = memoryIdeas.find((i: any) => i.id === id || i._id?.toString() === id);
    if (item) {
      const newC = {
        id: `c-${Date.now()}`,
        authorName: authorName || 'উদ্যোক্তা',
        authorRole: 'ভিজিটর',
        comment,
        createdAt: 'এইমাত্র',
        likes: 0
      };
      if (!item.comments) item.comments = [];
      item.comments.push(newC);
      return res.status(201).json({ success: true, data: newC });
    }

    res.status(404).json({ success: false, message: 'Idea not found' });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// --- BLOGS ---

// GET all blogs
app.get('/api/blogs', async (req, res) => {
  try {
    if (isMongoConnected) {
      const blogs = await BlogModel.find().sort({ _id: -1 });
      return res.json({ success: true, count: blogs.length, data: blogs });
    }
    return res.json({ success: true, count: memoryBlogs.length, data: memoryBlogs });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// POST new blog (Admin)
app.post('/api/blogs', async (req, res) => {
  try {
    const {
      title,
      category,
      excerpt,
      content,
      author = 'মোঃ দেলোয়ার হোসেন (মিথুন)',
      readTime = '৫ মিনিট'
    } = req.body;

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

    const memoryBlog: any = {
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
    memoryBlogs.unshift(memoryBlog);
    return res.status(201).json({ success: true, data: memoryBlog });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// PUT update blog (Admin)
app.put('/api/blogs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (isMongoConnected) {
      const updated = await BlogModel.findByIdAndUpdate(id, updates, { new: true });
      return res.json({ success: true, data: updated });
    }

    const index = memoryBlogs.findIndex((b: any) => b.id === id || b._id?.toString() === id);
    if (index !== -1) {
      memoryBlogs[index] = { ...memoryBlogs[index], ...updates };
      return res.json({ success: true, data: memoryBlogs[index] });
    }

    res.status(404).json({ success: false, message: 'Blog not found' });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// DELETE blog (Admin)
app.delete('/api/blogs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected) {
      await BlogModel.findByIdAndDelete(id);
    }
    memoryBlogs = memoryBlogs.filter((b: any) => b.id !== id && b._id?.toString() !== id);
    res.json({ success: true, message: 'Blog deleted' });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Local development listener
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

export default app;
