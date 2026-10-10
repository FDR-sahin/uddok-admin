export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const ideas = [
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

  if (req.method === 'GET') {
    return res.status(200).json({ success: true, count: ideas.length, data: ideas });
  }

  if (req.method === 'POST') {
    const newIdea = {
      ...req.body,
      id: `sourcing-${Date.now()}`,
      createdAt: new Date().toLocaleDateString('bn-BD')
    };
    ideas.unshift(newIdea);
    return res.status(201).json({ success: true, data: newIdea });
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
