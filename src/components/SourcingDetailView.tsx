import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Tag, 
  ExternalLink, 
  ThumbsUp, 
  ThumbsDown, 
  Bookmark, 
  Share2, 
  ArrowLeft, 
  MessageSquare, 
  Send, 
  AlertCircle,
  Phone,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { Comment, SourcingIdea } from '../types';

interface SourcingDetailViewProps {
  idea: SourcingIdea;
  onBack: () => void;
  onLike: (id: string, type: 'like' | 'dislike') => void;
  onAddComment: (id: string, authorName: string, text: string) => void;
}

export const SourcingDetailView: React.FC<SourcingDetailViewProps> = ({
  idea,
  onBack,
  onLike,
  onAddComment
}) => {
  const [commentText, setCommentText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const profit = idea.retailPrice - idea.wholesalePrice;
  const profitMarginPercent = idea.retailPrice > 0 ? Math.round((profit / idea.retailPrice) * 100) : 0;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(idea.id, authorName || 'উদ্যোক্তা ভিজিটর', commentText.trim());
    setCommentText('');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const encodedMapLocation = encodeURIComponent(`${idea.exactLocation}, ${idea.district}, Bangladesh`);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${idea.coordinates.lat},${idea.coordinates.lng}`;
  const embedMapUrl = `https://maps.google.com/maps?q=${idea.coordinates.lat},${idea.coordinates.lng}&hl=bn&z=14&output=embed`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      
      {/* Top Back & Breadcrumb navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500 pb-2 border-b border-slate-200">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 font-medium text-slate-700 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          পেছনে ফিরে যান
        </button>

        {/* Breadcrumb matching user screenshot */}
        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 overflow-x-auto">
          <span className="hover:text-emerald-600 cursor-pointer" onClick={onBack}>হোম</span>
          <span>&gt;</span>
          <span className="hover:text-emerald-600 cursor-pointer">{idea.district} বিভাগ</span>
          <span>&gt;</span>
          <span className="hover:text-emerald-600 cursor-pointer">{idea.upazilaOrArea || idea.district}</span>
          <span>&gt;</span>
          <span className="font-semibold text-slate-800 truncate max-w-[180px] sm:max-w-xs">{idea.title}</span>
        </div>
      </div>

      {/* Main Title & Metadata Badges */}
      <div className="space-y-3">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {idea.title}
        </h1>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
          {idea.isVerified ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 font-semibold border border-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {idea.verificationBadgeText || 'ভেরিফায়েড প্রজেক্ট'}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 font-semibold border border-amber-300">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              কমিউনিটি পর্যালোচনায়
            </span>
          )}

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            {idea.lastUpdated}
          </span>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {idea.upazilaOrArea}, {idea.district}
          </span>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            {idea.category}
          </span>
        </div>
      </div>

      {/* দাম ও লাভ (Pricing & Margin Section - Exact Match with Screenshot) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-slate-800">দাম ও লাভ</h2>
          <span className="text-xs text-slate-500 font-medium">ন্যূনতম অর্ডার (MOQ): <strong className="text-slate-800">{idea.moq}</strong></span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {/* Wholesale Price Box */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
              <span>পাইকারি দাম</span>
              <span className="p-1 rounded-md bg-emerald-50 text-emerald-600">
                <ShoppingBag className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              ৳ {idea.wholesalePrice.toLocaleString('bn-BD')}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">{idea.unit}</p>
          </div>

          {/* Retail Price Box */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
              <span>খুচরা দাম</span>
              <span className="p-1 rounded-md bg-teal-50 text-teal-600">
                <Tag className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              ৳ {idea.retailPrice.toLocaleString('bn-BD')}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">সম্ভাব্য বিক্রয় মূল্য</p>
          </div>

          {/* Profit Margin Box */}
          <div className="bg-emerald-50/70 rounded-xl border border-emerald-200 p-4 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-800 mb-1">
              <span>প্রফিট / লাভ</span>
              <span className="p-1 rounded-md bg-emerald-100 text-emerald-700">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700">
              ৳ {profit.toLocaleString('bn-BD')}
            </div>
            <p className="text-[11px] text-emerald-700 font-medium mt-0.5">মার্জিন: প্রায় {profitMarginPercent}%</p>
          </div>
        </div>
      </div>

      {/* Sourcing Hub & Interactive Map Container (Exact Screenshot Layout) */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        
        {/* Top Header of Map Container */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                অনলাইন ও অফলাইনে লোকাল সোর্সিং হাব
              </h3>
              <p className="text-xs text-slate-500">
                সরাসরি বাজার বা আড়তের ফিজিক্যাল পয়েন্ট
              </p>
            </div>
          </div>

          <span className="text-xs bg-slate-100 text-slate-600 font-medium px-2.5 py-1 rounded-md border border-slate-200">
            {idea.upazilaOrArea}, {idea.district}
          </span>
        </div>

        {/* Exact Location Address Card */}
        <div className="p-4 sm:p-5 bg-slate-50/60 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">
                নির্দিষ্ট সোর্সিং ঠিকানা
              </span>
              <p className="text-sm sm:text-base font-semibold text-slate-800 leading-snug">
                {idea.exactLocation}
              </p>
              <p className="text-xs text-slate-500">
                অক্ষাংশ ও দ্রাঘিমাংশ: {idea.coordinates.lat.toFixed(4)}, {idea.coordinates.lng.toFixed(4)}
              </p>
            </div>
          </div>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all shrink-0 cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            গুগল ম্যাপে দেখুন
          </a>
        </div>

        {/* Embedded Interactive Google Map Iframe */}
        <div className="relative w-full h-72 sm:h-96 bg-slate-100">
          <iframe
            title={`Map of ${idea.title}`}
            src={embedMapUrl}
            className="w-full h-full border-0"
            loading="lazy"
            allowFullScreen
          />
          {/* Direct Map Float Pin overlay */}
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-200 shadow-md flex items-center gap-2 text-xs font-semibold text-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>{idea.upazilaOrArea || idea.district} সোর্সিং জোন</span>
            <a 
              href={googleMapsUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-emerald-700 underline text-[11px] hover:text-emerald-800 ml-1"
            >
              Open in Maps
            </a>
          </div>
        </div>
      </div>

      {/* Engagement Buttons Bar (লাইক, ডিসলাইক, সেভ, শেয়ার) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 bg-white rounded-xl border border-slate-200">
        <div className="flex items-center gap-2">
          {/* Like */}
          <button
            onClick={() => onLike(idea.id, 'like')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 text-slate-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            <ThumbsUp className="w-4 h-4 text-emerald-600" />
            <span>লাইক ({idea.likes})</span>
          </button>

          {/* Dislike */}
          <button
            onClick={() => onLike(idea.id, 'dislike')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            <ThumbsDown className="w-4 h-4 text-slate-400" />
            <span>ডিসলাইক ({idea.dislikes})</span>
          </button>

          {/* Save */}
          <button
            onClick={() => setSaved(!saved)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              saved 
                ? 'bg-amber-50 text-amber-800 border-amber-300' 
                : 'border-slate-200 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'text-amber-600 fill-amber-600' : 'text-slate-500'}`} />
            <span>{saved ? 'সংরক্ষিত' : 'সেভ'}</span>
          </button>
        </div>

        {/* Share */}
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
        >
          <Share2 className="w-4 h-4 text-slate-600" />
          <span>{copied ? 'লিংক কপি হয়েছে!' : 'শেয়ার'}</span>
        </button>
      </div>

      {/* বিবরণ (Description & Sourcing Advice) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900">বিবরণ</h2>
        
        <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal whitespace-pre-line">
          {idea.description}
        </p>

        {idea.supplierTip && (
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 space-y-1">
            <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              অভিজ্ঞ উদ্যোক্তার টিপস ও দরকষাকষির কৌশল:
            </h4>
            <p className="text-xs sm:text-sm text-amber-800 leading-normal">
              {idea.supplierTip}
            </p>
          </div>
        )}

        {idea.contactNumber && (
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 pt-1">
            <Phone className="w-4 h-4 text-emerald-600" />
            <span>যোগাযোগ রেফারেন্স: <strong>{idea.contactNumber}</strong> (সরাসরি যাওয়ার পূর্বে কল করে সময় জেনে নিন)</span>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          {idea.tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer transition-colors"
            >
              {tag}
            </span>
          ))}
          <button 
            onClick={() => alert('ধন্যবাদ! আপনার রিপোর্টটি আমাদের অ্যাডমিন রিভিউ করবে।')}
            className="text-xs text-rose-500 hover:underline ml-auto font-medium"
          >
            রিপোর্ট করুন
          </button>
        </div>
      </div>

      {/* মন্তব্য (Comments Section - Exact Structure in Screenshot) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-5 shadow-xs">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-slate-900">
            মন্তব্য ({idea.comments?.length || 0})
          </h2>
        </div>

        {/* Add comment input form */}
        <form onSubmit={handleCommentSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="আপনার নাম বা ব্র্যান্ড..."
              className="sm:w-1/3 px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-emerald-500 outline-none"
            />
            <div className="relative flex-1">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="মন্তব্য করার জন্য কিছু লিখুন..."
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none pr-24"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                পাঠিয়ে দিন
              </button>
            </div>
          </div>
        </form>

        {/* Threaded Comments List */}
        <div className="space-y-4 pt-2">
          {idea.comments && idea.comments.length > 0 ? (
            idea.comments.map((comment) => (
              <div 
                key={comment.id}
                className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                      {comment.authorName.slice(0, 1)}
                    </div>
                    <div>
                      <span className="font-bold text-xs sm:text-sm text-slate-900">
                        {comment.authorName}
                      </span>
                      {comment.authorRole && (
                        <span className="text-[10px] font-medium bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded-sm ml-1.5">
                          {comment.authorRole}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {comment.createdAt}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 pl-9">
                  {comment.comment}
                </p>

                <div className="pl-9 flex items-center gap-3 text-xs text-slate-500 pt-1">
                  <button className="flex items-center gap-1 hover:text-emerald-700">
                    <ThumbsUp className="w-3 h-3" />
                    <span>{comment.likes}</span>
                  </button>
                  <button 
                    onClick={() => {
                      setCommentText(`@${comment.authorName} `);
                    }}
                    className="hover:text-emerald-700 font-medium"
                  >
                    রিপ্লাই
                  </button>
                </div>

                {/* Sub replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="pl-6 sm:pl-9 mt-2 space-y-2 border-l-2 border-emerald-300">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="p-2.5 rounded-lg bg-white border border-slate-200/70 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-800">
                            {reply.authorName}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {reply.createdAt}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700">
                          {reply.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-400 italic text-center py-4">
              এখনো কোনো মন্তব্য নেই। প্রথম মন্তব্যটি আপনিই করুন!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
