import { MongoClient, ObjectId } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || '';

const fallbackIdeas: any[] = [
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
    likedBy: [],
    dislikedBy: [],
    supplierTip: 'ভোর ৫টা থেকে সকাল ৭টার মধ্যে সরাসরি আড়তে উপস্থিত হলে ফ্রেশ দোয়ানো ঘন দুধ যাচাই করে সিলগালা জারে সংগ্রহ করতে পারবেন।',
    contactNumber: '+880 1712-398412',
    postedBy: { name: 'উদ্যোগ বন্ধু টিম (ভেরিফায়েড)', role: 'ফিল্ড রিসার্চার', isVerifiedUser: true },
    comments: []
  },
  {
    id: 'sourcing-2',
    title: 'চকবাজার জুয়েলারি ও ট্রেন্ডি হেয়ার এক্সেসরিজ পাইকারি সোর্সিং',
    category: 'পোশাক ও গহনা',
    district: 'ঢাকা',
    upazilaOrArea: 'পুরান ঢাকা',
    exactLocation: 'চক মোগলটুলী, আশিক প্লাজা ও খান মার্কেট ৩য় তলা, চকবাজার, পুরান ঢাকা',
    coordinates: { lat: 23.7161, lng: 90.3957 },
    wholesalePrice: 40,
    retailPrice: 120,
    unit: 'প্রতি পিস',
    moq: '১২ পিস (১ ডজন)',
    isVerified: true,
    verificationBadgeText: 'ভেরিফায়েড হাব',
    lastUpdated: '০৯ অক্টোবর, ২০২৪',
    description: 'চকবাজারের আশিক প্লাজায় সরাসরি ইমপোর্টাররা বসেন। খুচরা বাজারে যা ১২০-১৫০ টাকায় বিক্রি হয়, পাইকারিতে মাত্র ৩৫-৪৫ টাকায় ডজন হিসেবে পাওয়া যায়।',
    tags: ['#চকবাজার', '#জুয়েলারি', '#এক্সেসরিজ', '#পুরানঢাকা', '#মেকআপ'],
    likes: 145,
    dislikes: 2,
    likedBy: [],
    dislikedBy: [],
    supplierTip: 'দোকানে গিয়ে স্যাম্পল হিসেবে ১ ডজন ডেমো দেখতে চাইবেন।',
    contactNumber: '+880 1819-876543',
    postedBy: { name: 'ফারহান আহমেদ', role: 'কমিউনিটি সুপারভাইজার', isVerifiedUser: true },
    comments: []
  },
  {
    id: 'sourcing-3',
    title: 'ইসলামপুর সুতি প্রিন্ট ও প্রিমিয়াম থান কাপড় পাইকারি মোকাম',
    category: 'পোশাক',
    district: 'ঢাকা',
    upazilaOrArea: 'কোতোয়ালী',
    exactLocation: 'জাহানারা গার্ডেন মার্কেট ও আহসান উল্লাহ রোড, ইসলামপুর টেক্সটাইল হাব, ঢাকা',
    coordinates: { lat: 23.7099, lng: 90.4072 },
    wholesalePrice: 55,
    retailPrice: 95,
    unit: 'প্রতি গজ',
    moq: '২০ গজ (১ থান)',
    isVerified: true,
    verificationBadgeText: 'ভেরিফায়েড মার্কেট',
    lastUpdated: '০৮ অক্টোবর, ২০২৪',
    description: 'থ্রি-পিস, কুর্তি, বেবি ফ্রক বা কাস্টম হোম ডেকোর তৈরির কাপড়ের জন্য দেশের প্রধানতম পাইকারি মোকাম ইসলামপুর।',
    tags: ['#ইসলামপুর', '#কাপড়পাইকারি', '#থানকাপড়', '#সুতিকাপড়'],
    likes: 112,
    dislikes: 1,
    likedBy: [],
    dislikedBy: [],
    supplierTip: 'শনিবার ও রবিবার সকালে নতুন লট আসে।',
    contactNumber: '+880 1911-234567',
    postedBy: { name: 'মিজানুর রহমান', role: 'টেক্সটাইল স্পেশালিস্ট', isVerifiedUser: true },
    comments: []
  },
  {
    id: 'sourcing-4',
    title: 'বগুড়ার শেরপুর স্পেশাল খাঁটি দই ও মাটির সরা পাইকারি সোর্সিং',
    category: 'খাবার ও দুগ্ধ',
    district: 'বগুড়া',
    upazilaOrArea: 'শেরপুর',
    exactLocation: 'ঢাকা-বগুড়া মহাসড়ক সংলগ্ন ঘোঁষপাড়া মিষ্টি মোকাম, শেরপুর বাজার, বগুড়া',
    coordinates: { lat: 24.6738, lng: 89.4312 },
    wholesalePrice: 180,
    retailPrice: 280,
    unit: 'প্রতি সরা (১ কেজি)',
    moq: '১০ সরা',
    isVerified: true,
    verificationBadgeText: 'ভেরিফায়েড রুরাল হাব',
    lastUpdated: '০৭ অক্টোবর, ২০২৪',
    description: 'ঐতিহ্যবাহী বগুড়ার আসল ক্ষীরসা দই শেরপুরের স্থানীয় কারিগরদের কাছ থেকে সরাসরি পাইকারিতে ১৮০-১৯০ টাকায় সংগৃহীত।',
    tags: ['#বগুড়াদই', '#শেরপুরমিষ্টি', '#ঐতিহ্যবাহী', '#খাদ্যউদ্যোগ'],
    likes: 78,
    dislikes: 0,
    likedBy: [],
    dislikedBy: [],
    supplierTip: 'নাইট কোচে সকালে ফ্রেশ পার্সেল পাওয়া যায়।',
    contactNumber: '+880 1715-998877',
    postedBy: { name: 'আসাদুল্লাহ আল গালিব', role: 'লোকাল জেলা প্রতিনিধি', isVerifiedUser: true },
    comments: []
  },
  {
    id: 'sourcing-5',
    title: 'নরসিংদী বাবুরহাট শেখেরচর তাঁতের সুতি লুঙ্গি ও বেডশিট মোকাম',
    category: 'পোশাক',
    district: 'নরসিংদী',
    upazilaOrArea: 'শেখেরচর',
    exactLocation: 'শেখেরচর বাবুরহাট প্রধান মার্কেট লেন ৪, ঢাকা-সিলেট মহাসড়ক সংলগ্ন, নরসিংদী',
    coordinates: { lat: 23.9042, lng: 90.6975 },
    wholesalePrice: 280,
    retailPrice: 480,
    unit: 'প্রতি পিস',
    moq: '৬ পিস',
    isVerified: true,
    verificationBadgeText: 'ভেরিফায়েড কাপড়ের হাট',
    lastUpdated: '০৬ অক্টোবর, ২০২৪',
    description: 'এশিয়ার অন্যতম বৃহৎ কাপড়ের হাট শেখেরচর বাবুরহাট। সুতি লুঙ্গি ও বেডশিট সরাসরি তাঁতিদের থেকে সংগৃহীত।',
    tags: ['#নরসিংদী', '#বাবুরহাট', '#তাঁতেরলুঙ্গি', '#বেডশিট'],
    likes: 134,
    dislikes: 1,
    likedBy: [],
    dislikedBy: [],
    supplierTip: 'বৃহস্পতি ওশুক্রবার রাত ৩টা থেকে ভোর পর্যন্ত প্রধান কেনাবেচা হয়।',
    contactNumber: '+880 1622-443322',
    postedBy: { name: 'মাকসুদুর রহমান', role: 'ট্রেডার ও কন্ট্রিবিউটর', isVerifiedUser: true },
    comments: []
  },
  {
    id: 'sourcing-6',
    title: 'যশোর বেনাপোল ও স্থানীয় অর্গানিক খেজুরের গুড় ও কুল পাইকারি হাব',
    category: 'কৃষি ও খাবার',
    district: 'যশোর',
    upazilaOrArea: 'বাঘারপাড়া ও বেনাপোল',
    exactLocation: 'খাজুরা বাজার ও বাঘারপাড়া গুড়ের মোকাম, যশোর',
    coordinates: { lat: 23.1664, lng: 89.2137 },
    wholesalePrice: 160,
    retailPrice: 270,
    unit: 'প্রতি কেজি',
    moq: '১৫ কেজি',
    isVerified: true,
    verificationBadgeText: 'ভেরিফায়েড হাব',
    lastUpdated: '০৫ অক্টোবর, ২০২৪',
    description: 'যশোরের আসল ঝোলা গুড় ও পাটালি গুড় সরাসরি গাছিদের থেকে সংগৃহীত।',
    tags: ['#যশোরগুড়', '#পাটালিগুড়', '#অর্গানিকফুড'],
    likes: 58,
    dislikes: 1,
    likedBy: [],
    dislikedBy: [],
    supplierTip: 'আসল গুড় জিভে নরম হয়ে সহজে গলে যাবে।',
    contactNumber: '+880 1733-112233',
    postedBy: { name: 'শামীম ওসমান', role: 'কমিউনিটি মেম্বার', isVerifiedUser: true },
    comments: []
  }
];

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-User-Id, X-User-Email');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const queryAction = req.query?.action;
  const rawId = req.query?.id || req.query?.ideaId || req.body?.id || req.body?._id;

  // --- REACTION ACTION VIA QUERY PARAMETER (FALLBACK) ---
  if (queryAction === 'reaction') {
    if (!rawId) return res.status(400).json({ success: false, message: 'Idea ID is required' });
    const filter = ObjectId.isValid(String(rawId)) ? { _id: new ObjectId(String(rawId)) } : { id: String(rawId) };
    const userId =
      req.body?.userId ||
      req.query?.userId ||
      req.headers['x-user-id'] ||
      req.headers['x-user-email'] ||
      req.headers['x-forwarded-for'] ||
      'guest';

    if (req.method === 'GET') {
      if (MONGODB_URI) {
        let client: any = null;
        try {
          client = new MongoClient(MONGODB_URI, { connectTimeoutMS: 5000, serverSelectionTimeoutMS: 5000 });
          await client.connect();
          const db = client.db('uddokta_db');
          const idea = await db.collection('ideas').findOne(filter);
          await client.close().catch(() => {});

          if (idea) {
            const likedBy = Array.isArray(idea.likedBy) ? idea.likedBy : [];
            const dislikedBy = Array.isArray(idea.dislikedBy) ? idea.dislikedBy : [];
            const hasLiked = likedBy.includes(userId);
            const hasDisliked = dislikedBy.includes(userId);
            return res.status(200).json({
              success: true,
              likesCount: idea.likes || 0,
              dislikesCount: idea.dislikes || 0,
              userReaction: hasLiked ? 'like' : hasDisliked ? 'dislike' : null
            });
          }
        } catch (err: any) {
          if (client) await client.close().catch(() => {});
        }
      }
      return res.status(200).json({ success: true, likesCount: 0, dislikesCount: 0, userReaction: null });
    }

    if (req.method === 'POST') {
      const target = req.body?.action || req.body?.target || 'like';
      if (MONGODB_URI) {
        let client: any = null;
        try {
          client = new MongoClient(MONGODB_URI, { connectTimeoutMS: 5000, serverSelectionTimeoutMS: 5000 });
          await client.connect();
          const db = client.db('uddokta_db');
          const idea = await db.collection('ideas').findOne(filter);
          if (idea) {
            let likedBy: string[] = Array.isArray(idea.likedBy) ? [...idea.likedBy] : [];
            let dislikedBy: string[] = Array.isArray(idea.dislikedBy) ? [...idea.dislikedBy] : [];
            let likes = typeof idea.likes === 'number' ? idea.likes : 0;
            let dislikes = typeof idea.dislikes === 'number' ? idea.dislikes : 0;

            const hasLiked = likedBy.includes(userId);
            const hasDisliked = dislikedBy.includes(userId);
            let userReaction: 'like' | 'dislike' | null = null;

            if (target === 'like') {
              if (hasLiked) {
                likedBy = likedBy.filter((u) => u !== userId);
                likes = Math.max(0, likes - 1);
                userReaction = null;
              } else {
                likedBy.push(userId);
                likes += 1;
                if (hasDisliked) {
                  dislikedBy = dislikedBy.filter((u) => u !== userId);
                  dislikes = Math.max(0, dislikes - 1);
                }
                userReaction = 'like';
              }
            } else if (target === 'dislike') {
              if (hasDisliked) {
                dislikedBy = dislikedBy.filter((u) => u !== userId);
                dislikes = Math.max(0, dislikes - 1);
                userReaction = null;
              } else {
                dislikedBy.push(userId);
                dislikes += 1;
                if (hasLiked) {
                  likedBy = likedBy.filter((u) => u !== userId);
                  likes = Math.max(0, likes - 1);
                }
                userReaction = 'dislike';
              }
            }

            await db.collection('ideas').updateOne(filter, {
              $set: { likes, dislikes, likedBy, dislikedBy }
            });
            await client.close().catch(() => {});
            return res.status(200).json({ success: true, likesCount: likes, dislikesCount: dislikes, userReaction });
          }
          await client.close().catch(() => {});
        } catch (err: any) {
          if (client) await client.close().catch(() => {});
        }
      }
      return res.status(200).json({ success: true, likesCount: 1, dislikesCount: 0, userReaction: 'like' });
    }
  }

  // --- COMMENTS ACTION VIA QUERY PARAMETER (FALLBACK) ---
  if (queryAction === 'comments' || queryAction === 'comment') {
    if (!rawId) return res.status(400).json({ success: false, message: 'Idea ID is required' });
    const filter = ObjectId.isValid(String(rawId)) ? { _id: new ObjectId(String(rawId)) } : { id: String(rawId) };

    if (req.method === 'GET') {
      if (MONGODB_URI) {
        let client: any = null;
        try {
          client = new MongoClient(MONGODB_URI, { connectTimeoutMS: 5000, serverSelectionTimeoutMS: 5000 });
          await client.connect();
          const db = client.db('uddokta_db');
          const idea = await db.collection('ideas').findOne(filter);
          await client.close().catch(() => {});
          if (idea) {
            return res.status(200).json({ success: true, count: idea.comments?.length || 0, data: idea.comments || [] });
          }
        } catch (err: any) {
          if (client) await client.close().catch(() => {});
        }
      }
      return res.status(200).json({ success: true, count: 0, data: [] });
    }

    if (req.method === 'POST') {
      const commentText = req.body?.comment || req.body?.content || '';
      if (!commentText.trim()) return res.status(400).json({ success: false, message: 'Comment content is required' });
      const newComment = {
        id: `c-${Date.now()}`,
        authorName: req.body?.authorName || 'উদ্যোক্তা',
        authorRole: req.body?.authorRole || 'ভিজিটর',
        comment: commentText.trim(),
        createdAt: new Date().toLocaleDateString('bn-BD'),
        likes: 0
      };

      if (MONGODB_URI) {
        let client: any = null;
        try {
          client = new MongoClient(MONGODB_URI, { connectTimeoutMS: 5000, serverSelectionTimeoutMS: 5000 });
          await client.connect();
          const db = client.db('uddokta_db');
          await db.collection('ideas').updateOne(filter, { $push: { comments: newComment } as any });
          await client.close().catch(() => {});
          return res.status(201).json({ success: true, data: newComment });
        } catch (err: any) {
          if (client) await client.close().catch(() => {});
        }
      }
      return res.status(201).json({ success: true, data: newComment });
    }
  }

  // --- STANDARD GET IDEAS LIST OR BY ID ---
  if (req.method === 'GET') {
    let mongoIdeas: any[] = [];
    let deletedIds: string[] = [];

    if (MONGODB_URI) {
      let client: any = null;
      try {
        client = new MongoClient(MONGODB_URI, { connectTimeoutMS: 5000, serverSelectionTimeoutMS: 5000 });
        await client.connect();
        const db = client.db('uddokta_db');

        // 1. Fetch deleted IDs
        const delDocs = await db.collection('deleted_ideas').find({}).toArray();
        deletedIds = delDocs.map((d: any) => String(d.id));

        // 2. Fetch active ideas
        const queryFilter: any = {};
        if (req.query?.status && req.query?.status !== 'all') {
          queryFilter.status = req.query.status;
        }

        const ideas = await db.collection('ideas').find(queryFilter).sort({ _id: -1 }).toArray();
        await client.close().catch(() => {});

        if (ideas && Array.isArray(ideas) && ideas.length > 0) {
          mongoIdeas = JSON.parse(JSON.stringify(ideas)).map((item: any) => ({
            ...item,
            _id: String(item._id || item.id || ''),
            id: String(item.id || item._id || ''),
            likes: typeof item.likes === 'number' ? item.likes : 0,
            dislikes: typeof item.dislikes === 'number' ? item.dislikes : 0,
            likedBy: Array.isArray(item.likedBy) ? item.likedBy : [],
            dislikedBy: Array.isArray(item.dislikedBy) ? item.dislikedBy : [],
            comments: Array.isArray(item.comments) ? item.comments : []
          }));
        }
      } catch (err: any) {
        if (client) await client.close().catch(() => {});
        console.error('MongoDB Atlas ideas fetch error:', err.message);
      }
    }

    const deletedSet = new Set(deletedIds);

    // Filter out deleted items from mongoIdeas
    const activeMongo = mongoIdeas.filter(
      (i) => !deletedSet.has(String(i.id)) && !deletedSet.has(String(i._id))
    );

    // Filter out deleted items from fallbackIdeas
    const mongoIds = new Set(activeMongo.map((i) => String(i.id)));
    const remainingFallback = fallbackIdeas.filter(
      (f) => !mongoIds.has(String(f.id)) && !deletedSet.has(String(f.id))
    );

    let combined = [...activeMongo, ...remainingFallback];

    // Filter by single id if requested
    if (rawId) {
      combined = combined.filter((i) => String(i.id) === String(rawId) || String(i._id) === String(rawId));
    }

    // Filter by status if requested
    const status = req.query?.status;
    if (status && status !== 'all') {
      combined = combined.filter((i) => (i.status || 'approved') === status);
    }

    // Filter by user if requested
    const userId = req.query?.userId;
    const authorEmail = req.query?.authorEmail;
    if (userId || authorEmail) {
      combined = combined.filter((i) => {
        const matchesUser = userId && (i.userId === userId || i.author?.id === userId);
        const matchesEmail = authorEmail && (i.authorEmail === authorEmail || i.postedBy?.email === authorEmail);
        return matchesUser || matchesEmail;
      });
    }

    return res.status(200).json({ success: true, count: combined.length, data: combined });
  }

  // --- STANDARD POST NEW IDEA ---
  if (req.method === 'POST') {
    try {
      const newIdea = {
        ...req.body,
        likes: typeof req.body?.likes === 'number' ? req.body.likes : 0,
        dislikes: typeof req.body?.dislikes === 'number' ? req.body.dislikes : 0,
        likedBy: Array.isArray(req.body?.likedBy) ? req.body.likedBy : [],
        dislikedBy: Array.isArray(req.body?.dislikedBy) ? req.body.dislikedBy : [],
        comments: Array.isArray(req.body?.comments) ? req.body.comments : [],
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
    if (!rawId) return res.status(400).json({ success: false, message: 'ID required' });

    if (MONGODB_URI) {
      let client: any = null;
      try {
        client = new MongoClient(MONGODB_URI, { connectTimeoutMS: 5000, serverSelectionTimeoutMS: 5000 });
        await client.connect();
        const db = client.db('uddokta_db');
        const filter = ObjectId.isValid(rawId) ? { _id: new ObjectId(rawId) } : { id: String(rawId) };
        const { _id, ...updateData } = req.body || {};
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
    if (!rawId) return res.status(400).json({ success: false, message: 'ID required' });

    if (MONGODB_URI) {
      let client: any = null;
      try {
        client = new MongoClient(MONGODB_URI, { connectTimeoutMS: 5000, serverSelectionTimeoutMS: 5000 });
        await client.connect();
        const db = client.db('uddokta_db');

        const filter = ObjectId.isValid(rawId) ? { _id: new ObjectId(rawId) } : { id: String(rawId) };
        await db.collection('ideas').deleteOne(filter);

        await db.collection('deleted_ideas').updateOne(
          { id: String(rawId) },
          { $set: { id: String(rawId), deletedAt: new Date().toISOString() } },
          { upsert: true }
        );

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
