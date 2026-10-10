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
  title: { type: String, default: 'নতুন বিজনেস সোর্সিং আইডিয়া' },
  category: { type: String, default: 'সাধারণ' },
  district: { type: String, default: 'ঢাকা' },
  exactLocation: { type: String, default: 'ঢাকা, বাংলাদেশ' },
  wholesalePrice: { type: Number, default: 0 },
  wholesalePriceMax: { type: Number },
  wholesalePriceText: { type: String },
  retailPrice: { type: Number, default: 0 },
  retailPriceMax: { type: Number },
  retailPriceText: { type: String },
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

const IdeaModel: mongoose.Model<any> = mongoose.models.BusinessIdea || mongoose.model('BusinessIdea', BusinessIdeaSchema);
const BlogModel: mongoose.Model<any> = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);

// In-memory fallback if MongoDB instance is not reachable
let isMongoConnected = false;
let memoryIdeas = [...initialSourcingIdeas];
let memoryBlogs = [...initialBlogPosts];

mongoose.set('bufferCommands', false);

export async function initDatabase() {
  if (mongoose.connection.readyState === 1) {
    isMongoConnected = true;
    return;
  }
  if (!MONGODB_URI) {
    isMongoConnected = false;
    return;
  }
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 1500,
      connectTimeoutMS: 1500
    });
    isMongoConnected = true;

    // Seed database if empty
    const count = await IdeaModel.countDocuments().catch(() => 1);
    if (count === 0) {
      await IdeaModel.insertMany(initialSourcingIdeas as any[]).catch(() => {});
      await BlogModel.insertMany(initialBlogPosts as any[]).catch(() => {});
    }
  } catch (err: any) {
    isMongoConnected = false;
    console.log('MongoDB connection fallback to memory:', err.message);
  }
}

export const app = express();

app.use(express.json());

// Enable CORS for frontend communication
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
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
      title = 'নতুন বিজনেস সোর্সিং আইডিয়া',
      category = 'সাধারণ',
      district = 'ঢাকা',
      exactLocation = `${req.body.district || 'ঢাকা'}, বাংলাদেশ`,
      wholesalePrice = 0,
      wholesalePriceMax,
      wholesalePriceText,
      retailPrice = 0,
      retailPriceMax,
      retailPriceText,
      unit = 'প্রতি পিস',
      moq = '১০ পিস',
      description = '',
      supplierTip = '',
      coordinates = { lat: 23.8583, lng: 90.2667 }
    } = req.body;

    const wMin = Number(wholesalePrice || 0);
    const wMax = wholesalePriceMax !== undefined && wholesalePriceMax !== null && String(wholesalePriceMax).trim() !== ''
      ? Number(wholesalePriceMax)
      : undefined;
    const rMin = Number(retailPrice || 0);
    const rMax = retailPriceMax !== undefined && retailPriceMax !== null && String(retailPriceMax).trim() !== ''
      ? Number(retailPriceMax)
      : undefined;

    if (isMongoConnected) {
      const newIdea = await IdeaModel.create({
        title: title || 'নতুন বিজনেস সোর্সিং আইডিয়া',
        category: category || 'সাধারণ',
        district: district || 'ঢাকা',
        exactLocation: exactLocation || `${district || 'ঢাকা'}, বাংলাদেশ`,
        wholesalePrice: wMin,
        wholesalePriceMax: wMax,
        wholesalePriceText: wholesalePriceText || (wMax ? `${wMin}-${wMax}` : String(wMin)),
        retailPrice: rMin,
        retailPriceMax: rMax,
        retailPriceText: retailPriceText || (rMax ? `${rMin}-${rMax}` : String(rMin)),
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
      title: title || 'নতুন বিজনেস সোর্সিং আইডিয়া',
      category: category || 'সাধারণ',
      district: district || 'ঢাকা',
      upazilaOrArea: district,
      exactLocation: exactLocation || `${district || 'ঢাকা'}, বাংলাদেশ`,
      wholesalePrice: wMin,
      wholesalePriceMax: wMax,
      wholesalePriceText: wholesalePriceText || (wMax ? `${wMin}-${wMax}` : String(wMin)),
      retailPrice: rMin,
      retailPriceMax: rMax,
      retailPriceText: retailPriceText || (rMax ? `${rMin}-${rMax}` : String(rMin)),
      unit,
      moq,
      description,
      supplierTip,
      coordinates,
      isVerified: true,
      verificationBadgeText: 'ভেরিফায়েড প্রজেক্ট',
      lastUpdated: new Date().toLocaleDateString('bn-BD'),
      tags: [`#${district || 'ঢাকা'}`, `#${category || 'সোর্সিং'}`],
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
const handleUpdateIdeaHandler = async (req: any, res: any) => {
  try {
    const id = req.params?.id || req.query?.id || req.body?.id || req.body?._id;
    if (!id) return res.status(400).json({ success: false, message: 'ID is required' });
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
};
app.put('/api/ideas/:id', handleUpdateIdeaHandler);
app.put('/api/ideas', handleUpdateIdeaHandler);

// DELETE idea (Admin)
const handleDeleteIdeaHandler = async (req: any, res: any) => {
  try {
    const id = req.params?.id || req.query?.id;
    if (!id) return res.status(400).json({ success: false, message: 'ID is required' });
    if (isMongoConnected) {
      await IdeaModel.findByIdAndDelete(id);
    }
    memoryIdeas = memoryIdeas.filter((i: any) => i.id !== id && i._id?.toString() !== id);
    res.json({ success: true, message: 'Idea deleted' });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
};
app.delete('/api/ideas/:id', handleDeleteIdeaHandler);
app.delete('/api/ideas', handleDeleteIdeaHandler);

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

// Serve static frontend assets & fallback
app.use(express.static(path.join(dirName, 'dist')));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(dirName, 'dist', 'index.html'));
});

// Local development listener
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

export default app;
