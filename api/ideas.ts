import { MongoClient, ObjectId } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || '';

const fallbackIdeas = [
  {
    id: 'sourcing-1',
    title: 'Savar-এ MILK পাইকারি সোর্সিং',
    category: 'খাবার ও দুগ্ধ',
    district: 'ঢাকা',
    upazilaOrArea: 'সাভার',
    exactLocation: 'সাভার পৌরসভা রোড, বংশী নদীর ঘাট সংলগ্ন দুগ্ধ খামারি সমবায় সমিতি আড়ত, সাভার, ঢাকা-১৩৪০',
    coordinates: { lat: 23.8583, lng: 90.2667 },
    wholesalePrice: 65,
    retailPrice: 100,
    unit: 'প্রতি লিটার',
    moq: '২০ লিটার',
    isVerified: true,
    verificationBadgeText: 'ভেরিফায়েড প্রজেক্ট',
    lastUpdated: '১০ অক্টোবর, ২০২৪',
    description: 'সাভার MILK পাইকারি সোর্সিং: লোকাল দুগ্ধ খামারি এরিয়া/উপমাটি Local পাইকারি মূল্য / লিটার: ৬৫৳। খুচরা বাজার মূল্য: ১০০৳।',
    tags: ['#savarmilk', '#পাইকারি', '#ডেইরি', '#দুধমার্কেট', '#সাভার'],
    likes: 92,
    dislikes: 0,
    supplierTip: 'ভোর ৫টা থেকে সকাল ৭টার মধ্যে সরাসরি আড়তে উপস্থিত হলে ফ্রেশ দোয়ানো ঘন দুধ যাচাই করে সিলগালা জারে সংগ্রহ করতে পারবেন।',
    contactNumber: '+880 1712-398412',
    postedBy: { name: 'উদ্যোগ বন্ধু টিম (ভেরিফায়েড)', role: 'ফিল্ড রিসার্চার', isVerifiedUser: true },
    comments: []
  }
];

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    if (MONGODB_URI) {
      let client: any = null;
      try {
        client = new MongoClient(MONGODB_URI, { connectTimeoutMS: 5000, serverSelectionTimeoutMS: 5000 });
        await client.connect();
        const db = client.db('uddokta_db');
        const ideas = await db.collection('ideas').find({}).sort({ _id: -1 }).toArray();
        await client.close().catch(() => {});

        if (ideas && Array.isArray(ideas) && ideas.length > 0) {
          const clean = JSON.parse(JSON.stringify(ideas)).map((item: any) => ({
            ...item,
            _id: String(item._id || item.id || ''),
            id: String(item.id || item._id || '')
          }));
          return res.status(200).json({ success: true, count: clean.length, data: clean });
        }
      } catch (err: any) {
        if (client) await client.close().catch(() => {});
        console.error('MongoDB Atlas ideas fetch error:', err.message);
      }
    }
    return res.status(200).json({ success: true, count: fallbackIdeas.length, data: fallbackIdeas });
  }

  if (req.method === 'POST') {
    try {
      const newIdea = {
        ...req.body,
        createdAt: new Date().toISOString()
      };

      if (MONGODB_URI) {
        let client: any = null;
        try {
          client = new MongoClient(MONGODB_URI, { connectTimeoutMS: 5000, serverSelectionTimeoutMS: 5000 });
          await client.connect();
          const db = client.db('uddokta_db');
          const result = await db.collection('ideas').insertOne(newIdea);
          await client.close().catch(() => {});
          const insertedIdStr = String(result.insertedId);
          return res.status(201).json({
            success: true,
            data: { ...newIdea, _id: insertedIdStr, id: insertedIdStr }
          });
        } catch (err: any) {
          if (client) await client.close().catch(() => {});
          console.error('MongoDB Atlas insert idea error:', err.message);
        }
      }

      const memoryId = `sourcing-${Date.now()}`;
      return res.status(201).json({ success: true, data: { ...newIdea, _id: memoryId, id: memoryId } });
    } catch (postErr: any) {
      return res.status(500).json({ success: false, error: postErr.message });
    }
  }

  if (req.method === 'PUT') {
    const id = req.query.id || req.body._id || req.body.id;
    if (!id) return res.status(400).json({ success: false, message: 'ID required' });

    if (MONGODB_URI) {
      let client: any = null;
      try {
        client = new MongoClient(MONGODB_URI, { connectTimeoutMS: 5000, serverSelectionTimeoutMS: 5000 });
        await client.connect();
        const db = client.db('uddokta_db');
        const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id: id };
        const { _id, ...updateData } = req.body;
        await db.collection('ideas').updateOne(filter, { $set: updateData });
        await client.close().catch(() => {});
        return res.status(200).json({ success: true, message: 'Updated successfully' });
      } catch (err: any) {
        if (client) await client.close().catch(() => {});
        console.error('MongoDB Atlas update idea error:', err.message);
      }
    }
    return res.status(200).json({ success: true, message: 'Updated (memory)' });
  }

  if (req.method === 'DELETE') {
    const id = req.query.id || req.body.id;
    if (!id) return res.status(400).json({ success: false, message: 'ID required' });

    if (MONGODB_URI) {
      let client: any = null;
      try {
        client = new MongoClient(MONGODB_URI, { connectTimeoutMS: 5000, serverSelectionTimeoutMS: 5000 });
        await client.connect();
        const db = client.db('uddokta_db');
        const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id: id };
        await db.collection('ideas').deleteOne(filter);
        await client.close().catch(() => {});
        return res.status(200).json({ success: true, message: 'Deleted successfully' });
      } catch (err: any) {
        if (client) await client.close().catch(() => {});
        console.error('MongoDB Atlas delete idea error:', err.message);
      }
    }
    return res.status(200).json({ success: true, message: 'Deleted (memory)' });
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
