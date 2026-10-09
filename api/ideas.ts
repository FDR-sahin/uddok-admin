import mongoose from 'mongoose';
import { initialSourcingIdeas } from '../src/data/sourcingData';

mongoose.set('bufferCommands', false);

const MONGODB_URI = process.env.MONGODB_URI || '';

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
  comments: [],
  createdAt: { type: String, default: () => new Date().toLocaleDateString('bn-BD') }
});

const IdeaModel: mongoose.Model<any> = mongoose.models.BusinessIdea || mongoose.model('BusinessIdea', BusinessIdeaSchema);

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (MONGODB_URI && mongoose.connection.readyState === 0) {
      try {
        await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 2000 });
      } catch (e: any) {
        console.log('Mongo connect fallback in ideas.ts:', e.message);
      }
    }

    if (req.method === 'GET') {
      if (mongoose.connection.readyState === 1) {
        try {
          const ideas = await IdeaModel.find().sort({ _id: -1 }).lean().exec();
          return res.status(200).json({ success: true, count: ideas.length, data: ideas });
        } catch (dbErr: any) {
          console.log('DB Query error fallback to static ideas:', dbErr.message);
        }
      }
      return res.status(200).json({ success: true, count: initialSourcingIdeas.length, data: initialSourcingIdeas });
    }

    if (req.method === 'POST') {
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

      if (mongoose.connection.readyState === 1) {
        try {
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
        } catch (dbErr: any) {
          console.log('DB Create error fallback:', dbErr.message);
        }
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
        likes: 0,
        dislikes: 0,
        comments: [],
        createdAt: new Date().toLocaleDateString('bn-BD')
      };
      return res.status(201).json({ success: true, data: memoryItem });
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (err: any) {
    return res.status(200).json({ success: true, count: initialSourcingIdeas.length, data: initialSourcingIdeas });
  }
}
