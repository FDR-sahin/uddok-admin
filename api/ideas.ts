import initialSourcingIdeas from '../src/data/sourcingData.json';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ success: true, count: initialSourcingIdeas.length, data: initialSourcingIdeas });
  }

  if (req.method === 'POST') {
    const { title, category, district, exactLocation, wholesalePrice, retailPrice } = req.body || {};
    if (!title || !category || !district || !exactLocation || !wholesalePrice || !retailPrice) {
      return res.status(400).json({ success: false, message: 'All required fields must be provided' });
    }

    const newIdea = {
      id: `sourcing-${Date.now()}`,
      title,
      category,
      district,
      exactLocation,
      wholesalePrice: Number(wholesalePrice),
      retailPrice: Number(retailPrice),
      unit: req.body.unit || 'প্রতি পিস',
      moq: req.body.moq || '১০ পিস',
      description: req.body.description || '',
      supplierTip: req.body.supplierTip || '',
      coordinates: req.body.coordinates || { lat: 23.8583, lng: 90.2667 },
      isVerified: true,
      likes: 0,
      dislikes: 0,
      comments: [],
      createdAt: new Date().toLocaleDateString('bn-BD')
    };

    return res.status(201).json({ success: true, data: newIdea });
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
