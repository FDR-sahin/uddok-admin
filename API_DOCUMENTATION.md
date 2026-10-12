# উদ্যোগ বন্ধু (Uddokta Bondhu) - Backend & MongoDB API Documentation

এই ফাইলে আপনার Express ব্যাকএন্ড এবং MongoDB ডাটাবেজের সাথে ফ্রন্টএন্ড কানেক্ট করার জন্য প্রয়োজনীয় সকল API এন্ডপয়েন্ট দেওয়া হলো।

---

## ১. এনভায়রনমেন্ট ভেরিয়েবল (.env)
আপনার সার্ভারে MongoDB ও অ্যাডমিন কানেক্ট করার জন্য `.env` ফাইলে নিচের ভেরিয়েবলগুলো সেট করুন:
```env
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/uddokta_db?retryWrites=true&w=majority
ADMIN_EMAIL=regardstech.team@gmail.com
ADMIN_PASSWORD=<set-a-strong-unique-password>
```

---

## ২. এপিআই এন্ডপয়েন্টসমূহ (API Endpoints)

| মেথড | এন্ডপয়েন্ট | বিবরণ | অনুমোদন (Auth) |
|---|---|---|---|
| `POST` | `/api/admin/login` | অ্যাডমিন লগইন (ইমেইল ও পাসওয়ার্ড) | Public |
| `GET` | `/api/ideas` | সকল বিজনেস আইডিয়া ও সোর্সিং কার্ডের তালিকা | Public |
| `POST` | `/api/ideas` | নতুন বিজনেস আইডিয়া কার্ড পোস্ট করা | Admin |
| `DELETE` | `/api/ideas/:id` | নির্দিষ্ট বিজনেস আইডিয়া ডিলিট করা | Admin |
| `POST` | `/api/ideas/:id/comments` | সোর্সিং কার্ডে মন্তব্য করা | Public |
| `GET` | `/api/blogs` | সকল ব্লগের তালিকা | Public |
| `POST` | `/api/blogs` | নতুন ব্লগ পোস্ট করা | Admin |
| `DELETE` | `/api/blogs/:id` | নির্দিষ্ট ব্লগ ডিলিট করা | Admin |
| `GET` | `/api/health` | ডাটাবেজ কানেকশন স্ট্যাটাস | Public |

---

## ৩. রিকোয়েস্ট ও রেসপন্স উদাহরণ (Payload Examples)

### ৩.১ অ্যাডমিন লগইন (POST `/api/admin/login`)
**Request Body:**
```json
{
  "email": "admin@uddokta.com",
  "password": "<your ADMIN_PASSWORD>"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "admin": { "email": "admin@uddokta.com" }
}
```

---

### ৩.২ নতুন বিজনেস আইডিয়া কার্ড পোস্ট (POST `/api/ideas`)
অ্যাডমিন এই ফিল্ডগুলো ইনপুট দিয়ে পোস্ট করবেন:
- `title` (শিরোনাম)
- `category` (ক্যাটাগরি: cloth, food, agro, etc.)
- `district` (জেলা: যেমন ঢাকা, সাভার)
- `exactLocation` (নির্দিষ্ট সোর্সিং ঠিকানা/বাজার)
- `wholesalePrice` (পাইকারি দাম / সংখ্যা)
- `retailPrice` (খুচরা বিক্রয়মূল্য / সংখ্যা)
- `description` (বিস্তারিত বিবরণ)

**Request Body:**
```json
{
  "title": "Savar-এ MILK পাইকারি সোর্সিং",
  "category": "খাবার ও দুগ্ধ",
  "district": "ঢাকা",
  "exactLocation": "সাভার পৌরসভা রোড, বংশী নদীর ঘাট সংলগ্ন দুগ্ধ আড়ত, সাভার, ঢাকা",
  "wholesalePrice": 65,
  "retailPrice": 100,
  "description": "সাভার MILK পাইকারি সোর্সিং: লোকাল দুগ্ধ খামারিদের নিয়মিত পাইকারি রেট...",
  "unit": "প্রতি লিটার",
  "moq": "২০ লিটার"
}
```

**কার্ডে ক্লিক করলে:** ইউজার সরাসরি গুগল ম্যাপ, পাইকারি ও খুচরা দাম, লাভ ও বিবরণ দেখতে পাবেন।

---

### ৩.৩ নতুন ব্লগ পোস্ট (POST `/api/blogs`)
**Request Body:**
```json
{
  "title": "৫,০০০ টাকার মধ্যে ব্যবসা শুরু করার পরিকল্পনা",
  "category": "বাজেট প্ল্যানিং",
  "excerpt": "মাত্র ৫,০০০ টাকা দিয়ে মাইক্রো-ইনভেন্টরি শুরু করার পরিকল্পনা...",
  "content": "বিস্তারিত নিয়ম ও নির্দেশিকা...",
  "author": "মোঃ দেলোয়ার হোসেন (মিথুন)",
  "readTime": "৫ মিনিট"
}
```
**কার্ডে ক্লিক করলে:** ব্লগের সম্পূর্ণ বিবরণ ও পরামর্শ ওপেন হবে।
