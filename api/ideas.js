export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  let mongoose = null;
  try {
    const mod = await import('mongoose');
    mongoose = mod.default || mod;
  } catch (err) {
    console.log("Mongoose import error:", err);
  }

  const MONGODB_URI = process.env.MONGODB_URI || '';
  let isMongoConnected = false;

  if (mongoose && MONGODB_URI && MONGODB_URI.startsWith('mongodb')) {
    try {
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 2000 });
      }
      isMongoConnected = mongoose.connection.readyState === 1;
    } catch (err) {
      console.log("Mongo connect error:", err);
    }
  }

  if (req.method === "GET") {
    if (isMongoConnected && mongoose) {
      try {
        const IdeaModel = mongoose.models.BusinessIdea || mongoose.model('BusinessIdea', new mongoose.Schema({
          title: String, category: String, district: String, exactLocation: String, wholesalePrice: Number, retailPrice: Number, description: String
        }, { strict: false }));
        const ideas = await IdeaModel.find().sort({ _id: -1 }).lean();
        return res.status(200).json({ success: true, count: ideas.length, data: ideas });
      } catch (e) {
        console.log("Find error:", e);
      }
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
  }

  if (req.method === "POST") {
    try {
      const body = req.body || {};
      if (isMongoConnected && mongoose) {
        const IdeaModel = mongoose.models.BusinessIdea || mongoose.model('BusinessIdea', new mongoose.Schema({
          title: String, category: String, district: String, exactLocation: String, wholesalePrice: Number, retailPrice: Number, description: String
        }, { strict: false }));
        const newIdea = await IdeaModel.create(body);
        return res.status(201).json({ success: true, data: newIdea });
      }
      return res.status(201).json({ success: true, data: { id: `sourcing-${Date.now()}`, ...body } });
    } catch (e) {
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
