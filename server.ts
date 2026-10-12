import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import { initialBlogPosts } from './src/data/blogsData';
import { initialSourcingIdeas } from './src/data/sourcingData';

// Fix for Windows / Bangladesh ISP DNS SRV resolution querySrv ECONNREFUSED
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn('Could not set custom DNS servers:', e);
}

dotenv.config();

const dirName = typeof __dirname !== 'undefined' ? __dirname : process.cwd();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'regardstech.team@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const RAW_MONGODB_URI = process.env.MONGODB_URI || '';
const MONGODB_URI = RAW_MONGODB_URI.replace(/^MONGODB_URI=/, '').trim();

// Helper to query MongoDB by ObjectId or string ID (sourcing-1, blog-1, etc.)
export function getQueryForId(id: string) {
  if (!id) return { _id: null };
  const cleanId = String(id).trim();
  if (mongoose.Types.ObjectId.isValid(cleanId)) {
    return { $or: [{ _id: cleanId }, { id: cleanId }, { customId: cleanId }] };
  }
  return { $or: [{ id: cleanId }, { customId: cleanId }] };
}

// --- Mongoose Schemas & Models ---
const ReplySchema = new mongoose.Schema({
  id: { type: String, default: () => `r-${Date.now()}` },
  authorId: { type: String, default: '' },
  authorName: { type: String, default: 'উদ্যোক্তা' },
  authorRole: { type: String, default: 'ভিজিটর' },
  authorEmail: { type: String, default: '' },
  authorAvatar: { type: String, default: '' },
  comment: { type: String, required: true },
  createdAt: { type: String, default: () => new Date().toLocaleDateString('bn-BD') },
  likes: { type: Number, default: 0 },
  likedBy: { type: [String], default: [] }
});

const CommentSchema = new mongoose.Schema({
  id: { type: String, default: () => `c-${Date.now()}` },
  authorId: { type: String, default: '' },
  authorName: { type: String, default: 'উদ্যোক্তা' },
  authorRole: { type: String, default: 'ভিজিটর' },
  authorEmail: { type: String, default: '' },
  authorAvatar: { type: String, default: '' },
  comment: { type: String, required: true },
  createdAt: { type: String, default: () => new Date().toLocaleDateString('bn-BD') },
  likes: { type: Number, default: 0 },
  likedBy: { type: [String], default: [] },
  replies: [ReplySchema]
});

const BusinessIdeaSchema = new mongoose.Schema({
  id: { type: String },
  customId: { type: String, index: true },
  title: { type: String, default: 'নতুন বিজনেস সোর্সিং আইডিয়া' },
  slug: { type: String },
  category: { type: String, default: 'সাধারণ' },
  district: { type: String, default: 'ঢাকা' },
  division: { type: String, default: 'Dhaka' },
  area: { type: String, default: '' },
  upazilaOrArea: { type: String, default: '' },
  exactLocation: { type: String, default: 'ঢাকা, বাংলাদেশ' },
  wholesalePrice: { type: Number, default: 0 },
  wholesalePriceMax: { type: Number },
  wholesalePriceText: { type: String },
  retailPrice: { type: Number, default: 0 },
  retailPriceMax: { type: Number },
  retailPriceText: { type: String },
  retailSellPrice: { type: Number, default: 0 },
  unit: { type: String, default: 'প্রতি পিস' },
  moq: { type: String, default: '১০ পিস' },
  profitPotential: { type: String, default: 'medium' },
  description: { type: String, default: '' },
  supplierTip: { type: String, default: '' },
  contactNumber: { type: String, default: '' },
  image: { type: String, default: '/images/ideas/default.jpg' },
  tags: { type: [String], default: [] },
  coordinates: {
    lat: { type: Number, default: 23.8583 },
    lng: { type: Number, default: 90.2667 }
  },
  isVerified: { type: Boolean, default: true },
  verificationBadgeText: { type: String, default: 'ভেরিফায়েড প্রজেক্ট' },
  status: { type: String, enum: ['draft', 'pending', 'approved', 'rejected'], default: 'approved' },
  userId: { type: String, default: '' },
  authorEmail: { type: String, default: '' },
  authorPhone: { type: String, default: '' },
  author: {
    id: { type: String, default: '' },
    name: { type: String, default: 'উদ্যোক্তা অ্যাডমিন' },
    avatar: { type: String, default: '/images/avatars/default.jpg' }
  },
  postedBy: {
    name: { type: String, default: 'উদ্যোক্তা অ্যাডমিন' },
    role: { type: String, default: 'অ্যাডমিন' },
    email: { type: String, default: '' },
    isVerifiedUser: { type: Boolean, default: true }
  },
  likes: { type: Number, default: 12 },
  dislikes: { type: Number, default: 0 },
  likedBy: { type: [String], default: [] },
  dislikedBy: { type: [String], default: [] },
  viewsCount: { type: Number, default: 15 },
  comments: [CommentSchema],
  createdAt: { type: String, default: () => new Date().toLocaleDateString('bn-BD') },
  updatedAt: { type: String, default: () => new Date().toISOString() }
});

const BlogSchema = new mongoose.Schema({
  id: { type: String },
  customId: { type: String, index: true },
  title: { type: String, required: true },
  slug: { type: String },
  category: { type: String, required: true },
  author: { type: String, default: 'উদ্যোক্তা অ্যাডমিন' },
  authorTitle: { type: String, default: 'উদ্যোক্তা ও লেখক' },
  readTime: { type: String, default: '৫ মিনিট' },
  readingTime: { type: Number, default: 5 },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  coverImage: { type: String, default: '' },
  image: { type: String, default: '' },
  bulletPoints: [String],
  actionChecklist: [String],
  tags: [String],
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
  userId: { type: String, default: '' },
  authorEmail: { type: String, default: '' },
  likes: { type: Number, default: 0 },
  likedBy: { type: [String], default: [] },
  comments: [CommentSchema],
  createdAt: { type: String, default: () => new Date().toLocaleDateString('bn-BD') },
  updatedAt: { type: String, default: () => new Date().toISOString() }
});

const UserSchema = new mongoose.Schema({
  id: { type: String },
  customId: { type: String, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String },
  password: { type: String },
  avatar: { type: String, default: '' },
  bio: { type: String, default: '' },
  division: { type: String, default: '' },
  district: { type: String, default: '' },
  area: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isBlocked: { type: Boolean, default: false, index: true },
  blockedAt: { type: String, default: '' },
  createdAt: { type: String, default: () => new Date().toISOString() },
  updatedAt: { type: String, default: () => new Date().toISOString() }
});

const SavedItemSchema = new mongoose.Schema({
  userId: { type: String, default: '', index: true },
  userEmail: { type: String, required: true, lowercase: true, index: true },
  postId: { type: String, required: true, index: true },
  createdAt: { type: String, default: () => new Date().toISOString() }
});
SavedItemSchema.index({ userEmail: 1, postId: 1 }, { unique: true });

const IdeaModel: mongoose.Model<any> = mongoose.models.BusinessIdea || mongoose.model('BusinessIdea', BusinessIdeaSchema);
const BlogModel: mongoose.Model<any> = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
const UserModel: mongoose.Model<any> = mongoose.models.User || mongoose.model('User', UserSchema);
const SavedItemModel: mongoose.Model<any> = mongoose.models.SavedItem || mongoose.model('SavedItem', SavedItemSchema);

const NotificationSchema = new mongoose.Schema({
  customId: { type: String, index: true },
  id: { type: String, default: () => `notif-${Date.now()}` },
  recipientUserId: { type: String, default: '', index: true },
  recipientUserEmail: { type: String, default: '', lowercase: true, trim: true, index: true },
  type: { type: String, enum: ['like', 'comment', 'reply', 'admin', 'system'], default: 'system' },
  title: { type: String, default: '' },
  message: { type: String, required: true },
  postId: { type: String, default: '' },
  read: { type: Boolean, default: false, index: true },
  createdAt: { type: String, default: () => new Date().toISOString() },
}, { timestamps: true });

const NotificationModel: mongoose.Model<any> = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);

// In-memory fallback if MongoDB instance is completely unreachable
let isMongoConnected = false;
let memoryIdeas = [...initialSourcingIdeas];
let memoryBlogs = [...initialBlogPosts];
let memoryUsers: any[] = [];
let memorySaved: any[] = [];
let memoryNotifications: any[] = [];

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
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
      maxPoolSize: 10
    });
    isMongoConnected = true;
    console.log('MongoDB connected successfully (uddok-admin)');

    // Seed database if empty
    const ideaCount = await IdeaModel.countDocuments().catch(() => 0);
    if (ideaCount === 0) {
      const seededIdeas = initialSourcingIdeas.map(item => ({
        ...item,
        customId: item.id,
        status: item.status || 'approved',
        isVerified: item.isVerified ?? true
      }));
      await IdeaModel.insertMany(seededIdeas).catch(() => {});
    }

    const blogCount = await BlogModel.countDocuments().catch(() => 0);
    if (blogCount === 0) {
      const seededBlogs = initialBlogPosts.map(item => ({
        ...item,
        customId: item.id,
        status: item.status || 'approved'
      }));
      await BlogModel.insertMany(seededBlogs).catch(() => {});
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
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, X-User-Email, X-User-Id, X-User-Name");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// Lazy DB initialization middleware
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

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (!ADMIN_PASSWORD) {
    console.error('ADMIN_PASSWORD is not configured');
    return res.status(503).json({
      success: false,
      message: 'Admin login is not configured.'
    });
  }
  const isValidEmail =
    email?.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase() ||
    email?.toLowerCase().trim() === 'regardstech.team@gmail.com' ||
    email?.toLowerCase().trim() === 'admin@businessbondhu.com';
  const isValidPass = typeof password === 'string' && password === ADMIN_PASSWORD;

  if (isValidEmail && isValidPass) {
    return res.json({
      success: true,
      message: 'Login successful',
      admin: { email: 'regardstech.team@gmail.com' }
    });
  }
  return res.status(401).json({
    success: false,
    message: 'ভুল ইমেইল অথবা পাসওয়ার্ড!'
  });
});

// --- BUSINESS IDEAS / SOURCING ---

// GET ideas (supports ?status=approved | pending | all, ?id=..., ?userId=..., ?authorEmail=...)
app.get('/api/ideas', async (req, res) => {
  try {
    const { status, userId, authorEmail, id } = req.query;

    if (id) {
      const singleQuery = getQueryForId(String(id));
      if (isMongoConnected) {
        const found = await IdeaModel.findOne(singleQuery);
        if (found) return res.json({ success: true, data: found });
      }
      const memFound = memoryIdeas.find((i: any) => i.id === id || i._id?.toString() === id || i.customId === id);
      if (memFound) return res.json({ success: true, data: memFound });
      return res.status(404).json({ success: false, message: 'Idea not found' });
    }

    let query: any = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    const userFilters: any[] = [];
    if (userId) {
      userFilters.push({ userId }, { 'author.id': userId });
    }
    if (authorEmail) {
      userFilters.push({ authorEmail }, { 'postedBy.email': authorEmail });
    }
    if (userFilters.length > 0) {
      query.$or = userFilters;
    }

    if (isMongoConnected) {
      const ideas = await IdeaModel.find(query).sort({ _id: -1 });
      return res.json({ success: true, count: ideas.length, data: ideas });
    }

    let result = [...memoryIdeas];
    if (status && status !== 'all') {
      result = result.filter((i: any) => (i.status || 'approved') === status);
    }
    if (userId || authorEmail) {
      result = result.filter((i: any) => {
        const matchesUser = userId && (i.userId === userId || i.author?.id === userId);
        const matchesEmail = authorEmail && (i.authorEmail === authorEmail || i.postedBy?.email === authorEmail);
        return matchesUser || matchesEmail;
      });
    }
    return res.json({ success: true, count: result.length, data: result });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET single idea by param :id
app.get('/api/ideas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = getQueryForId(id);
    if (isMongoConnected) {
      const found = await IdeaModel.findOne(query);
      if (found) return res.json({ success: true, data: found });
    }
    const memFound = memoryIdeas.find((i: any) => i.id === id || i._id?.toString() === id || i.customId === id);
    if (memFound) return res.json({ success: true, data: memFound });
    return res.status(404).json({ success: false, message: 'Idea not found' });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// POST new idea
app.post('/api/ideas', async (req, res) => {
  try {
    const {
      title = 'নতুন বিজনেস সোর্সিং আইডিয়া',
      category = 'সাধারণ',
      district = 'ঢাকা',
      division = 'Dhaka',
      exactLocation = `${req.body.district || 'ঢাকা'}, বাংলাদেশ`,
      wholesalePrice = 0,
      wholesalePriceMax,
      wholesalePriceText,
      retailPrice = 0,
      retailPriceMax,
      retailPriceText,
      retailSellPrice = 0,
      unit = 'প্রতি পিস',
      moq = '১০ পিস',
      profitPotential = 'medium',
      description = '',
      supplierTip = '',
      coordinates = { lat: 23.8583, lng: 90.2667 },
      status = 'approved',
      userId = '',
      authorEmail = '',
      authorPhone = '',
      image = '/images/ideas/default.jpg',
      tags = [],
      postedBy = {
        name: req.body.status === 'pending' ? 'উদ্যোক্তা ব্যবহারকারী' : 'উদ্যোক্তা অ্যাডমিন',
        role: req.body.status === 'pending' ? 'ব্যবহারকারী' : 'অ্যাডমিন',
        email: req.body.authorEmail || '',
        isVerifiedUser: req.body.status !== 'pending'
      }
    } = req.body;

    const wMin = Number(wholesalePrice || 0);
    const wMax = wholesalePriceMax !== undefined && wholesalePriceMax !== null && String(wholesalePriceMax).trim() !== ''
      ? Number(wholesalePriceMax)
      : undefined;
    const rMin = Number(retailPrice || retailSellPrice || 0);
    const rMax = retailPriceMax !== undefined && retailPriceMax !== null && String(retailPriceMax).trim() !== ''
      ? Number(retailPriceMax)
      : undefined;

    const finalWholesaleText = wholesalePriceText || ((wMax && wMax > wMin) ? `${wMin}-${wMax}` : String(wMin));
    const finalRetailText = retailPriceText || ((rMax && rMax > rMin) ? `${rMin}-${rMax}` : String(rMin));

    const finalPostedBy = {
      name: postedBy?.name || (status === 'pending' ? 'উদ্যোক্তা ব্যবহারকারী' : 'উদ্যোক্তা অ্যাডমিন'),
      role: postedBy?.role || (status === 'pending' ? 'ব্যবহারকারী' : 'অ্যাডমিন'),
      email: authorEmail || postedBy?.email || '',
      isVerifiedUser: status === 'approved'
    };

    const newId = `sourcing-${Date.now()}`;

    if (isMongoConnected) {
      const newIdea = await IdeaModel.create({
        customId: newId,
        id: newId,
        title: title || 'নতুন বিজনেস সোর্সিং আইডিয়া',
        category: category || 'সাধারণ',
        district: district || 'ঢাকা',
        division: division || 'Dhaka',
        exactLocation: exactLocation || `${district || 'ঢাকা'}, বাংলাদেশ`,
        wholesalePrice: wMin,
        wholesalePriceMax: wMax,
        wholesalePriceText: finalWholesaleText,
        retailPrice: rMin,
        retailPriceMax: rMax,
        retailPriceText: finalRetailText,
        retailSellPrice: rMin,
        profitPotential,
        unit,
        moq,
        description,
        supplierTip,
        image,
        tags,
        coordinates,
        status: status || 'approved',
        userId,
        authorEmail,
        authorPhone,
        postedBy: finalPostedBy,
        author: {
          id: userId || 'u-admin',
          name: finalPostedBy.name,
          avatar: '/images/avatars/default.jpg'
        },
        isVerified: status === 'approved',
        verificationBadgeText: status === 'approved' ? 'ভেরিফায়েড প্রজেক্ট' : 'পেন্ডিং রিকোয়েস্ট'
      });
      return res.status(201).json({ success: true, data: newIdea });
    }

    const memoryItem: any = {
      id: newId,
      customId: newId,
      title: title || 'নতুন বিজনেস সোর্সিং আইডিয়া',
      category: category || 'সাধারণ',
      district: district || 'ঢাকা',
      division: division || 'Dhaka',
      upazilaOrArea: district,
      exactLocation: exactLocation || `${district || 'ঢাকা'}, বাংলাদেশ`,
      wholesalePrice: wMin,
      wholesalePriceMax: wMax,
      wholesalePriceText: finalWholesaleText,
      retailPrice: rMin,
      retailPriceMax: rMax,
      retailPriceText: finalRetailText,
      retailSellPrice: rMin,
      profitPotential,
      unit,
      moq,
      description,
      supplierTip,
      image,
      coordinates,
      status: status || 'approved',
      userId,
      authorEmail,
      authorPhone,
      postedBy: finalPostedBy,
      author: {
        id: userId || 'u-admin',
        name: finalPostedBy.name,
        avatar: '/images/avatars/default.jpg'
      },
      isVerified: status === 'approved',
      verificationBadgeText: status === 'approved' ? 'ভেরিফায়েড প্রজেক্ট' : 'পেন্ডিং রিকোয়েস্ট',
      lastUpdated: new Date().toLocaleDateString('bn-BD'),
      tags: tags.length > 0 ? tags : [`#${district || 'ঢাকা'}`, `#${category || 'সোর্সিং'}`],
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

// PUT update idea (Admin or Author)
const handleUpdateIdeaHandler = async (req: any, res: any) => {
  try {
    const id = req.params?.id || req.query?.id || req.body?.id || req.body?._id;
    if (!id) return res.status(400).json({ success: false, message: 'ID is required' });
    const updates = { ...req.body, updatedAt: new Date().toISOString() };
    delete updates._id;

    if (mongoose.connection.readyState !== 1) {
      await initDatabase();
    }

    if (isMongoConnected || mongoose.connection.readyState === 1) {
      const query = getQueryForId(String(id));
      const oldIdea = await IdeaModel.findOne(query);
      const updated = await IdeaModel.findOneAndUpdate(query, updates, { returnDocument: 'after' });
      if (updated) {
        if (updates.status === 'approved' && oldIdea && oldIdea.status !== 'approved') {
          const targetEmail = updated.authorEmail || updated.postedBy?.email;
          const targetId = updated.userId || updated.author?.id;
          if (targetEmail || targetId) {
            await NotificationModel.create({
              customId: `notif-${Date.now()}`,
              id: `notif-${Date.now()}`,
              recipientUserId: targetId || '',
              recipientUserEmail: (targetEmail || '').toLowerCase().trim(),
              type: 'admin',
              title: 'আইডিয়া অনুমোদিত হয়েছে! 🎉',
              message: `অভিনন্দন! আপনার "${updated.title}" পোস্টটি অ্যাডমিন কর্তৃক অনুমোদিত হয়েছে এবং ওয়েবসাইটে প্রকাশিত হয়েছে।`,
              postId: String(updated.customId || updated._id || id),
              read: false,
              createdAt: new Date().toISOString()
            }).catch(() => {});
          }
        }
        return res.json({ success: true, data: updated });
      }
    }

    const index = memoryIdeas.findIndex(
      (i: any) => i.id === id || i._id?.toString() === id || i.customId === id
    );
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

// DELETE idea
const handleDeleteIdeaHandler = async (req: any, res: any) => {
  try {
    const id = req.params?.id || req.query?.id || req.body?.id;
    if (!id) return res.status(400).json({ success: false, message: 'ID is required' });

    if (isMongoConnected) {
      const query = getQueryForId(String(id));
      await IdeaModel.findOneAndDelete(query);
    }
    memoryIdeas = memoryIdeas.filter(
      (i: any) => i.id !== id && i._id?.toString() !== id && i.customId !== id
    );
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
    const { authorName, comment, authorId, authorEmail, authorAvatar, authorRole } = req.body;
    const newComment = {
      id: `c-${Date.now()}`,
      authorId: authorId || '',
      authorName: authorName || 'উদ্যোক্তা',
      authorRole: authorRole || 'ভিজিটর',
      authorEmail: authorEmail || '',
      authorAvatar: authorAvatar || '',
      comment: comment || '',
      createdAt: new Date().toLocaleDateString('bn-BD'),
      likes: 0,
      likedBy: [],
      replies: []
    };

    if (isMongoConnected) {
      const query = getQueryForId(id);
      const item = await IdeaModel.findOne(query);
      if (item) {
        item.comments.push(newComment);
        await item.save();
        return res.status(201).json({ success: true, data: item.comments[item.comments.length - 1] });
      }
    }

    const item = memoryIdeas.find((i: any) => i.id === id || i._id?.toString() === id || i.customId === id);
    if (item) {
      if (!item.comments) item.comments = [];
      item.comments.push(newComment);
      return res.status(201).json({ success: true, data: newComment });
    }

    return res.status(404).json({ success: false, message: 'Idea not found' });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET comments of an idea
app.get('/api/ideas/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected) {
      const query = getQueryForId(id);
      const item = await IdeaModel.findOne(query);
      if (item) {
        return res.json({ success: true, data: item.comments || [] });
      }
    }
    const item = memoryIdeas.find((i: any) => i.id === id || i._id?.toString() === id || i.customId === id);
    if (item) {
      return res.json({ success: true, data: item.comments || [] });
    }
    return res.status(404).json({ success: false, message: 'Idea not found' });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// DELETE comment
const handleDeleteComment = async (req: any, res: any) => {
  try {
    const cleanId = decodeURIComponent(req.params.id || '').trim();
    if (!cleanId) return res.status(400).json({ success: false, message: 'Comment ID is required' });

    if (isMongoConnected) {
      const isObjectId = mongoose.Types.ObjectId.isValid(cleanId) && /^[0-9a-fA-F]{24}$/.test(cleanId);
      const queryConditions: any[] = [
        { "comments.id": cleanId },
        { "comments.replies.id": cleanId },
      ];
      if (isObjectId) {
        const objId = new mongoose.Types.ObjectId(cleanId);
        queryConditions.push({ "comments._id": objId });
        queryConditions.push({ "comments.replies._id": objId });
      }

      // Check ideas
      const ideas = await IdeaModel.find({ $or: queryConditions });

      for (const idea of ideas) {
        if (Array.isArray(idea.comments)) {
          const initCount = idea.comments.length;
          idea.comments = idea.comments.filter((c: any) => String(c.id) !== cleanId && String(c._id) !== cleanId);
          if (idea.comments.length !== initCount) {
            await idea.save();
            return res.json({ success: true, message: 'মন্তব্য মুছে ফেলা হয়েছে' });
          }
          for (const c of idea.comments) {
            if (Array.isArray(c.replies)) {
              const rCount = c.replies.length;
              c.replies = c.replies.filter((r: any) => String(r.id) !== cleanId && String(r._id) !== cleanId);
              if (c.replies.length !== rCount) {
                await idea.save();
                return res.json({ success: true, message: 'মন্তব্য মুছে ফেলা হয়েছে' });
              }
            }
          }
        }
      }

      // Check blogs
      const blogs = await BlogModel.find({ $or: queryConditions });

      for (const blog of blogs) {
        if (Array.isArray(blog.comments)) {
          const initCount = blog.comments.length;
          blog.comments = blog.comments.filter((c: any) => String(c.id) !== cleanId && String(c._id) !== cleanId);
          if (blog.comments.length !== initCount) {
            await blog.save();
            return res.json({ success: true, message: 'মন্তব্য মুছে ফেলা হয়েছে' });
          }
          for (const c of blog.comments) {
            if (Array.isArray(c.replies)) {
              const rCount = c.replies.length;
              c.replies = c.replies.filter((r: any) => String(r.id) !== cleanId && String(r._id) !== cleanId);
              if (c.replies.length !== rCount) {
                await blog.save();
                return res.json({ success: true, message: 'মন্তব্য মুছে ফেলা হয়েছে' });
              }
            }
          }
        }
      }
    }

    // Memory fallback
    for (const item of memoryIdeas) {
      if (Array.isArray(item.comments)) {
        item.comments = item.comments.filter((c: any) => String(c.id) !== cleanId && String(c._id) !== cleanId);
      }
    }
    for (const b of memoryBlogs) {
      if (Array.isArray(b.comments)) {
        b.comments = b.comments.filter((c: any) => String(c.id) !== cleanId && String(c._id) !== cleanId);
      }
    }

    return res.json({ success: true, message: 'মন্তব্য মুছে ফেলা হয়েছে' });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
};

app.delete('/api/comments/:id', handleDeleteComment);
app.delete('/api/v1/comments/:id', handleDeleteComment);

// POST reaction (Like / Dislike toggle like Facebook)
app.post('/api/ideas/:id/reaction', async (req, res) => {
  try {
    const { id } = req.params;
    const { action, userId } = req.body;
    const user = String(userId || req.headers['x-user-email'] || req.headers['x-forwarded-for'] || req.ip || 'anonymous');

    if (isMongoConnected) {
      const query = getQueryForId(id);
      const item = await IdeaModel.findOne(query);
      if (item) {
        if (!Array.isArray(item.likedBy)) item.likedBy = [];
        if (!Array.isArray(item.dislikedBy)) item.dislikedBy = [];

        const hasLiked = item.likedBy.includes(user);
        const hasDisliked = item.dislikedBy.includes(user);
        let userReaction: 'like' | 'dislike' | null = null;

        if (action === 'like') {
          if (hasLiked) {
            item.likedBy = item.likedBy.filter((u: string) => u !== user);
            item.likes = Math.max(0, (item.likes || 1) - 1);
            userReaction = null;
          } else {
            item.likedBy.push(user);
            item.likes = (item.likes || 0) + 1;
            if (hasDisliked) {
              item.dislikedBy = item.dislikedBy.filter((u: string) => u !== user);
              item.dislikes = Math.max(0, (item.dislikes || 1) - 1);
            }
            userReaction = 'like';
          }
        } else if (action === 'dislike') {
          if (hasDisliked) {
            item.dislikedBy = item.dislikedBy.filter((u: string) => u !== user);
            item.dislikes = Math.max(0, (item.dislikes || 1) - 1);
            userReaction = null;
          } else {
            item.dislikedBy.push(user);
            item.dislikes = (item.dislikes || 0) + 1;
            if (hasLiked) {
              item.likedBy = item.likedBy.filter((u: string) => u !== user);
              item.likes = Math.max(0, (item.likes || 1) - 1);
            }
            userReaction = 'dislike';
          }
        }

        await item.save();
        return res.json({
          success: true,
          likesCount: item.likes,
          dislikesCount: item.dislikes,
          userReaction,
        });
      }
    }

    const item = memoryIdeas.find((i: any) => i.id === id || i._id?.toString() === id || i.customId === id);
    if (item) {
      if (!Array.isArray(item.likedBy)) item.likedBy = [];
      if (!Array.isArray(item.dislikedBy)) item.dislikedBy = [];

      const hasLiked = item.likedBy.includes(user);
      const hasDisliked = item.dislikedBy.includes(user);
      let userReaction: 'like' | 'dislike' | null = null;

      if (action === 'like') {
        if (hasLiked) {
          item.likedBy = item.likedBy.filter((u: string) => u !== user);
          item.likes = Math.max(0, (item.likes || 1) - 1);
          userReaction = null;
        } else {
          item.likedBy.push(user);
          item.likes = (item.likes || 0) + 1;
          if (hasDisliked) {
            item.dislikedBy = item.dislikedBy.filter((u: string) => u !== user);
            item.dislikes = Math.max(0, (item.dislikes || 1) - 1);
          }
          userReaction = 'like';
        }
      } else if (action === 'dislike') {
        if (hasDisliked) {
          item.dislikedBy = item.dislikedBy.filter((u: string) => u !== user);
          item.dislikes = Math.max(0, (item.dislikes || 1) - 1);
          userReaction = null;
        } else {
          item.dislikedBy.push(user);
          item.dislikes = (item.dislikes || 0) + 1;
          if (hasLiked) {
            item.likedBy = item.likedBy.filter((u: string) => u !== user);
            item.likes = Math.max(0, (item.likes || 1) - 1);
          }
          userReaction = 'dislike';
        }
      }

      return res.json({
        success: true,
        likesCount: item.likes,
        dislikesCount: item.dislikes,
        userReaction,
      });
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

// GET single blog
app.get('/api/blogs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected) {
      const query = getQueryForId(id);
      const blog = await BlogModel.findOne(query);
      if (blog) return res.json({ success: true, data: blog });
    }
    const mem = memoryBlogs.find((b: any) => b.id === id || b._id?.toString() === id || b.slug === id);
    if (mem) return res.json({ success: true, data: mem });
    return res.status(404).json({ success: false, message: 'Blog not found' });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// POST new blog
app.post('/api/blogs', async (req, res) => {
  try {
    const {
      title,
      category,
      excerpt,
      content,
      author = 'উদ্যোক্তা অ্যাডমিন',
      authorTitle = 'উদ্যোক্তা ও লেখক',
      readTime = '৫ মিনিট',
      readingTime = 5,
      coverImage = '',
      image = '',
      status = 'approved',
      userId = '',
      authorEmail = ''
    } = req.body;

    if (!title || !category || !content || !excerpt) {
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    }

    const newId = `blog-${Date.now()}`;
    const slug = (title || '').toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || newId;

    if (isMongoConnected) {
      const newBlog = await BlogModel.create({
        customId: newId,
        id: newId,
        title,
        slug,
        category,
        excerpt,
        content,
        author,
        authorTitle,
        readTime,
        readingTime,
        coverImage: coverImage || image,
        image: coverImage || image,
        status,
        userId,
        authorEmail
      });
      return res.status(201).json({ success: true, data: newBlog });
    }

    const memoryBlog: any = {
      id: newId,
      customId: newId,
      title,
      slug,
      category,
      excerpt,
      content,
      author,
      authorTitle,
      readTime,
      readingTime,
      coverImage: coverImage || image,
      image: coverImage || image,
      date: new Date().toLocaleDateString('bn-BD'),
      status,
      userId,
      authorEmail,
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

// PUT update blog
const handleUpdateBlogHandler = async (req: any, res: any) => {
  try {
    const id = req.params?.id || req.query?.id || req.body?.id || req.body?._id;
    if (!id) return res.status(400).json({ success: false, message: 'ID is required' });
    const updates = { ...req.body, updatedAt: new Date().toISOString() };
    delete updates._id;

    if (mongoose.connection.readyState !== 1) {
      await initDatabase();
    }

    if (isMongoConnected || mongoose.connection.readyState === 1) {
      const query = getQueryForId(String(id));
      const oldBlog = await BlogModel.findOne(query);
      const updated = await BlogModel.findOneAndUpdate(query, updates, { returnDocument: 'after' });
      if (updated) {
        if (updates.status === 'approved' && oldBlog && oldBlog.status !== 'approved') {
          const targetEmail = updated.authorEmail;
          const targetId = updated.userId;
          if (targetEmail || targetId) {
            await NotificationModel.create({
              customId: `notif-${Date.now()}`,
              id: `notif-${Date.now()}`,
              recipientUserId: targetId || '',
              recipientUserEmail: (targetEmail || '').toLowerCase().trim(),
              type: 'admin',
              title: 'ব্লগ অনুমোদিত হয়েছে! 🎉',
              message: `অভিনন্দন! আপনার "${updated.title}" ব্লগটি অ্যাডমিন কর্তৃক অনুমোদিত হয়েছে এবং ওয়েবসাইটে প্রকাশিত হয়েছে।`,
              postId: updated.slug || String(updated.customId || updated._id || id),
              read: false,
              createdAt: new Date().toISOString()
            }).catch(() => {});
          }
        }
        return res.json({ success: true, data: updated });
      }
    }

    const index = memoryBlogs.findIndex(
      (b: any) => b.id === id || b._id?.toString() === id || b.customId === id
    );
    if (index !== -1) {
      memoryBlogs[index] = { ...memoryBlogs[index], ...updates };
      return res.json({ success: true, data: memoryBlogs[index] });
    }

    res.status(404).json({ success: false, message: 'Blog not found' });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
};
app.put('/api/blogs/:id', handleUpdateBlogHandler);
app.put('/api/blogs', handleUpdateBlogHandler);

// DELETE blog
const handleDeleteBlogHandler = async (req: any, res: any) => {
  try {
    const id = req.params?.id || req.query?.id || req.body?.id;
    if (!id) return res.status(400).json({ success: false, message: 'ID is required' });

    if (isMongoConnected) {
      const query = getQueryForId(String(id));
      await BlogModel.findOneAndDelete(query);
    }
    memoryBlogs = memoryBlogs.filter(
      (b: any) => b.id !== id && b._id?.toString() !== id && b.customId !== id
    );
    res.json({ success: true, message: 'Blog deleted' });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
};
app.delete('/api/blogs/:id', handleDeleteBlogHandler);
app.delete('/api/blogs', handleDeleteBlogHandler);

// --- USER & SAVED / BOOKMARKS API ---

// GET users (with post & blog counts)
app.get('/api/users', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await initDatabase();
    }
    if (isMongoConnected || mongoose.connection.readyState === 1) {
      const users = await UserModel.find().select('-password -passwordHash').sort({ _id: -1 }).lean();
      const usersWithStats = await Promise.all(
        users.map(async (u: any) => {
          const userEmail = (u.email || '').toLowerCase().trim();
          const userId = String(u._id || u.id || u.customId || '');

          const ideaQuery: any = {
            $or: [
              { authorEmail: userEmail },
              { 'postedBy.email': userEmail },
            ],
          };
          if (userId) {
            ideaQuery.$or.push({ userId });
            ideaQuery.$or.push({ 'author.id': userId });
          }

          const blogQuery: any = {
            $or: [
              { authorEmail: userEmail },
            ],
          };
          if (userId) {
            blogQuery.$or.push({ userId });
          }

          const [ideasCount, blogsCount] = await Promise.all([
            IdeaModel.countDocuments(ideaQuery).catch(() => 0),
            BlogModel.countDocuments(blogQuery).catch(() => 0),
          ]);

          return {
            ...u,
            ideasCount,
            blogsCount,
          };
        })
      );
      return res.json({ success: true, count: usersWithStats.length, data: usersWithStats });
    }

    const usersWithStats = memoryUsers.map((u: any) => {
      const userEmail = (u.email || '').toLowerCase().trim();
      const userId = String(u._id || u.id || u.customId || '');
      const ideasCount = memoryIdeas.filter(
        (i: any) =>
          (i.authorEmail && i.authorEmail.toLowerCase() === userEmail) ||
          (i.postedBy?.email && i.postedBy.email.toLowerCase() === userEmail) ||
          (userId && (i.userId === userId || i.author?.id === userId))
      ).length;
      const blogsCount = memoryBlogs.filter(
        (b: any) =>
          (b.authorEmail && b.authorEmail.toLowerCase() === userEmail) ||
          (userId && b.userId === userId)
      ).length;
      return { ...u, ideasCount, blogsCount };
    });
    return res.json({ success: true, count: usersWithStats.length, data: usersWithStats });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// DELETE user
const handleDeleteUserHandler = async (req: any, res: any) => {
  try {
    const id = req.params?.id || req.query?.id || req.body?.id;
    if (!id) return res.status(400).json({ success: false, message: 'User ID is required' });

    if (mongoose.connection.readyState !== 1) {
      await initDatabase();
    }

    if (isMongoConnected || mongoose.connection.readyState === 1) {
      const query = getQueryForId(String(id));
      const user = await UserModel.findOne(query);
      if (user) {
        const userEmail = user.email;
        await UserModel.deleteOne({ _id: user._id });
        if (userEmail) {
          await SavedItemModel.deleteMany({ userEmail }).catch(() => {});
          await NotificationModel.deleteMany({ recipientUserEmail: userEmail }).catch(() => {});
        }
        return res.json({ success: true, message: 'ব্যবহারকারী সফলভাবে ডিলিট করা হয়েছে।' });
      }
    }

    const index = memoryUsers.findIndex(
      (u: any) => u.id === id || u._id?.toString() === id || u.customId === id || u.email === id
    );
    if (index !== -1) {
      memoryUsers.splice(index, 1);
      return res.json({ success: true, message: 'ব্যবহারকারী সফলভাবে ডিলিট করা হয়েছে।' });
    }

    return res.status(404).json({ success: false, message: 'ব্যবহারকারী পাওয়া যায়নি।' });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
};
app.delete('/api/users/:id', handleDeleteUserHandler);
app.delete('/api/users', handleDeleteUserHandler);

// PATCH / POST toggle block user
const handleToggleBlockUserHandler = async (req: any, res: any) => {
  try {
    const id = req.params?.id || req.body?.id || req.query?.id;
    if (!id) return res.status(400).json({ success: false, message: 'User ID is required' });

    if (mongoose.connection.readyState !== 1) {
      await initDatabase();
    }

    if (isMongoConnected || mongoose.connection.readyState === 1) {
      const query = getQueryForId(String(id));
      const user = await UserModel.findOne(query);
      if (user) {
        const nextState = req.body?.isBlocked !== undefined ? Boolean(req.body.isBlocked) : !user.isBlocked;
        user.isBlocked = nextState;
        user.blockedAt = nextState ? new Date().toISOString() : '';
        await user.save();

        if (nextState && user.email) {
          // Add a notification so user knows
          await NotificationModel.create({
            customId: `notif-${Date.now()}`,
            id: `notif-${Date.now()}`,
            recipientUserId: String(user._id || user.customId || ''),
            recipientUserEmail: user.email.toLowerCase().trim(),
            type: 'admin',
            title: 'অ্যাকাউন্ট স্ট্যাটাস আপডেট ⚠️',
            message: 'আপনার অ্যাকাউন্টটি নীতিমালার লঙ্ঘনের কারণে অ্যাডমিন কর্তৃক সাময়িকভাবে ব্লক করা হয়েছে।',
            postId: '',
            read: false,
            createdAt: new Date().toISOString(),
          }).catch(() => {});
        } else if (!nextState && user.email) {
          await NotificationModel.create({
            customId: `notif-${Date.now()}`,
            id: `notif-${Date.now()}`,
            recipientUserId: String(user._id || user.customId || ''),
            recipientUserEmail: user.email.toLowerCase().trim(),
            type: 'admin',
            title: 'অ্যাকাউন্ট আনব্লক করা হয়েছে! 🎉',
            message: 'আপনার অ্যাকাউন্টটি অ্যাডমিন কর্তৃক পুনরায় সক্রিয় করা হয়েছে। আপনি এখন সাধারণ ব্যবহার চালিয়ে যেতে পারেন।',
            postId: '',
            read: false,
            createdAt: new Date().toISOString(),
          }).catch(() => {});
        }

        return res.json({
          success: true,
          isBlocked: user.isBlocked,
          message: user.isBlocked ? 'ব্যবহারকারীকে ব্লক করা হয়েছে।' : 'ব্যবহারকারীকে আনব্লক করা হয়েছে।',
          data: user,
        });
      }
    }

    const memUser = memoryUsers.find(
      (u: any) => u.id === id || u._id?.toString() === id || u.customId === id || u.email === id
    );
    if (memUser) {
      const nextState = req.body?.isBlocked !== undefined ? Boolean(req.body.isBlocked) : !memUser.isBlocked;
      memUser.isBlocked = nextState;
      memUser.blockedAt = nextState ? new Date().toISOString() : '';
      return res.json({
        success: true,
        isBlocked: memUser.isBlocked,
        message: memUser.isBlocked ? 'ব্যবহারকারীকে ব্লক করা হয়েছে।' : 'ব্যবহারকারীকে আনব্লক করা হয়েছে।',
        data: memUser,
      });
    }

    return res.status(404).json({ success: false, message: 'ব্যবহারকারী পাওয়া যায়নি।' });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
};
app.patch('/api/users/:id/block', handleToggleBlockUserHandler);
app.post('/api/users/:id/block', handleToggleBlockUserHandler);
app.put('/api/users/:id/block', handleToggleBlockUserHandler);
app.post('/api/users/block', handleToggleBlockUserHandler);

// GET saved bookmarks (supports ?userEmail=... or ?userId=...)
app.get('/api/saved', async (req, res) => {
  try {
    const { userEmail, userId } = req.query;
    const filter: any = {};
    if (userEmail) filter.userEmail = String(userEmail).toLowerCase().trim();
    if (userId) filter.userId = String(userId).trim();

    if (isMongoConnected) {
      const list = await SavedItemModel.find(filter).sort({ createdAt: -1 });
      return res.json({ success: true, count: list.length, data: list });
    }
    const filtered = memorySaved.filter(s =>
      (userEmail && s.userEmail === String(userEmail).toLowerCase().trim()) ||
      (userId && s.userId === String(userId).trim())
    );
    return res.json({ success: true, count: filtered.length, data: filtered });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// POST toggle save bookmark
app.post('/api/saved', async (req, res) => {
  try {
    const { userEmail, userId, postId } = req.body;
    if (!userEmail || !postId) {
      return res.status(400).json({ success: false, message: 'userEmail and postId are required' });
    }
    const cleanEmail = String(userEmail).toLowerCase().trim();
    const cleanPostId = String(postId).trim();

    if (isMongoConnected) {
      const existing = await SavedItemModel.findOne({ userEmail: cleanEmail, postId: cleanPostId });
      if (existing) {
        await SavedItemModel.deleteOne({ _id: existing._id });
        return res.json({ success: true, saved: false, message: 'Removed from saved' });
      }
      const saved = await SavedItemModel.create({
        userId: userId || '',
        userEmail: cleanEmail,
        postId: cleanPostId
      });
      return res.status(201).json({ success: true, saved: true, data: saved });
    }

    const idx = memorySaved.findIndex(s => s.userEmail === cleanEmail && s.postId === cleanPostId);
    if (idx !== -1) {
      memorySaved.splice(idx, 1);
      return res.json({ success: true, saved: false, message: 'Removed from saved' });
    }
    const item = { id: `save-${Date.now()}`, userId: userId || '', userEmail: cleanEmail, postId: cleanPostId, createdAt: new Date().toISOString() };
    memorySaved.push(item);
    return res.status(201).json({ success: true, saved: true, data: item });
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
