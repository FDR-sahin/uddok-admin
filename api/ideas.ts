import { initialSourcingIdeas } from './data/ideasData';

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
    const newIdea = {
      ...req.body,
      id: `sourcing-${Date.now()}`,
      createdAt: new Date().toLocaleDateString('bn-BD')
    };
    return res.status(201).json({ success: true, data: newIdea });
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
