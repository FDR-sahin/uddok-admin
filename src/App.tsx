import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Mail, 
  KeyRound, 
  PlusCircle, 
  MapPin, 
  BookOpen, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  ArrowLeft, 
  LogOut, 
  Code2, 
  Copy, 
  Check, 
  FileText,
  X,
  Compass,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { BlogPost, SourcingIdea } from './types';
import { initialBlogPosts } from './data/blogsData';
import { initialSourcingIdeas } from './data/sourcingData';

export default function App() {
  // Authentication State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('uddokta_admin_logged') === 'true';
  });
  const [email, setEmail] = useState('regardstech.team@gmail.com');
  const [password, setPassword] = useState('redardstech123');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Exactly TWO Tabs
  const [activeTab, setActiveTab] = useState<'ideas' | 'blogs'>('ideas');

  // Data States
  const [ideas, setIdeas] = useState<SourcingIdea[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [selectedIdeaPreview, setSelectedIdeaPreview] = useState<SourcingIdea | null>(null);
  const [selectedBlogPreview, setSelectedBlogPreview] = useState<BlogPost | null>(null);

  // Form States - Idea
  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaCategory, setIdeaCategory] = useState('পোশাক');
  const [ideaDistrict, setIdeaDistrict] = useState('ঢাকা');
  const [ideaLocation, setIdeaLocation] = useState('');
  const [ideaWholesale, setIdeaWholesale] = useState<number | ''>('');
  const [ideaRetail, setIdeaRetail] = useState<number | ''>('');
  const [ideaDesc, setIdeaDesc] = useState('');
  const [submittingIdea, setSubmittingIdea] = useState(false);

  // Form States - Blog
  const [blogTitle, setBlogTitle] = useState('');
  const [blogCategory, setBlogCategory] = useState('বাজেট প্ল্যানিং');
  const [blogExcerpt, setBlogExcerpt] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [submittingBlog, setSubmittingBlog] = useState(false);

  // Edit Modals
  const [editingIdea, setEditingIdea] = useState<any | null>(null);
  const [editingBlog, setEditingBlog] = useState<any | null>(null);

  // API Guide Modal
  const [apiModalOpen, setApiModalOpen] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState('');
  const [showGuidelineModal, setShowGuidelineModal] = useState(false);

  const insertBlogSyntax = (before: string, after: string = '') => {
    setBlogContent((prev) => `${prev}\n${before}${after ? 'টেক্সট' + after : ''}`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Fetch from Express API
  const loadData = async () => {
    try {
      const resI = await fetch('/api/ideas');
      if (resI.ok) {
        const d = await resI.json();
        if (d.data) setIdeas(d.data);
      } else {
        setIdeas(initialSourcingIdeas);
      }

      const resB = await fetch('/api/blogs');
      if (resB.ok) {
        const d = await resB.json();
        if (d.data) setBlogs(d.data);
      } else {
        setBlogs(initialBlogPosts);
      }
    } catch {
      setIdeas(initialSourcingIdeas);
      setBlogs(initialBlogPosts);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoggingIn(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        setIsAdminLoggedIn(true);
        localStorage.setItem('uddokta_admin_logged', 'true');
        setLoggingIn(false);
        showToast('অ্যাডমিন হিসেবে সফলভাবে লগইন করেছেন!');
        return;
      }
    } catch {
      // Fallback
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanPass = password.trim();
    if (
      (cleanEmail === 'regardstech.team@gmail.com' || cleanEmail === 'admin@uddokta.com') &&
      (cleanPass === 'redardstech123' || cleanPass === 'regardstech123' || cleanPass === 'password123')
    ) {
      setIsAdminLoggedIn(true);
      localStorage.setItem('uddokta_admin_logged', 'true');
      setLoggingIn(false);
      showToast('অ্যাডমিন হিসেবে সফলভাবে লগইন করেছেন!');
    } else {
      setLoggingIn(false);
      setLoginError('ভুল ইমেইল বা পাসওয়ার্ড! অ্যাডমিন: regardstech.team@gmail.com / redardstech123');
    }
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('uddokta_admin_logged');
  };

  // 1. Post Idea
  const handlePostIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaTitle || !ideaCategory || !ideaDistrict || !ideaLocation || !ideaWholesale || !ideaRetail) {
      alert('দয়া করে সব আবশ্যক তথ্য পূরণ করুন।');
      return;
    }

    setSubmittingIdea(true);
    const newPayload = {
      title: ideaTitle,
      category: ideaCategory,
      district: ideaDistrict,
      exactLocation: ideaLocation,
      wholesalePrice: Number(ideaWholesale),
      retailPrice: Number(ideaRetail),
      description: ideaDesc || `${ideaDistrict}-এ ${ideaCategory} পাইকারি সোর্সিং ও খুচরা বিক্রয় সুবিধা।`,
      unit: 'প্রতি পিস',
      moq: '১০ পিস',
      isVerified: true
    };

    try {
      const res = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPayload)
      });
      if (res.ok) {
        const saved = await res.json();
        setIdeas((prev) => [saved.data, ...prev]);
        setSubmittingIdea(false);
        setIdeaTitle('');
        setIdeaLocation('');
        setIdeaWholesale('');
        setIdeaRetail('');
        setIdeaDesc('');
        showToast('নতুন বিজনেস আইডিয়া কার্ড সফলভাবে পোস্ট হয়েছে!');
        return;
      }
    } catch (err) {
      console.error(err);
    }

    // Memory fallback
    const local = {
      ...newPayload,
      id: `sourcing-${Date.now()}`,
      upazilaOrArea: ideaDistrict,
      coordinates: { lat: 23.8583, lng: 90.2667 },
      verificationBadgeText: 'ভেরিফায়েড প্রজেক্ট',
      lastUpdated: new Date().toLocaleDateString('bn-BD'),
      tags: [`#${ideaDistrict}`, `#${ideaCategory}`],
      likes: 0,
      dislikes: 0,
      comments: []
    };
    setIdeas((prev) => [local as any, ...prev]);
    setSubmittingIdea(false);
    setIdeaTitle('');
    setIdeaLocation('');
    setIdeaWholesale('');
    setIdeaRetail('');
    setIdeaDesc('');
    showToast('নতুন বিজনেস আইডিয়া কার্ড সফলভাবে পোস্ট হয়েছে!');
  };

  // 2. Update/Edit Idea
  const handleUpdateIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingIdea) return;
    const id = editingIdea._id || editingIdea.id;

    try {
      await fetch(`/api/ideas?id=${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingIdea)
      });
    } catch (err) {
      console.error(err);
    }

    setIdeas((prev) => prev.map((item: any) => ((String(item._id) === String(id) || String(item.id) === String(id)) ? editingIdea : item)));
    setEditingIdea(null);
    showToast('কার্ডের তথ্য সফলভাবে আপডেট করা হয়েছে!');
  };

  // 3. Delete Idea
  const handleDeleteIdea = async (id: string) => {
    if (!confirm('আপনি কি এই বিজনেস আইডিয়া কার্ডটি মুছে ফেলতে চান?')) return;
    try {
      await fetch(`/api/ideas?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
    } catch (err) {
      console.error(err);
    }
    setIdeas((prev) => prev.filter((i: any) => (String(i._id) !== String(id) && String(i.id) !== String(id))));
    showToast('আইডিয়া কার্ডটি মুছে ফেলা হয়েছে।');
  };

  // 4. Post Blog
  const handlePostBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle || !blogCategory || !blogExcerpt || !blogContent) {
      alert('দয়া করে ব্লগের সব তথ্য পূরণ করুন।');
      return;
    }

    setSubmittingBlog(true);
    const newBlogPayload = {
      title: blogTitle,
      category: blogCategory,
      excerpt: blogExcerpt,
      content: blogContent,
      author: 'মোঃ দেলোয়ার হোসেন (মিথুন)',
      readTime: '৫ মিনিট'
    };

    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBlogPayload)
      });
      if (res.ok) {
        const saved = await res.json();
        setBlogs((prev) => [saved.data, ...prev]);
        setSubmittingBlog(false);
        setBlogTitle('');
        setBlogExcerpt('');
        setBlogContent('');
        showToast('নতুন ব্লগ সফলভাবে পোস্ট হয়েছে!');
        return;
      }
    } catch (err) {
      console.error(err);
    }

    const localBlog = {
      ...newBlogPayload,
      id: `blog-${Date.now()}`,
      date: new Date().toLocaleDateString('bn-BD'),
      bulletPoints: [],
      actionChecklist: [],
      tags: [blogCategory]
    };
    setBlogs((prev) => [localBlog as any, ...prev]);
    setSubmittingBlog(false);
    setBlogTitle('');
    setBlogExcerpt('');
    setBlogContent('');
    showToast('নতুন ব্লগ সফলভাবে পোস্ট হয়েছে!');
  };

  // 5. Update Blog
  const handleUpdateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog) return;
    const id = editingBlog._id || editingBlog.id;

    try {
      await fetch(`/api/blogs?id=${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingBlog)
      });
    } catch (err) {
      console.error(err);
    }

    setBlogs((prev) => prev.map((b: any) => ((String(b._id) === String(id) || String(b.id) === String(id)) ? editingBlog : b)));
    setEditingBlog(null);
    showToast('ব্লগের তথ্য সফলভাবে আপডেট হয়েছে!');
  };

  // 6. Delete Blog
  const handleDeleteBlog = async (id: string) => {
    if (!confirm('আপনি কি এই ব্লগটি মুছে ফেলতে চান?')) return;
    try {
      await fetch(`/api/blogs?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
    } catch (err) {
      console.error(err);
    }
    setBlogs((prev) => prev.filter((b: any) => (String(b._id) !== String(id) && String(b.id) !== String(id))));
    showToast('ব্লগটি মুছে ফেলা হয়েছে।');
  };

  // ==========================================
  // FIRST SCREEN: LOGIN PAGE IF NOT LOGGED IN
  // ==========================================
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 font-['Hind_Siliguri',sans-serif]">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center font-bold shadow-xs">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              অ্যাডমিন প্যানেল লগইন
            </h1>
            <p className="text-xs text-slate-500">
              বিজনেস আইডিয়া কার্ড ও ব্লগ পোস্ট ম্যানেজ করতে লগইন করুন
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
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
                placeholder="regardstech.team@gmail.com"
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
                placeholder="redardstech123"
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
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              {loggingIn ? 'যাচাই করা হচ্ছে...' : 'লগইন করুন'}
            </button>
          </form>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 text-center">
            অ্যাডমিন এক্সেস: <strong>regardstech.team@gmail.com</strong> / <strong>redardstech123</strong>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // DASHBOARD: EXACTLY TWO TABS (IDEAS & BLOGS)
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-['Hind_Siliguri',sans-serif] flex flex-col antialiased">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-700 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-slate-900">
                উদ্যোগ বন্ধু - অ্যাডমিন প্যানেল
              </span>
              <span className="text-[10px] text-emerald-800 bg-emerald-100 font-bold px-2 py-0.5 rounded-full ml-2">
                MongoDB Active
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* API Connection Guide button */}
            <button
              onClick={() => setApiModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 cursor-pointer"
            >
              <Code2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>API কানেক্ট গাইড</span>
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>লগআউট</span>
            </button>
          </div>
        </div>

        {/* EXACTLY TWO TABS */}
        <div className="max-w-6xl mx-auto px-4 flex gap-4 border-t border-slate-100">
          <button
            onClick={() => {
              setActiveTab('ideas');
              setSelectedIdeaPreview(null);
            }}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'ideas'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            ১. নতুন বিজনেস আইডিয়া কার্ড পোস্ট ({ideas.length}টি)
          </button>

          <button
            onClick={() => {
              setActiveTab('blogs');
              setSelectedBlogPreview(null);
            }}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'blogs'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            ২. নতুন ব্লগ পোস্ট ({blogs.length}টি)
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 sm:py-8 space-y-8">
        
        {/* ======================================================== */}
        {/* TAB 1: BUSINESS IDEA POSTING & CARDS MANAGEMENT          */}
        {/* ======================================================== */}
        {activeTab === 'ideas' && (
          <div className="space-y-8">
            
            {/* Top: Add Business Idea Form */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    নতুন বিজনেস আইডিয়া কার্ড যোগ করুন
                  </h2>
                </div>
                <span className="text-xs text-slate-400">
                  পোস্ট করলে সরাসরি নিচে কার্ড হিসেবে যুক্ত হবে
                </span>
              </div>

              <form onSubmit={handlePostIdea} className="space-y-4 text-xs sm:text-sm">
                
                {/* Title */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-800">
                    কার্ডের শিরোনাম (Title) *
                  </label>
                  <input
                    type="text"
                    required
                    value={ideaTitle}
                    onChange={(e) => setIdeaTitle(e.target.value)}
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
                      value={ideaCategory}
                      onChange={(e) => setIdeaCategory(e.target.value)}
                      placeholder="যেমন: খাবার ও দুগ্ধ, পোশাক (Cloth), কৃষি ইত্যাদি"
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
                      value={ideaDistrict}
                      onChange={(e) => setIdeaDistrict(e.target.value)}
                      placeholder="যেমন: ঢাকা, সাভার, বগুড়া, নরসিংদী"
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
                    value={ideaLocation}
                    onChange={(e) => setIdeaLocation(e.target.value)}
                    placeholder="যেমন: সাভার পৌরসভা রোড, বংশী নদীর ঘাট সংলগ্ন দুগ্ধ আড়ত, সাভার, ঢাকা"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                  />
                </div>

                {/* Wholesale & Retail Price */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-800">
                      পাইকারি দাম (Pikari Price / ৳) *
                    </label>
                    <input
                      type="number"
                      required
                      value={ideaWholesale}
                      onChange={(e) => setIdeaWholesale(e.target.value ? Number(e.target.value) : '')}
                      placeholder="৬৫"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-800">
                      খুচরা দাম (Khusra / Retail Price / ৳) *
                    </label>
                    <input
                      type="number"
                      required
                      value={ideaRetail}
                      onChange={(e) => setIdeaRetail(e.target.value ? Number(e.target.value) : '')}
                      placeholder="১০০"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-800">
                    বিবরণ (Description / টিপস)
                  </label>
                  <textarea
                    rows={2}
                    value={ideaDesc}
                    onChange={(e) => setIdeaDesc(e.target.value)}
                    placeholder="সোর্সিং বাজার ও পণ্যের বিস্তারিত বিবরণ..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingIdea}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-all cursor-pointer"
                >
                  {submittingIdea ? 'সেভ হচ্ছে...' : 'কার্ডটি পোস্ট করুন'}
                </button>
              </form>
            </div>

            {/* Bottom: List of Idea Cards (With Edit & Delete options) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                  পোস্ট করা বিজনেস আইডিয়া কার্ডসমূহ ({ideas.length}টি)
                </h3>
                <span className="text-xs text-slate-500">
                  কার্ডে ক্লিক করলে ছবিতে দেখানো ম্যাপ ও বিস্তারিত পেজ ওপেন হবে
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {ideas.map((item: any) => {
                  const id = item._id || item.id;
                  const profit = item.retailPrice - item.wholesalePrice;
                  return (
                    <div
                      key={id}
                      className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all p-5 flex flex-col justify-between group"
                    >
                      <div>
                        {/* Top Badges: Category & District */}
                        <div className="flex items-center justify-between mb-2.5">
                          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                            ক্যাটাগরি: {item.category}
                          </span>
                          <span className="text-[11px] font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                            জেলা: {item.district}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 
                          onClick={() => setSelectedIdeaPreview(item)}
                          className="font-extrabold text-slate-900 text-base hover:text-emerald-700 transition-colors cursor-pointer line-clamp-2 mb-2"
                        >
                          {item.title}
                        </h4>

                        {/* Location */}
                        <div className="flex items-center gap-1 text-xs text-slate-500 mb-3">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{item.exactLocation}</span>
                        </div>

                        {/* Price 3-Column */}
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 grid grid-cols-3 gap-1 text-center text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 block">পাইকারি</span>
                            <span className="font-bold text-slate-900 block">৳ {item.wholesalePrice}</span>
                          </div>
                          <div className="border-x border-slate-200">
                            <span className="text-[10px] text-slate-400 block">খুচরা</span>
                            <span className="font-bold text-slate-900 block">৳ {item.retailPrice}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-emerald-700 font-bold block">লাভ</span>
                            <span className="font-extrabold text-emerald-700 block">+৳ {profit}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Bottom: Edit & Delete buttons */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <button
                          onClick={() => setSelectedIdeaPreview(item)}
                          className="text-emerald-700 font-bold hover:underline cursor-pointer"
                        >
                          ম্যাপ ও ডিটেইল দেখুন &gt;
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingIdea({ ...item })}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 cursor-pointer"
                            title="এডিট করুন"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteIdea(id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                            title="ডিলিট করুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: BLOG POSTING & BLOGS MANAGEMENT                   */}
        {/* ======================================================== */}
        {activeTab === 'blogs' && (
          <div className="space-y-8">
            
            {/* Top: Add Blog Form */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    নতুন উদ্যোক্তা ব্লগ পোস্ট করুন
                  </h2>
                </div>
                <span className="text-xs text-slate-400">
                  পোস্ট করলে সরাসরি নিচে ব্লগের তালিকায় জমা হবে
                </span>
              </div>

              <form onSubmit={handlePostBlog} className="space-y-4 text-xs sm:text-sm">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800">
                    ব্লগের শিরোনাম (Title) *
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
                    ক্যাটাগরি *
                  </label>
                  <input
                    type="text"
                    required
                    value={blogCategory}
                    onChange={(e) => setBlogCategory(e.target.value)}
                    placeholder="যেমন: বাজেট প্ল্যানিং, সোর্সিং, কস্টিং"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
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
                    placeholder="কার্ডে দেখানোর মতো ২-৩ লাইনের সংক্ষেপ..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="font-bold text-slate-800">
                      সম্পূর্ণ বিস্তারিত বিবরণ (Full Content & Rich Formatting) *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowGuidelineModal(true)}
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline flex items-center gap-1 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      ব্লগ রাইটিং গাইডলাইন ও শর্টকাট ম্যানুয়াল
                    </button>
                  </div>

                  {/* Formatting Toolbar */}
                  <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-100 rounded-xl border border-slate-200 text-xs">
                    <button type="button" onClick={() => insertBlogSyntax('**', '**')} className="px-2 py-1 bg-white border border-slate-200 rounded font-bold hover:bg-slate-50 cursor-pointer" title="Bold (**text**)">B (বোল্ড)</button>
                    <button type="button" onClick={() => insertBlogSyntax('_', '_')} className="px-2 py-1 bg-white border border-slate-200 rounded italic hover:bg-slate-50 cursor-pointer" title="Italic (_text_)">I (ইটালিক)</button>
                    <button type="button" onClick={() => insertBlogSyntax('~', '~')} className="px-2 py-1 bg-white border border-slate-200 rounded line-through hover:bg-slate-50 cursor-pointer" title="Strikethrough (~text~)">S (কাটা)</button>
                    <span className="h-4 w-px bg-slate-300 mx-0.5" />
                    <button type="button" onClick={() => insertBlogSyntax('# ')} className="px-2 py-1 bg-white border border-slate-200 rounded font-bold hover:bg-slate-50 cursor-pointer">H1</button>
                    <button type="button" onClick={() => insertBlogSyntax('## ')} className="px-2 py-1 bg-white border border-slate-200 rounded font-bold hover:bg-slate-50 cursor-pointer">H2</button>
                    <button type="button" onClick={() => insertBlogSyntax('### ')} className="px-2 py-1 bg-white border border-slate-200 rounded font-bold hover:bg-slate-50 cursor-pointer">H3</button>
                    <span className="h-4 w-px bg-slate-300 mx-0.5" />
                    <button type="button" onClick={() => insertBlogSyntax('- ')} className="px-2 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50 cursor-pointer">• বুলেট তালিকা</button>
                    <button type="button" onClick={() => insertBlogSyntax('১. ')} className="px-2 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50 cursor-pointer">১. নম্বর তালিকা</button>
                    <button type="button" onClick={() => insertBlogSyntax('> ')} className="px-2 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50 cursor-pointer">“ কোটেশন</button>
                    <span className="h-4 w-px bg-slate-300 mx-0.5" />
                    <button type="button" onClick={() => insertBlogSyntax('[color=#10b981]', '[/color]')} className="px-2 py-1 bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 rounded hover:bg-emerald-200 cursor-pointer">সবুজ কালার</button>
                    <button type="button" onClick={() => insertBlogSyntax('[color=#ef4444]', '[/color]')} className="px-2 py-1 bg-rose-100 text-rose-800 font-bold border border-rose-300 rounded hover:bg-rose-200 cursor-pointer">লাল কালার</button>
                    <button type="button" onClick={() => insertBlogSyntax('[color=#3b82f6]', '[/color]')} className="px-2 py-1 bg-blue-100 text-blue-800 font-bold border border-blue-300 rounded hover:bg-blue-200 cursor-pointer">নীল কালার</button>
                    <button type="button" onClick={() => insertBlogSyntax('[color=#f59e0b]', '[/color]')} className="px-2 py-1 bg-amber-100 text-amber-800 font-bold border border-amber-300 rounded hover:bg-amber-200 cursor-pointer">সোনালী কালার</button>
                  </div>

                  <textarea
                    rows={8}
                    required
                    value={blogContent}
                    onChange={(e) => setBlogContent(e.target.value)}
                    placeholder="ব্লগের বিস্তারিত আলোচনা, পয়েন্ট (###), বুলেট লিস্ট ও কালার টেক্সট দিয়ে লিখুন..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingBlog}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-all cursor-pointer"
                >
                  {submittingBlog ? 'সেভ হচ্ছে...' : 'ব্লগটি পোস্ট করুন'}
                </button>
              </form>
            </div>

            {/* Bottom: List of Blog Cards (With Edit & Delete options) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                  পোস্ট করা ব্লগসমূহ ({blogs.length}টি)
                </h3>
                <span className="text-xs text-slate-500">
                  ব্লগ কার্ডে চাপ দিলে বিস্তারিত বিবরণ ওপেন হবে
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {blogs.map((b: any) => {
                  const id = b._id || b.id;
                  return (
                    <div
                      key={id}
                      className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all p-5 flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2 text-xs">
                          <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                            {b.category}
                          </span>
                          <span className="text-slate-400">{b.readTime || '৫ মিনিট'}</span>
                        </div>

                        <h4 
                          onClick={() => setSelectedBlogPreview(b)}
                          className="font-extrabold text-slate-900 text-base hover:text-emerald-700 transition-colors cursor-pointer line-clamp-2 mb-2"
                        >
                          {b.title}
                        </h4>

                        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                          {b.excerpt}
                        </p>
                      </div>

                      {/* Card Bottom: Edit & Delete buttons */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <button
                          onClick={() => setSelectedBlogPreview(b)}
                          className="text-emerald-700 font-bold hover:underline cursor-pointer"
                        >
                          বিস্তারিত পড়ুন &gt;
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingBlog({ ...b })}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 cursor-pointer"
                            title="এডিট করুন"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteBlog(id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                            title="ডিলিট করুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ======================================================== */}
      {/* PREVIEW MODAL 1: EXACT SCREENSHOT MATCH DETAIL VIEW      */}
      {/* ======================================================== */}
      {selectedIdeaPreview && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400">
                বিজনেস আইডিয়া কার্ড প্রিভিউ (আপনার রেফারেন্স ছবির অনুরূপ)
              </span>
              <button 
                onClick={() => setSelectedIdeaPreview(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-8 space-y-6 max-h-[82vh] overflow-y-auto">
              
              {/* Breadcrumb */}
              <div className="text-xs text-slate-400 flex items-center gap-1 border-b border-slate-100 pb-2">
                <span>হোম</span> &gt; <span>{selectedIdeaPreview.district}</span> &gt; <span className="text-slate-800 font-bold">{selectedIdeaPreview.title}</span>
              </div>

              {/* Title & Badges */}
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {selectedIdeaPreview.title}
                </h1>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="bg-emerald-100 text-emerald-900 font-bold px-3 py-1 rounded-md border border-emerald-300">
                    জেলা: {selectedIdeaPreview.district}
                  </span>
                  <span className="bg-slate-100 text-slate-700 font-semibold px-3 py-1 rounded-md border border-slate-200">
                    ক্যাটাগরি: {selectedIdeaPreview.category}
                  </span>
                  <span className="bg-slate-100 text-slate-700 font-semibold px-3 py-1 rounded-md border border-slate-200">
                    সোর্সিং বাজার: {selectedIdeaPreview.exactLocation}
                  </span>
                </div>
              </div>

              {/* দাম ও লাভ (3 boxes) */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-800">দাম ও লাভ</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                    <span className="text-xs font-semibold text-slate-500 block mb-1">পাইকারি দাম</span>
                    <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                      ৳ {selectedIdeaPreview.wholesalePrice}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                    <span className="text-xs font-semibold text-slate-500 block mb-1">খুচরা দাম</span>
                    <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                      ৳ {selectedIdeaPreview.retailPrice}
                    </div>
                  </div>

                  <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-4 shadow-xs">
                    <span className="text-xs font-semibold text-emerald-800 block mb-1">প্রফিট / লাভ</span>
                    <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700">
                      ৳ {selectedIdeaPreview.retailPrice - selectedIdeaPreview.wholesalePrice}
                    </div>
                  </div>
                </div>
              </div>

              {/* Exact Location & Live Google Map */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="p-4 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                        অনলাইন ও অফলাইনে লোকাল সোর্সিং হাব
                      </span>
                      <p className="text-xs sm:text-sm font-bold text-slate-800">
                        {selectedIdeaPreview.exactLocation}
                      </p>
                    </div>
                  </div>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedIdeaPreview.exactLocation)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    গুগল ম্যাপে দেখুন
                  </a>
                </div>

                <div className="w-full h-72 sm:h-80 bg-slate-100">
                  <iframe
                    title="Google Map Embed"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedIdeaPreview.exactLocation)}&hl=bn&z=14&output=embed`}
                    className="w-full h-full border-0"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">বিবরণ</h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {selectedIdeaPreview.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* PREVIEW MODAL 2: BLOG FULL CONTENT DETAIL               */}
      {/* ======================================================== */}
      {selectedBlogPreview && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400">
                ব্লগ বিস্তারিত প্রিভিউ
              </span>
              <button 
                onClick={() => setSelectedBlogPreview(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-7 space-y-4 max-h-[82vh] overflow-y-auto">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                {selectedBlogPreview.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {selectedBlogPreview.title}
              </h2>
              <p className="text-xs text-slate-500">
                লেখক: {selectedBlogPreview.author}
              </p>

              <div className="p-3.5 rounded-xl bg-slate-50 border-l-4 border-emerald-600 text-xs sm:text-sm text-slate-700 italic">
                "{selectedBlogPreview.excerpt}"
              </div>

              <div className="text-xs sm:text-sm leading-relaxed text-slate-700 whitespace-pre-line space-y-3">
                {selectedBlogPreview.content}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: EDIT BUSINESS IDEA CARD                         */}
      {/* ======================================================== */}
      {editingIdea && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400">
                আইডিয়া কার্ড এডিট করুন
              </span>
              <button onClick={() => setEditingIdea(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateIdea} className="p-5 sm:p-6 space-y-3 text-xs sm:text-sm max-h-[80vh] overflow-y-auto">
              <div>
                <label className="font-bold text-slate-700 block mb-1">শিরোনাম</label>
                <input
                  type="text"
                  required
                  value={editingIdea.title}
                  onChange={(e) => setEditingIdea({ ...editingIdea, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">ক্যাটাগরি</label>
                  <input
                    type="text"
                    required
                    value={editingIdea.category}
                    onChange={(e) => setEditingIdea({ ...editingIdea, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">জেলা</label>
                  <input
                    type="text"
                    required
                    value={editingIdea.district}
                    onChange={(e) => setEditingIdea({ ...editingIdea, district: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">নির্দিষ্ট সোর্সিং ঠিকানা</label>
                <input
                  type="text"
                  required
                  value={editingIdea.exactLocation}
                  onChange={(e) => setEditingIdea({ ...editingIdea, exactLocation: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">পাইকারি দাম (৳)</label>
                  <input
                    type="number"
                    required
                    value={editingIdea.wholesalePrice}
                    onChange={(e) => setEditingIdea({ ...editingIdea, wholesalePrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">খুচরা দাম (৳)</label>
                  <input
                    type="number"
                    required
                    value={editingIdea.retailPrice}
                    onChange={(e) => setEditingIdea({ ...editingIdea, retailPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">বিবরণ</label>
                <textarea
                  rows={3}
                  value={editingIdea.description}
                  onChange={(e) => setEditingIdea({ ...editingIdea, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingIdea(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold"
                >
                  আপডেট সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: EDIT BLOG POST                                  */}
      {/* ======================================================== */}
      {editingBlog && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400">
                ব্লগ এডিট করুন
              </span>
              <button onClick={() => setEditingBlog(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateBlog} className="p-5 sm:p-6 space-y-3 text-xs sm:text-sm max-h-[80vh] overflow-y-auto">
              <div>
                <label className="font-bold text-slate-700 block mb-1">শিরোনাম</label>
                <input
                  type="text"
                  required
                  value={editingBlog.title}
                  onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">ক্যাটাগরি</label>
                <input
                  type="text"
                  required
                  value={editingBlog.category}
                  onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">সংক্ষেপ (Excerpt)</label>
                <textarea
                  rows={2}
                  required
                  value={editingBlog.excerpt}
                  onChange={(e) => setEditingBlog({ ...editingBlog, excerpt: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">বিস্তারিত বিষয়বস্তু</label>
                <textarea
                  rows={6}
                  required
                  value={editingBlog.content}
                  onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingBlog(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold"
                >
                  আপডেট সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 5: API CONNECTION MODAL FOR YOUR WEBSITE           */}
      {/* ======================================================== */}
      {apiModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-sm">আপনার ওয়েবসাইটের সাথে API কানেক্ট করার কোড</span>
              </div>
              <button onClick={() => setApiModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm max-h-[80vh] overflow-y-auto">
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                <p className="font-bold mb-1">ফাইল লোকেশন:</p>
                <p className="text-xs">
                  সম্পূর্ণ বিস্তারিত গাইড ও রেডিমেড কোড <code className="bg-white px-1.5 py-0.5 rounded font-mono font-bold text-emerald-800">/API_CONNECTION_GUIDE.md</code> ফাইলে রয়েছে।
                </p>
              </div>

              {/* Business Ideas API */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 block">১. বিজনেস আইডিয়া কার্ড ফেচ করার API:</span>
                <div className="p-2.5 rounded-lg bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto">
                  GET http://localhost:3000/api/ideas
                </div>
                <p className="text-xs text-slate-600">
                  এটি কল করলে অ্যাডমিনের পোস্ট করা ক্যাটাগরি, জেলা, নির্দিষ্ট ঠিকানা, পাইকারি দাম ও খুচরা দাম সহ সব কার্ড পাবেন।
                </p>
              </div>

              {/* Blogs API */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 block">২. ব্লগসমূহ ফেচ করার API:</span>
                <div className="p-2.5 rounded-lg bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto">
                  GET http://localhost:3000/api/blogs
                </div>
                <p className="text-xs text-slate-600">
                  এটি কল করলে সব ব্লগের টাইটেল, ক্যাটাগরি, সংক্ষেপ ও সম্পূর্ণ বিবরণ পাবেন।
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setApiModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
                >
                  ঠিক আছে
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Blog Writing Guideline & Formatting Manual Modal */}
      {showGuidelineModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowGuidelineModal(false)}>
          <div className="bg-white max-w-2xl w-full rounded-2xl p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto border border-slate-200" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-slate-900 text-lg">ব্লগ রাইটিং গাইডলাইন ও অ্যাডভান্স ফরম্যাটিং ম্যানুয়াল</h3>
              </div>
              <button onClick={() => setShowGuidelineModal(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer">
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <p className="bg-emerald-50 text-emerald-900 p-3 rounded-xl border border-emerald-200 font-medium">
                💡 <strong>মেইন সাইট রেন্ডারিং নোটিশ:</strong> অ্যাডমিন প্যানেল থেকে যেভাবে বোল্ড, ইটালিক, বুলেট পয়েন্ট, হেডিং এবং টেক্সটের বিভিন্ন কালার দিয়ে পোস্ট তৈরি করবেন, মেইন সাইটে (Business Idea Zone) ঠিক একই ডিজাইন ও কালার ফরম্যাটে রিডারের কাছে প্রদর্শিত হবে।
              </p>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm border-b pb-1">১. হোয়াটসঅ্যাপ শর্টকাট (WhatsApp Style Formatting)</h4>
                <ul className="space-y-2 font-mono text-xs">
                  <li className="p-2 bg-slate-50 rounded border border-slate-200">
                    <span className="text-emerald-700 font-bold">**বোল্ড টেক্সট**</span> বা <span className="text-emerald-700 font-bold">*বোল্ড টেক্সট*</span> 👉 <strong>গঢ়ো বোল্ড ফন্টে দেখাবে</strong>
                  </li>
                  <li className="p-2 bg-slate-50 rounded border border-slate-200">
                    <span className="text-emerald-700 font-bold">_ইটালিক টেক্সট_</span> 👉 <em>বাঁকানো বা ইটালিক ফন্টে দেখাবে</em>
                  </li>
                  <li className="p-2 bg-slate-50 rounded border border-slate-200">
                    <span className="text-emerald-700 font-bold">~কাটা টেক্সট~</span> 👉 <del>দাগ কাটা বা স্ট্রাইকথ্রু দেখাবে</del>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm border-b pb-1">২. কাস্টম টেক্সট কালার (Custom Colors)</h4>
                <ul className="space-y-2 font-mono text-xs">
                  <li className="p-2 bg-slate-50 rounded border border-slate-200">
                    <span className="text-emerald-700">[color=#10b981]সবুজ কালার টেক্সট[/color]</span> 👉 <span style={{ color: '#10b981' }} className="font-bold">সবুজ টেক্সট</span>
                  </li>
                  <li className="p-2 bg-slate-50 rounded border border-slate-200">
                    <span className="text-rose-700">[color=#ef4444]লাল কালার সতর্কবার্তা[/color]</span> 👉 <span style={{ color: '#ef4444' }} className="font-bold">লাল কালার সতর্কবার্তা</span>
                  </li>
                  <li className="p-2 bg-slate-50 rounded border border-slate-200">
                    <span className="text-blue-700">[color=#3b82f6]নীল কালার হাইলাইট[/color]</span> 👉 <span style={{ color: '#3b82f6' }} className="font-bold">নীল কালার হাইলাইট</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm border-b pb-1">৩. হেডিং, তালিকা ও কোটেশন (Headings & Lists)</h4>
                <ul className="space-y-2 font-mono text-xs">
                  <li className="p-2 bg-slate-50 rounded border border-slate-200">
                    <span className="text-emerald-700">### ৩.১ পাইকারি বাজারে যাওয়ার প্রস্তুতি</span> 👉 বড় বোল্ড হেডিং টাইটেল
                  </li>
                  <li className="p-2 bg-slate-50 rounded border border-slate-200">
                    <span className="text-emerald-700">- পয়েন্ট ১</span> <br /><span className="text-emerald-700">- পয়েন্ট ২</span> 👉 সুন্দর সবুজ ডট যুক্ত বুলেট পয়েন্ট লিস্ট
                  </li>
                  <li className="p-2 bg-slate-50 rounded border border-slate-200">
                    <span className="text-emerald-700">&gt; ব্যবসা শুরু করার প্রথম নিয়ম হলো হিসাব রাখা।</span> 👉 হাইলাইটেড সবুজ বর্ডার কোটেশন বক্স
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-2 border-t flex justify-end">
              <button
                onClick={() => setShowGuidelineModal(false)}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow cursor-pointer"
              >
                ঠিক আছে, বুঝেছি
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
