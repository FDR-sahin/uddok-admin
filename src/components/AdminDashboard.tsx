import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  KeyRound, 
  PlusCircle, 
  BookOpen, 
  MapPin, 
  Trash2, 
  CheckCircle2, 
  LogOut, 
  Database,
  Tag,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { BlogPost, SourcingIdea } from '../types';

interface AdminDashboardProps {
  isAdmin: boolean;
  onLogin: (email: string, pass: string) => Promise<boolean>;
  onLogout: () => void;
  ideas: SourcingIdea[];
  blogs: BlogPost[];
  onAddIdea: (data: any) => Promise<void>;
  onDeleteIdea: (id: string) => Promise<void>;
  onAddBlog: (data: any) => Promise<void>;
  onDeleteBlog: (id: string) => Promise<void>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isAdmin,
  onLogin,
  onLogout,
  ideas,
  blogs,
  onAddIdea,
  onDeleteIdea,
  onAddBlog,
  onDeleteBlog
}) => {
  // Login form state
  const [email, setEmail] = useState('admin@uddokta.com');
  const [password, setPassword] = useState('password123');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Active sub-tab
  const [activeTab, setActiveTab] = useState<'idea' | 'blog' | 'manage'>('idea');

  // Business Idea form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('পোশাক');
  const [district, setDistrict] = useState('ঢাকা');
  const [exactLocation, setExactLocation] = useState('');
  const [wholesalePrice, setWholesalePrice] = useState<number | ''>('');
  const [retailPrice, setRetailPrice] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [ideaSubmitting, setIdeaSubmitting] = useState(false);

  // Blog form state
  const [blogTitle, setBlogTitle] = useState('');
  const [blogCategory, setBlogCategory] = useState('বাজেট প্ল্যানিং');
  const [blogExcerpt, setBlogExcerpt] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogSubmitting, setBlogSubmitting] = useState(false);

  const [notification, setNotification] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoggingIn(true);
    const success = await onLogin(email, password);
    setLoggingIn(false);
    if (!success) {
      setLoginError('ভুল ইমেইল বা পাসওয়ার্ড! (ডিফল্ট: admin@uddokta.com / password123)');
    }
  };

  const handleIdeaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !category || !district || !exactLocation || !wholesalePrice || !retailPrice) {
      alert('সবগুলো আবশ্যক ফিল্ড পূরণ করুন।');
      return;
    }

    setIdeaSubmitting(true);
    await onAddIdea({
      title,
      category,
      district,
      exactLocation,
      wholesalePrice: Number(wholesalePrice),
      retailPrice: Number(retailPrice),
      description: description || `${district} এলাকার পাইকারি সোর্সিং ও খুচরা বিক্রয় সুযোগ।`,
      unit: 'প্রতি পিস',
      moq: '১০ পিস',
      isVerified: true
    });
    setIdeaSubmitting(false);

    // Reset
    setTitle('');
    setExactLocation('');
    setWholesalePrice('');
    setRetailPrice('');
    setDescription('');
    setNotification('সফলভাবে নতুন বিজনেস আইডিয়া কার্ড পোস্ট করা হয়েছে!');
    setTimeout(() => setNotification(''), 4000);
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle || !blogCategory || !blogExcerpt || !blogContent) {
      alert('ব্লগের সব তথ্য পূরণ করুন।');
      return;
    }

    setBlogSubmitting(true);
    await onAddBlog({
      title: blogTitle,
      category: blogCategory,
      excerpt: blogExcerpt,
      content: blogContent,
      author: 'মোঃ দেলোয়ার হোসেন (মিথুন)',
      readTime: '৫ মিনিট'
    });
    setBlogSubmitting(false);

    // Reset
    setBlogTitle('');
    setBlogExcerpt('');
    setBlogContent('');
    setNotification('সফলভাবে নতুন উদ্যোক্তা ব্লগ পোস্ট করা হয়েছে!');
    setTimeout(() => setNotification(''), 4000);
  };

  // If Admin is not logged in: show clean Email & Password login
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center font-bold">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              অ্যাডমিন প্যানেলে লগইন
            </h2>
            <p className="text-xs text-slate-500">
              বিজনেস আইডিয়া ও ব্লগ পোস্ট করতে ইমেইল ও পাসওয়ার্ড দিন
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-600" />
                অ্যাডমিন ইমেইল
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@uddokta.com"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
                পাসওয়ার্ড
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password123"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
              />
            </div>

            {loginError && (
              <div className="p-2.5 rounded-lg bg-rose-50 text-rose-600 text-xs font-medium border border-rose-200">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-all cursor-pointer"
            >
              {loggingIn ? 'যাচাই করা হচ্ছে...' : 'লগইন করুন'}
            </button>
          </form>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 text-center">
            ডিফল্ট ডেমো লগইন: <strong>admin@uddokta.com</strong> / <strong>password123</strong>
          </div>
        </div>
      </div>
    );
  }

  // Once Logged In: Focused, Simple Admin Dashboard
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
      
      {/* Admin Header with MongoDB status & Logout */}
      <div className="bg-slate-900 text-white p-5 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h1 className="text-lg sm:text-xl font-extrabold">
              অ্যাডমিন ড্যাশবোর্ড (MongoDB Connected)
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            লগইন করা আছেন: <span className="text-emerald-300 font-mono">{email}</span>
          </p>
        </div>

        <button
          onClick={onLogout}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto"
        >
          <LogOut className="w-4 h-4 text-rose-400" />
          লগআউট
        </button>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div className="p-3.5 rounded-2xl bg-emerald-100 text-emerald-900 text-xs sm:text-sm font-semibold flex items-center gap-2 border border-emerald-300 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab('idea')}
          className={`py-2.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'idea'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          ১. বিজনেস আইডিয়া কার্ড পোস্ট
        </button>

        <button
          onClick={() => setActiveTab('blog')}
          className={`py-2.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'blog'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          ২. নতুন ব্লগ পোস্ট
        </button>

        <button
          onClick={() => setActiveTab('manage')}
          className={`py-2.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'manage'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          ৩. পোস্ট ম্যানেজ ({ideas.length} আইডিয়া | {blogs.length} ব্লগ)
        </button>
      </div>

      {/* TAB 1: Business Idea Card Post */}
      {activeTab === 'idea' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-8 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              নতুন বিজনেস আইডিয়া কার্ড আপলোড করুন
            </h2>
            <p className="text-xs text-slate-500">
              এখানে তথ্য দিলে সরাসরি ওয়েবসাইটে কার্ড হিসেবে দেখাবে এবং ক্লিক করলে ছবির মতো ম্যাপ ও ডিটেইল পেজ ওপেন হবে।
            </p>
          </div>

          <form onSubmit={handleIdeaSubmit} className="space-y-4 text-xs sm:text-sm">
            
            {/* Title */}
            <div className="space-y-1">
              <label className="font-bold text-slate-800">
                কার্ডের শিরোনাম (Title) *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="যেমন: Savar-এ MILK পাইকারি সোর্সিং"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
              />
            </div>

            {/* Category & District */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-800">
                  ক্যাটাগরি (Category) *
                </label>
                <input
                  type="text"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="যেমন: খাবার ও দুগ্ধ, পোশাক (Cloth), ইত্যাদি"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">
                  জেলা (Jela / District) *
                </label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="যেমন: ঢাকা, বগুড়া, নরসিংদী"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            {/* Exact Location */}
            <div className="space-y-1">
              <label className="font-bold text-slate-800">
                নির্দিষ্ট সোর্সিং ঠিকানা বা বাজার (Exact Location) *
              </label>
              <input
                type="text"
                required
                value={exactLocation}
                onChange={(e) => setExactLocation(e.target.value)}
                placeholder="যেমন: সাভার পৌরসভা রোড, বংশী নদীর ঘাট সংলগ্ন দুগ্ধ আড়ত, সাভার, ঢাকা"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
              />
            </div>

            {/* Wholesale Price & Retail Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-800">
                  পাইকারি দাম (Pikari Price / ৳) *
                </label>
                <input
                  type="number"
                  required
                  value={wholesalePrice}
                  onChange={(e) => setWholesalePrice(e.target.value ? Number(e.target.value) : '')}
                  placeholder="৬৫"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">
                  খুচরা বিক্রয়মূল্য (Retail / Khusra Price / ৳) *
                </label>
                <input
                  type="number"
                  required
                  value={retailPrice}
                  onChange={(e) => setRetailPrice(e.target.value ? Number(e.target.value) : '')}
                  placeholder="১০০"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="font-bold text-slate-800">
                বিস্তারিত বিবরণ (Description / সোর্সিং গাইড)
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="পণ্য সোর্সিং করার নিয়ম, কোথায় মিলবে, কোয়ালিটি কেমন..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={ideaSubmitting}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-all cursor-pointer"
            >
              {ideaSubmitting ? 'সেভ হচ্ছে...' : 'কার্ডটি পোস্ট করুন'}
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: Blog Post */}
      {activeTab === 'blog' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-8 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              নতুন উদ্যোক্তা ব্লগ পোস্ট করুন
            </h2>
            <p className="text-xs text-slate-500">
              ব্লগের শিরোনাম ও বিস্তারিত বিবরণ লিখে পোস্ট করুন।
            </p>
          </div>

          <form onSubmit={handleBlogSubmit} className="space-y-4 text-xs sm:text-sm">
            <div className="space-y-1">
              <label className="font-bold text-slate-800">
                ব্লগের শিরোনাম (Blog Title) *
              </label>
              <input
                type="text"
                required
                value={blogTitle}
                onChange={(e) => setBlogTitle(e.target.value)}
                placeholder="যেমন: ৫,০০০ টাকার মধ্যে ব্যবসা শুরু করার পরিকল্পনা"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-800">
                ক্যাটাগরি
              </label>
              <input
                type="text"
                required
                value={blogCategory}
                onChange={(e) => setBlogCategory(e.target.value)}
                placeholder="যেমন: বাজেট প্ল্যানিং, কস্টিং, সোর্সিং"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-800">
                সংক্ষিপ্ত সারসংক্ষেপ (Excerpt) *
              </label>
              <textarea
                rows={2}
                required
                value={blogExcerpt}
                onChange={(e) => setBlogExcerpt(e.target.value)}
                placeholder="কার্ডে দেখানোর মতো ২-৩ লাইনের সংক্ষিপ্ত বক্তব্য..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-800">
                সম্পূর্ণ বিস্তারিত বিবরণ (Full Content) *
              </label>
              <textarea
                rows={6}
                required
                value={blogContent}
                onChange={(e) => setBlogContent(e.target.value)}
                placeholder="ব্লগের বিস্তারিত লেখা, পয়েন্ট ও নিয়মাবলী..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={blogSubmitting}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-all cursor-pointer"
            >
              {blogSubmitting ? 'সেভ হচ্ছে...' : 'ব্লগটি পোস্ট করুন'}
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: Manage Posts */}
      {activeTab === 'manage' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-8 shadow-xs space-y-6">
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-3">
              বিদ্যমান বিজনেস আইডিয়া কার্ডসমূহ ({ideas.length}টি)
            </h3>
            <div className="space-y-2">
              {ideas.map((item: any) => {
                const id = item.id || item._id;
                return (
                  <div key={id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{item.title}</p>
                      <p className="text-slate-500">{item.district} | পাইকারি: ৳{item.wholesalePrice} | বিক্রয়: ৳{item.retailPrice}</p>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm('এই আইডিয়াটি ডিলিট করতে চান?')) onDeleteIdea(id);
                      }}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-slate-200 pt-5">
            <h3 className="font-bold text-slate-900 text-sm mb-3">
              বিদ্যমান ব্লগসমূহ ({blogs.length}টি)
            </h3>
            <div className="space-y-2">
              {blogs.map((b: any) => {
                const id = b.id || b._id;
                return (
                  <div key={id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-800">{b.title}</p>
                      <p className="text-slate-500">{b.category}</p>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm('এই ব্লগটি ডিলিট করতে চান?')) onDeleteBlog(id);
                      }}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
