# আপনার ওয়েবসাইটের সাথে API কানেক্ট করার পূর্ণাঙ্গ গাইড (API Connection Guide)

এই ফাইলে দেখানো হয়েছে কীভাবে আপনার নিজস্ব ফ্রন্টএন্ড ওয়েবসাইট থেকে এই অ্যাডমিন প্যানেল ও Express/MongoDB ব্যাকএন্ডের সাথে যুক্ত হয়ে **বিজনেস আইডিয়া কার্ড** এবং **ব্লগসমূহ** সরাসরি প্রদর্শন করবেন।

---

## ১. বেস ইউআরএল (Base URL)
- লোকাল ডেভেলপমেন্ট: `http://localhost:3000`
- লাইভ সার্ভার: `https://your-domain.com`

---

## ২. প্রয়োজনীয় দুটি প্রধান এপিআই (The 2 Core APIs)

| ফিচার | মেথড | এন্ডপয়েন্ট | কাজ |
|---|---|---|---|
| **বিজনেস আইডিয়া কার্ড** | `GET` | `/api/ideas` | অ্যাডমিন প্যানেলে পোস্ট করা সব কার্ডের তথ্য নিয়ে আসা |
| **ব্লগসমূহ** | `GET` | `/api/blogs` | অ্যাডমিন প্যানেলে পোস্ট করা সব ব্লগের তথ্য নিয়ে আসা |

---

## ৩. আপনার ওয়েবসাইটে বিজনেস আইডিয়া কার্ড কানেক্ট করার কোড (React / JavaScript)

### ৩.১ ডেটা ফেচ (Fetch Data) করার কোড:
```javascript
// আপনার ওয়েবসাইটে বিজনেস আইডিয়া কার্ডগুলো লোড করতে:
async function loadBusinessIdeas() {
  try {
    const response = await fetch('http://localhost:3000/api/ideas');
    const result = await response.json();
    
    if (result.success) {
      console.log('সকল বিজনেস আইডিয়া:', result.data);
      // result.data এর মধ্যে প্রতিটি কার্ডের তথ্য রয়েছে:
      // item.title (শিরোনাম)
      // item.category (ক্যাটাগরি: cloth, food, etc.)
      // item.district (জেলা)
      // item.exactLocation (নির্দিষ্ট সোর্সিং ঠিকানা)
      // item.wholesalePrice (পাইকারি দাম)
      // item.retailPrice (খুচরা দাম)
      // item.description (বিবরণ)
      return result.data;
    }
  } catch (error) {
    console.error('API Error:', error);
  }
}
```

### ৩.২ কার্ড রেন্ডার ও ক্লিকে ম্যাপ সহ ডিটেইল পেজ দেখানোর কোড:
```jsx
import React, { useState, useEffect } from 'react';

export default function BusinessIdeaSection() {
  const [ideas, setIdeas] = useState([]);
  const [selectedIdea, setSelectedIdea] = useState(null);

  useEffect(() => {
    fetch('/api/ideas')
      .then(res => res.json())
      .then(data => {
        if (data.success) setIdeas(data.data);
      });
  }, []);

  // যদি কোনো কার্ডে ক্লিক করা হয়, ডিটেইল পেজ ও ম্যাপ দেখাবে
  if (selectedIdea) {
    const profit = selectedIdea.retailPrice - selectedIdea.wholesalePrice;
    const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(selectedIdea.exactLocation)}&hl=bn&z=14&output=embed`;
    const openGoogleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedIdea.exactLocation)}`;

    return (
      <div className="idea-detail-page">
        <button onClick={() => setSelectedIdea(null)}>← পেছনে যান</button>
        
        {/* ব্রেডক্রাম্ব ও শিরোনাম */}
        <p>হোম &gt; {selectedIdea.district} &gt; {selectedIdea.title}</p>
        <h1>{selectedIdea.title}</h1>
        <span>ক্যাটাগরি: {selectedIdea.category}</span> | <span>জেলা: {selectedIdea.district}</span>

        {/* দাম ও লাভ ৩টি বক্স */}
        <div style={{ display: 'flex', gap: '15px', margin: '20px 0' }}>
          <div className="box">
            <h4>পাইকারি দাম</h4>
            <h2>৳ {selectedIdea.wholesalePrice}</h2>
          </div>
          <div className="box">
            <h4>খুচরা দাম</h4>
            <h2>৳ {selectedIdea.retailPrice}</h2>
          </div>
          <div className="box">
            <h4>প্রফিট / লাভ</h4>
            <h2 style={{ color: 'green' }}>৳ {profit}</h2>
          </div>
        </div>

        {/* নির্দিষ্ট ঠিকানা ও গুগল ম্যাপ */}
        <div className="location-box">
          <p><strong>নির্দিষ্ট সোর্সিং ঠিকানা:</strong> {selectedIdea.exactLocation}</p>
          <a href={openGoogleMapsUrl} target="_blank" rel="noreferrer">গুগল ম্যাপে দেখুন</a>
        </div>

        {/* গুগল ম্যাপ আইফ্রেম */}
        <iframe 
          title="Google Map"
          src={mapUrl}
          width="100%" 
          height="350" 
          style={{ border: 0, borderRadius: '12px' }}
        />

        {/* বিবরণ */}
        <div className="description">
          <h3>বিবরণ</h3>
          <p>{selectedIdea.description}</p>
        </div>
      </div>
    );
  }

  // কার্ড লিস্ট
  return (
    <div className="idea-cards-grid">
      {ideas.map((item) => (
        <div 
          key={item._id || item.id} 
          onClick={() => setSelectedIdea(item)} 
          style={{ border: '1px solid #ddd', padding: '15px', cursor: 'pointer', borderRadius: '12px' }}
        >
          <span className="badge">{item.category}</span>
          <h3>{item.title}</h3>
          <p>জেলা: {item.district}</p>
          <p>ঠিকানা: {item.exactLocation}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>পাইকারি: ৳{item.wholesalePrice}</span>
            <span>খুচরা: ৳{item.retailPrice}</span>
            <span style={{ color: 'green', fontWeight: 'bold' }}>
              লাভ: ৳{item.retailPrice - item.wholesalePrice}
            </span>
          </div>
          <p style={{ color: '#059669', marginTop: '10px' }}>ম্যাপ ও বিস্তারিত দেখুন →</p>
        </div>
      ))}
    </div>
  );
}
```

---

## ৪. আপনার ওয়েবসাইটে ব্লগ কার্ড কানেক্ট করার কোড (React / JavaScript)

### ৪.১ ব্লগ ডেটা ফেচ ও ক্লিকে বিস্তারিত দেখানোর কোড:
```jsx
import React, { useState, useEffect } from 'react';

export default function BlogSection() {
  const [blogs, setBlogs] = useState([]);
  const [activeBlog, setActiveBlog] = useState(null);

  useEffect(() => {
    fetch('/api/blogs')
      .then(res => res.json())
      .then(data => {
        if (data.success) setBlogs(data.data);
      });
  }, []);

  // ব্লগ কার্ডে ক্লিক করলে সম্পূর্ণ বিবরণ দেখাবে
  if (activeBlog) {
    return (
      <div className="blog-details">
        <button onClick={() => setActiveBlog(null)}>← সব ব্লগে ফিরে যান</button>
        <span className="cat-badge">{activeBlog.category}</span>
        <h1>{activeBlog.title}</h1>
        <p><em>"{activeBlog.excerpt}"</em></p>
        <hr />
        <div className="blog-content" style={{ whiteSpace: 'pre-line' }}>
          {activeBlog.content}
        </div>
      </div>
    );
  }

  // ব্লগের কার্ডসমূহ
  return (
    <div className="blog-grid">
      {blogs.map(blog => (
        <div 
          key={blog._id || blog.id}
          onClick={() => setActiveBlog(blog)}
          style={{ border: '1px solid #e2e8f0', padding: '16px', borderRadius: '12px', cursor: 'pointer' }}
        >
          <span className="badge">{blog.category}</span>
          <h3>{blog.title}</h3>
          <p>{blog.excerpt}</p>
          <span style={{ color: '#059669', fontWeight: 'bold' }}>বিস্তারিত পড়ুন →</span>
        </div>
      ))}
    </div>
  );
}
```

---

## ৫. cURL কমান্ড টেস্ট করার জন্য (Testing via Terminal)

### বিজনেস আইডিয়া পেতে:
```bash
curl http://localhost:3000/api/ideas
```

### ব্লগসমূহ পেতে:
```bash
curl http://localhost:3000/api/blogs
```
