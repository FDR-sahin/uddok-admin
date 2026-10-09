export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
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
