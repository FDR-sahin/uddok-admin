import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

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

const IdeaModel = mongoose.models.BusinessIdea || mongoose.model('BusinessIdea', BusinessIdeaSchema);

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
  } catch (err) {
    console.error('MongoDB Atlas connection error:', err.message);
    return false;
  }
}

export default async function handler(req, res) {
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
        const ideas = await IdeaModel.find().sort({ _id: -1 });
        return res.status(200).json({ success: true, count: ideas.length, data: ideas });
      }

      return res.status(200).json({
        success: true,
        count: 1,
        data: [{
          id: 'sourcing-demo-1',
          title: 'Savar Pure Milk Distribution',
          category: 'Agriculture',
          district: 'Dhaka',
          exactLocation: 'Savar, Dhaka',
          wholesalePrice: 65,
          retailPrice: 100,
          unit: 'Litre',
          moq: '10 Litres',
          description: 'Sourcing pure milk from local Savar dairy farms.',
          isVerified: true
        }]
      });
    } catch (e) {
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  if (req.method === "POST") {
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
      } = req.body || {};

      if (!title || !category || !district || !exactLocation || !wholesalePrice || !retailPrice) {
        return res.status(400).json({ success: false, message: 'All required fields must be provided' });
      }

      if (isConnected && mongoose.connection.readyState === 1) {
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

      const memoryItem = {
        id: `sourcing-${Date.now()}`,
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
        isVerified: true,
        createdAt: new Date().toLocaleDateString('bn-BD')
      };
      return res.status(201).json({ success: true, data: memoryItem });
    } catch (e) {
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
