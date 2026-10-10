import { initialBlogPosts } from './data/blogsData';

export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ success: true, count: initialBlogPosts.length, data: initialBlogPosts });
  }

  if (req.method === 'POST') {
    const newBlog = {
      ...req.body,
      id: `blog-${Date.now()}`,
      createdAt: new Date().toLocaleDateString('bn-BD')
    };
    initialBlogPosts.unshift(newBlog);
    return res.status(201).json({ success: true, data: newBlog });
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
