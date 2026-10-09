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
        const BlogModel = mongoose.models.Blog || mongoose.model('Blog', new mongoose.Schema({
          title: String, category: String, author: String, excerpt: String, content: String
        }, { strict: false }));
        const blogs = await BlogModel.find().sort({ _id: -1 }).lean();
        return res.status(200).json({ success: true, count: blogs.length, data: blogs });
      } catch (e) {
        console.log("Blog find error:", e);
      }
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
  }

  if (req.method === "POST") {
    try {
      const body = req.body || {};
      if (isMongoConnected && mongoose) {
        const BlogModel = mongoose.models.Blog || mongoose.model('Blog', new mongoose.Schema({
          title: String, category: String, author: String, excerpt: String, content: String
        }, { strict: false }));
        const newBlog = await BlogModel.create(body);
        return res.status(201).json({ success: true, data: newBlog });
      }
      return res.status(201).json({ success: true, data: { id: `blog-${Date.now()}`, ...body } });
    } catch (e) {
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
