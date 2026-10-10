import React, { useState } from 'react';
import { 
  X, 
  PlusCircle, 
  BookOpen, 
  MapPin, 
  Trash2, 
  CheckCircle2, 
  Code2, 
  Copy, 
  Check, 
  AlertCircle,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  Save
} from 'lucide-react';
import { BlogPost, SourcingIdea } from '../types';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  sourcingIdeas: SourcingIdea[];
  blogPosts: BlogPost[];
  onAddSourcingIdea: (idea: any) => void;
  onDeleteSourcingIdea: (id: string) => void;
  onAddBlogPost: (blog: any) => void;
  onDeleteBlogPost: (id: string) => void;
  onToggleVerifySourcing: (id: string) => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  isAdmin,
  setIsAdmin,
  sourcingIdeas,
  blogPosts,
  onAddSourcingIdea,
  onDeleteSourcingIdea,
  onAddBlogPost,
  onDeleteBlogPost,
  onToggleVerifySourcing
}) => {
  const [activeTab, setActiveTab] = useState<'sourcing' | 'blog' | 'manage' | 'api'>('sourcing');
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  // Sourcing form state
  const [sTitle, setSTitle] = useState('');
  const [sCategory, setSCategory] = useState('খাবার ও দুগ্ধ');
  const [sDistrict, setSDistrict] = useState('ঢাকা');
  const [sArea, setSArea] = useState('');
  const [sExactLocation, setSExactLocation] = useState('');
  const [sWholesalePrice, setSWholesalePrice] = useState<string>('');
  const [sWholesalePriceMax, setSWholesalePriceMax] = useState<string>('');
  const [sRetailPrice, setSRetailPrice] = useState<string>('');
  const [sRetailPriceMax, setSRetailPriceMax] = useState<string>('');
  const [sUnit, setSUnit] = useState('প্রতি পিস');
  const [sMoq, setSMoq] = useState('১০ পিস');
  const [sLat, setSLat] = useState<number>(23.8103);
  const [sLng, setSLng] = useState<number>(90.4125);
  const [sDescription, setSDescription] = useState('');
  const [sSupplierTip, setSSupplierTip] = useState('');
  const [sContact, setSContact] = useState('');
  const [sIsVerified, setSIsVerified] = useState(true);

  const parseRangeValue = (val: string, maxVal?: string) => {
    let min: number = 0;
    let max: number | undefined = undefined;

    const s = String(val || '').trim();
    if (s.includes('-')) {
      const parts = s.split('-').map((p) => parseFloat(p.replace(/[^\d.]/g, '')));
      if (!isNaN(parts[0])) min = parts[0];
      if (parts.length > 1 && !isNaN(parts[1])) max = parts[1];
    } else {
      const n = parseFloat(s.replace(/[^\d.]/g, ''));
      if (!isNaN(n)) min = n;
    }

    if (maxVal && maxVal.trim()) {
      const mn = parseFloat(String(maxVal).replace(/[^\d.]/g, ''));
      if (!isNaN(mn)) max = mn;
    }

    return { min, max };
  };

  const handleSourcingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sTitle || !sExactLocation) {
      alert('দয়া করে শিরোনাম এবং নির্দিষ্ট সোর্সিং ঠিকানা পূরণ করুন।');
      return;
    }

    const wRange = parseRangeValue(sWholesalePrice, sWholesalePriceMax);
    const rRange = parseRangeValue(sRetailPrice, sRetailPriceMax);

    onAddSourcingIdea({
      title: sTitle,
      category: sCategory,
      district: sDistrict,
      upazilaOrArea: sArea || sDistrict,
      exactLocation: sExactLocation,
      coordinates: {
        lat: Number(sLat) || 23.8103,
        lng: Number(sLng) || 90.4125
      },
      wholesalePrice: wRange.min,
      wholesalePriceMax: wRange.max,
      retailPrice: rRange.min,
      retailPriceMax: rRange.max,
      unit: sUnit,
      moq: sMoq,
      isVerified: sIsVerified,
      verificationBadgeText: sIsVerified ? 'ভেরিফায়েড প্রজেক্ট' : 'কমিউনিটি পর্যালোচনায়',
      description: sDescription,
      supplierTip: sSupplierTip,
      contactNumber: sContact,
      tags: [`#${sDistrict}`, `#${sCategory}`, '#পাইকারি'],
      postedBy: {
        name: 'অ্যাডমিন মডারেটর',
        role: 'Regards Tech টিম',
        isVerifiedUser: true
      }
    });

    // Reset
    setSTitle('');
    setSExactLocation('');
    setSWholesalePrice('');
    setSWholesalePriceMax('');
    setSRetailPrice('');
    setSRetailPriceMax('');
    setSDescription('');
    setSSupplierTip('');
    setSuccessMsg('অভিনন্দন! নতুন পাইকারি সোর্সিং ও বিজনেস আইডিয়া সফলভাবে যুক্ত হয়েছে।');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleBlogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bTitle || !bContent || !bExcerpt) {
      alert('দয়া করে ব্লগের শিরোনাম, সারসংক্ষেপ ও বিস্তারিত বিষয়বস্তু লিখুন।');
      return;
    }

    const bullets = bTakeaway
      ? bTakeaway.split('\n').filter((t) => t.trim().length > 0)
      : ['ক্যালকুলেটেড রিস্ক নিয়ে ব্যবসা শুরু করুন।'];

    const checklist = bChecklist
      ? bChecklist.split('\n').filter((t) => t.trim().length > 0)
      : ['সাপ্লায়ারের সাথে সরাসরি কথা বলুন'];

    const tags = bTags.split(',').map((t) => t.trim()).filter(Boolean);

    onAddBlogPost({
      title: bTitle,
      category: bCategory,
      author: bAuthor,
      authorTitle: bAuthorTitle,
      readTime: bReadTime,
      excerpt: bExcerpt,
      content: bContent,
      bulletPoints: bullets,
      actionChecklist: checklist,
      tags: tags
    });

    setBTitle('');
    setBExcerpt('');
    setBContent('');
    setBTakeaway('');
    setBChecklist('');
    setSuccessMsg('অভিনন্দন! নতুন উদ্যোক্তা ব্লগ সফলভাবে প্রকাশ করা হয়েছে।');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(id);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg">
                অ্যাডমিন ও কনটেন্ট ম্যানেজমেন্ট ড্যাশবোর্ড
              </h2>
              <p className="text-xs text-slate-400">
                নতুন সোর্সিং হাব, বিজনেস কার্ড ও ব্লগ পোস্ট আপলোড করুন
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Not Logged In State */}
        {!isAdmin ? (
          <div className="p-8 max-w-md mx-auto text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              অ্যাডমিন এক্সেস প্রয়োজন
            </h3>
            <p className="text-xs text-slate-500">
              সোর্সিং তথ্য ও ব্লগ সরাসরি ওয়েবসাইট থেকে আপলোড বা এডিট করার জন্য অ্যাডমিন হিসেবে প্রবেশ করুন। (ডেমো পাসওয়ার্ড: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">admin123</code> অথবা সরাসরি "প্রবেশ করুন" বাটনে চাপুন)
            </p>

            <form onSubmit={handleAdminLogin} className="space-y-3 pt-2">
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="পাসকোড লিখুন (ডিফল্ট: admin123)"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-emerald-500 outline-none"
              />
              {authError && <p className="text-xs text-rose-500 font-medium">{authError}</p>}
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                অ্যাডমিন ড্যাশবোর্ডে প্রবেশ করুন
              </button>
            </form>
          </div>
        ) : (
          <div>
            {/* Tabs Navigation */}
            <div className="flex border-b border-slate-200 bg-slate-50 px-4 sm:px-6 overflow-x-auto">
              {[
                { id: 'sourcing', label: '১. বিজনেস আইডিয়া ও সোর্সিং পোস্ট', icon: MapPin },
                { id: 'blog', label: '২. নতুন উদ্যোক্তা ব্লগ পোস্ট', icon: BookOpen },
                { id: 'manage', label: '৩. বিদ্যমান পোস্ট ম্যানেজ', icon: CheckCircle2 },
                { id: 'api', label: '৪. API কানেকশন ডক', icon: Code2 }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 py-3 px-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'border-emerald-600 text-emerald-800 bg-white'
                        : 'border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Success Notification */}
            {successMsg && (
              <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-100 text-emerald-900 text-xs sm:text-sm font-semibold flex items-center gap-2 border border-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Tab 1: Sourcing Idea & Business Card Upload */}
            {activeTab === 'sourcing' && (
              <div className="p-5 sm:p-8 max-h-[75vh] overflow-y-auto">
                <form onSubmit={handleSourcingSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Title */}
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        পোস্টের শিরোনাম (Title) *
                      </label>
                      <input
                        type="text"
                        required
                        value={sTitle}
                        onChange={(e) => setSTitle(e.target.value)}
                        placeholder="যেমন: Savar-এ MILK পাইকারি সোর্সিং অথবা চকবাজার ট্রেন্ডি জুয়েলারি"
                        className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                      />
                    </div>

                    {/* Category */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        ক্যাটাগরি (Category) *
                      </label>
                      <select
                        value={sCategory}
                        onChange={(e) => setSCategory(e.target.value)}
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white"
                      >
                        <option value="পোশাক">পোশাক ও ফ্যাশন (Cloth)</option>
                        <option value="খাবার ও দুগ্ধ">খাবার ও দুগ্ধ (Food/Dairy)</option>
                        <option value="কৃষি">কৃষি ও এগ্রো (Agro)</option>
                        <option value="পোশাক ও গহনা">জুয়েলারি ও এক্সেসরিজ</option>
                        <option value="চামড়াজাত">চামড়াজাত পণ্য (Leather)</option>
                        <option value="কসমেটিক্স">কসমেটিক্স ও বিউটি</option>
                        <option value="ইলেকট্রনিক্স">ইলেকট্রনিক্স ও গ্যাজেট</option>
                        <option value="অন্যান্য">অন্যান্য পণ্য</option>
                      </select>
                    </div>

                    {/* District */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        জেলা (Jela / District) *
                      </label>
                      <input
                        type="text"
                        required
                        value={sDistrict}
                        onChange={(e) => setSDistrict(e.target.value)}
                        placeholder="যেমন: ঢাকা, বগুড়া, নরসিংদী"
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                      />
                    </div>

                    {/* Upazila or Area */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        উপজেলা বা এলাকা (Upazila/Area)
                      </label>
                      <input
                        type="text"
                        value={sArea}
                        onChange={(e) => setSArea(e.target.value)}
                        placeholder="যেমন: সাভার, চকবাজার, ইসলামপুর, শেরপুর"
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                      />
                    </div>

                    {/* Exact Location */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        নির্দিষ্ট সোর্সিং ঠিকানা ও বাজার (Exact Location) *
                      </label>
                      <input
                        type="text"
                        required
                        value={sExactLocation}
                        onChange={(e) => setSExactLocation(e.target.value)}
                        placeholder="যেমন: সাভার পৌরসভা রোড, বংশী নদীর ঘাট সংলগ্ন আড়ত"
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                      />
                    </div>

                    {/* Wholesale Price Range */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        পাইকারি দামের রেঞ্জ (Wholesale Price Range / ৳ - অপশনাল)
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={sWholesalePrice}
                          onChange={(e) => setSWholesalePrice(e.target.value)}
                          placeholder="দাম বা রেঞ্জ (যেমন: 100-3000)"
                          className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                        />
                        <input
                          type="text"
                          value={sWholesalePriceMax}
                          onChange={(e) => setSWholesalePriceMax(e.target.value)}
                          placeholder="সর্বোচ্চ (যেমন: 3000)"
                          className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                        />
                      </div>
                    </div>

                    {/* Retail / Selling Price Range */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        খুচরা বিক্রয়মূল্যের রেঞ্জ (Retail Price Range / ৳ - অপশনাল)
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={sRetailPrice}
                          onChange={(e) => setSRetailPrice(e.target.value)}
                          placeholder="দাম বা রেঞ্জ (যেমন: 150-3500)"
                          className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                        />
                        <input
                          type="text"
                          value={sRetailPriceMax}
                          onChange={(e) => setSRetailPriceMax(e.target.value)}
                          placeholder="সর্বোচ্চ (যেমন: 3500)"
                          className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                        />
                      </div>
                    </div>

                    {/* Unit */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        পরিমাপের ইউনিট
                      </label>
                      <input
                        type="text"
                        value={sUnit}
                        onChange={(e) => setSUnit(e.target.value)}
                        placeholder="যেমন: প্রতি লিটার, প্রতি পিস, প্রতি গজ"
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200"
                      />
                    </div>

                    {/* MOQ */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        ন্যূনতম অর্ডার সাইজ (MOQ)
                      </label>
                      <input
                        type="text"
                        value={sMoq}
                        onChange={(e) => setSMoq(e.target.value)}
                        placeholder="যেমন: ২০ লিটার, ১২ পিস (১ ডজন)"
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200"
                      />
                    </div>

                    {/* Latitude / Longitude */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        অক্ষাংশ (Latitude - ম্যাপের জন্য)
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={sLat}
                        onChange={(e) => setSLat(parseFloat(e.target.value) || 23.8103)}
                        placeholder="23.8583"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        দ্রাঘিমাংশ (Longitude - ম্যাপের জন্য)
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={sLng}
                        onChange={(e) => setSLng(parseFloat(e.target.value) || 90.4125)}
                        placeholder="90.2667"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                      />
                    </div>

                    {/* Contact Number */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        যোগাযোগের নম্বর (ঐচ্ছিক)
                      </label>
                      <input
                        type="text"
                        value={sContact}
                        onChange={(e) => setSContact(e.target.value)}
                        placeholder="+880 1712-398412"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                      />
                    </div>

                    {/* Verified checkbox */}
                    <div className="flex items-center gap-2 pt-6">
                      <input
                        type="checkbox"
                        id="isVerified"
                        checked={sIsVerified}
                        onChange={(e) => setSIsVerified(e.target.checked)}
                        className="w-4 h-4 text-emerald-600 rounded"
                      />
                      <label htmlFor="isVerified" className="text-xs font-bold text-slate-700 cursor-pointer">
                        ভেরিফায়েড ব্যাজ সহ প্রকাশ করুন (Verified Hub)
                      </label>
                    </div>

                    {/* Description */}
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        সোর্সিং বিস্তারিত বিবরণ (Description) *
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={sDescription}
                        onChange={(e) => setSDescription(e.target.value)}
                        placeholder="কীভাবে পণ্য কিনতে হবে, পণ্যের গুণমান কেমন, কোথায় পাওয়া যায়..."
                        className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                      />
                    </div>

                    {/* Supplier Advice */}
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        সাপ্লায়ারের সাথে কথা বলার টিপস ও সতর্কতা
                      </label>
                      <input
                        type="text"
                        value={sSupplierTip}
                        onChange={(e) => setSSupplierTip(e.target.value)}
                        placeholder="যেমন: সকালে সরাসরি গিয়ে দুধের ঘনত্ব মেপে নিন..."
                        className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200"
                      />
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      সোর্সিং আইডিয়া পাবলিশ করুন
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Tab 2: Upload New Blog Post */}
            {activeTab === 'blog' && (
              <div className="p-5 sm:p-8 max-h-[75vh] overflow-y-auto">
                <form onSubmit={handleBlogSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      ব্লগের শিরোনাম (Blog Title) *
                    </label>
                    <input
                      type="text"
                      required
                      value={bTitle}
                      onChange={(e) => setBTitle(e.target.value)}
                      placeholder="যেমন: ৫,০০০ টাকার মধ্যে ব্যবসা শুরু করার পরিকল্পনা"
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        ক্যাটাগরি
                      </label>
                      <input
                        type="text"
                        value={bCategory}
                        onChange={(e) => setBCategory(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        লেখক (Author)
                      </label>
                      <input
                        type="text"
                        value={bAuthor}
                        onChange={(e) => setBAuthor(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        পড়ার সময়
                      </label>
                      <input
                        type="text"
                        value={bReadTime}
                        onChange={(e) => setBReadTime(e.target.value)}
                        placeholder="৫ মিনিট"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      সংক্ষিপ্ত বিবরণ (Excerpt / Lead Summary) *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={bExcerpt}
                      onChange={(e) => setBExcerpt(e.target.value)}
                      placeholder="ব্লগ কার্ডে দেখানোর মতো ২-৩ লাইনের আকর্ষণীয় সারসংক্ষেপ..."
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <label className="text-xs font-bold text-slate-700">
                        মূল বিষয়বস্তু (Full Markdown & Rich Formatting Content) *
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowGuideline(true)}
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline flex items-center gap-1 cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        ব্লগ রাইটিং গাইডলাইন ও শর্টকাট ম্যানুয়াল
                      </button>
                    </div>

                    {/* Formatting Toolbar */}
                    <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-100 rounded-xl border border-slate-200 text-xs">
                      <button type="button" onClick={() => insertSyntax('**', '**')} className="px-2 py-1 bg-white border border-slate-200 rounded font-bold hover:bg-slate-50" title="Bold (**text**)">B (বোল্ড)</button>
                      <button type="button" onClick={() => insertSyntax('_', '_')} className="px-2 py-1 bg-white border border-slate-200 rounded italic hover:bg-slate-50" title="Italic (_text_)">I (ইটালিক)</button>
                      <button type="button" onClick={() => insertSyntax('~', '~')} className="px-2 py-1 bg-white border border-slate-200 rounded line-through hover:bg-slate-50" title="Strikethrough (~text~)">S (কাটা)</button>
                      <span className="h-4 w-px bg-slate-300 mx-0.5" />
                      <button type="button" onClick={() => insertSyntax('# ')} className="px-2 py-1 bg-white border border-slate-200 rounded font-bold hover:bg-slate-50">H1</button>
                      <button type="button" onClick={() => insertSyntax('## ')} className="px-2 py-1 bg-white border border-slate-200 rounded font-bold hover:bg-slate-50">H2</button>
                      <button type="button" onClick={() => insertSyntax('### ')} className="px-2 py-1 bg-white border border-slate-200 rounded font-bold hover:bg-slate-50">H3</button>
                      <span className="h-4 w-px bg-slate-300 mx-0.5" />
                      <button type="button" onClick={() => insertSyntax('- ')} className="px-2 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50">• বুলেট তালিকা</button>
                      <button type="button" onClick={() => insertSyntax('১. ')} className="px-2 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50">১. নম্বর তালিকা</button>
                      <button type="button" onClick={() => insertSyntax('> ')} className="px-2 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50">“ কোটেশন</button>
                      <span className="h-4 w-px bg-slate-300 mx-0.5" />
                      <button type="button" onClick={() => insertSyntax('[color=#10b981]', '[/color]')} className="px-2 py-1 bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 rounded hover:bg-emerald-200">সবুজ কালার</button>
                      <button type="button" onClick={() => insertSyntax('[color=#ef4444]', '[/color]')} className="px-2 py-1 bg-rose-100 text-rose-800 font-bold border border-rose-300 rounded hover:bg-rose-200">লাল কালার</button>
                      <button type="button" onClick={() => insertSyntax('[color=#3b82f6]', '[/color]')} className="px-2 py-1 bg-blue-100 text-blue-800 font-bold border border-blue-300 rounded hover:bg-blue-200">নীল কালার</button>
                      <button type="button" onClick={() => insertSyntax('[color=#f59e0b]', '[/color]')} className="px-2 py-1 bg-amber-100 text-amber-800 font-bold border border-amber-300 rounded hover:bg-amber-200">সোনালী কালার</button>
                    </div>

                    <textarea
                      rows={8}
                      required
                      value={bContent}
                      onChange={(e) => setBContent(e.target.value)}
                      placeholder="বিস্তারিত প্রবন্ধ, হেডিং (###), বুলেট পয়েন্ট এবং কালার কম্বিনেশনে ব্লগ লিখুন..."
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-500 outline-none font-sans leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        প্রধান শিক্ষণীয় বিষয় (Key Takeaways - প্রতি লাইনে একটি)
                      </label>
                      <textarea
                        rows={2}
                        value={bTakeaway}
                        onChange={(e) => setBTakeaway(e.target.value)}
                        placeholder="ছোট পুঁজিতে ইনভেন্টরি নয়&#10;ক্যাশফ্লো সুরক্ষিত রাখুন"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        অ্যাকশন চেকলিস্ট (Checklist - প্রতি লাইনে একটি)
                      </label>
                      <textarea
                        rows={2}
                        value={bChecklist}
                        onChange={(e) => setBChecklist(e.target.value)}
                        placeholder="১. স্যাম্পল লট আনুন&#10;২. প্যাকেজিং ঠিক করুন"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      ব্লগটি প্রকাশ করুন
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Tab 3: Manage Existing Posts */}
            {activeTab === 'manage' && (
              <div className="p-5 sm:p-8 max-h-[75vh] overflow-y-auto space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    বিদ্যমান সোর্সিং হাবসমূহ ({sourcingIdeas.length}টি)
                  </h3>

                  <div className="space-y-2">
                    {sourcingIdeas.map((idea) => (
                      <div 
                        key={idea.id} 
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{idea.title}</p>
                          <p className="text-slate-500">{idea.district} | পাইকারি: ৳{idea.wholesalePrice} | বিক্রয়: ৳{idea.retailPrice}</p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => onToggleVerifySourcing(idea.id)}
                            className={`px-2.5 py-1 rounded-md font-bold text-[11px] ${
                              idea.isVerified 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {idea.isVerified ? 'ভেরিফায়েড' : 'আনভেরিফায়েড'}
                          </button>

                          <button
                            onClick={() => {
                              if (confirm('আপনি কি এই সোর্সিং পোস্টটি ডিলিট করতে চান?')) {
                                onDeleteSourcingIdea(idea.id);
                              }
                            }}
                            className="p-1.5 rounded-md text-rose-500 hover:bg-rose-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-5">
                  <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    বিদ্যমান উদ্যোক্তা ব্লগসমূহ ({blogPosts.length}টি)
                  </h3>

                  <div className="space-y-2">
                    {blogPosts.slice(0, 10).map((blog) => (
                      <div 
                        key={blog.id} 
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <p className="font-bold text-slate-800">{blog.title}</p>
                          <p className="text-slate-500">{blog.category} | {blog.author}</p>
                        </div>

                        <button
                          onClick={() => {
                            if (confirm('আপনি কি এই ব্লগটি মুছে ফেলতে চান?')) {
                              onDeleteBlogPost(blog.id);
                            }
                          }}
                          className="p-1.5 rounded-md text-rose-500 hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: API Links and Documentation */}
            {activeTab === 'api' && (
              <div className="p-5 sm:p-8 max-h-[75vh] overflow-y-auto space-y-5">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                  <h4 className="text-sm font-bold text-emerald-900 flex items-center gap-1.5">
                    <Code2 className="w-4 h-4 text-emerald-700" />
                    এক্সটারনাল ব্যাকএন্ড / API ইন্টিগ্রেশন লিঙ্কসমূহ
                  </h4>
                  <p className="text-xs text-emerald-800">
                    নিচের লিঙ্ক ও এন্ডপয়েন্টগুলো ব্যবহার করে আপনি আপনার নিজস্ব Laravel, Django, Express বা Firebase ব্যাকএন্ডে এই প্ল্যাটফর্ম যুক্ত করতে পারেন।
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      method: 'GET',
                      url: '/api/sourcing',
                      desc: 'সকল সোর্সিং ও বিজনেস আইডিয়া পেতে'
                    },
                    {
                      method: 'POST',
                      url: '/api/sourcing',
                      desc: 'নতুন সোর্সিং হাব ও বিজনেস আইডিয়া পোস্ট করতে'
                    },
                    {
                      method: 'GET',
                      url: '/api/blogs',
                      desc: 'সকল ২০টি উদ্যোক্তা ব্লগের তালিকা পেতে'
                    },
                    {
                      method: 'POST',
                      url: '/api/blogs',
                      desc: 'নতুন ব্লগ আর্টিকেল পোস্ট করতে'
                    },
                    {
                      method: 'POST',
                      url: '/api/roadmap',
                      desc: 'বাজেট বিশ্লেষণ করে AI রোডম্যাপ জেনারেট করতে'
                    },
                    {
                      method: 'POST',
                      url: '/api/sourcing/:id/comments',
                      desc: 'সোর্সিং পোস্টে মন্তব্য পাঠাতে'
                    }
                  ].map((api, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-900 text-slate-100 flex items-center justify-between gap-3 text-xs font-mono">
                      <div className="flex items-center gap-2.5 overflow-x-auto">
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          api.method === 'GET' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
                        }`}>
                          {api.method}
                        </span>
                        <span className="text-emerald-300 font-bold">{api.url}</span>
                        <span className="text-slate-400 font-sans text-[11px] hidden sm:inline">({api.desc})</span>
                      </div>

                      <button
                        onClick={() => copyToClipboard(api.url, `api-${idx}`)}
                        className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 shrink-0"
                      >
                        {copiedEndpoint === `api-${idx}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 space-y-1">
                  <p className="font-bold text-slate-900">সম্পূর্ণ ডকুমেন্টেশন ফাইল:</p>
                  <p>
                    প্রজেক্টের রুট ডিরেক্টরিতে <code className="bg-white px-1.5 py-0.5 rounded border border-slate-300 font-mono text-emerald-800">/API_DOCUMENTATION.md</code> ফাইলে সম্পূর্ণ রিকোয়েস্ট বডি ও রেসপন্স উদাহরণ সংরক্ষিত আছে।
                  </p>
                </div>
              </div>
          </div>
        )}
      </div>

      {/* Blog Writing Guideline & Formatting Manual Modal */}
      {showGuideline && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowGuideline(false)}>
          <div className="bg-white max-w-2xl w-full rounded-2xl p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto border border-slate-200" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-slate-900 text-lg">ব্লগ রাইটিং গাইডলাইন ও অ্যাডভান্স ফরম্যাটিং ম্যানুয়াল</h3>
              </div>
              <button onClick={() => setShowGuideline(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-500">
                <X className="w-5 h-5" />
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
                onClick={() => setShowGuideline(false)}
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
};
