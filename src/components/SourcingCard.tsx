import React from 'react';
import { 
  MapPin, 
  Tag, 
  CheckCircle2, 
  Sparkles, 
  MessageSquare, 
  ThumbsUp, 
  ExternalLink,
  ShoppingBag,
  TrendingUp
} from 'lucide-react';
import { SourcingIdea } from '../types';

interface SourcingCardProps {
  idea: SourcingIdea;
  onSelect: (idea: SourcingIdea) => void;
  onLike: (id: string, type: 'like' | 'dislike') => void;
}

export const SourcingCard: React.FC<SourcingCardProps> = ({ idea, onSelect, onLike }) => {
  const profit = idea.retailPrice - idea.wholesalePrice;
  const profitMargin = idea.retailPrice > 0 ? Math.round((profit / idea.retailPrice) * 100) : 0;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${idea.coordinates.lat},${idea.coordinates.lng}`;

  return (
    <div 
      className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden group cursor-pointer"
      onClick={() => onSelect(idea)}
    >
      <div>
        {/* Card Header & Badges */}
        <div className="p-4 sm:p-5 pb-3">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 flex items-center gap-1">
              <Tag className="w-3 h-3 text-slate-500" />
              {idea.category}
            </span>

            {idea.isVerified ? (
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-300/80">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                ভেরিফায়েড
              </span>
            ) : (
              <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                পর্যালোচনায়
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-extrabold text-slate-900 text-base sm:text-lg group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
            {idea.title}
          </h3>

          {/* Location Line */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate font-medium">{idea.upazilaOrArea}, {idea.district}</span>
          </div>
        </div>

        {/* Pricing & Profit 3-Column Strip */}
        <div className="mx-4 sm:mx-5 p-3 rounded-xl bg-slate-50 border border-slate-100 grid grid-cols-3 gap-2 text-center">
          <div>
            <span className="text-[10px] font-medium text-slate-500 block">পাইকারি দাম</span>
            <span className="text-sm sm:text-base font-bold text-slate-900 block">
              ৳ {idea.wholesalePrice}
            </span>
            <span className="text-[9px] text-slate-400 block truncate">{idea.unit}</span>
          </div>

          <div className="border-x border-slate-200/80 px-1">
            <span className="text-[10px] font-medium text-slate-500 block">খুচরা দাম</span>
            <span className="text-sm sm:text-base font-bold text-slate-900 block">
              ৳ {idea.retailPrice}
            </span>
            <span className="text-[9px] text-slate-400 block">বিক্রয়</span>
          </div>

          <div>
            <span className="text-[10px] font-semibold text-emerald-700 block">সম্ভাব্য লাভ</span>
            <span className="text-sm sm:text-base font-extrabold text-emerald-700 block">
              +৳ {profit}
            </span>
            <span className="text-[9px] text-emerald-600 font-semibold block">({profitMargin}%)</span>
          </div>
        </div>

        {/* Short excerpt description */}
        <p className="px-4 sm:px-5 pt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {idea.description}
        </p>
      </div>

      {/* Card Footer Actions */}
      <div className="p-4 sm:p-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-3">
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onLike(idea.id, 'like');
            }}
            className="flex items-center gap-1 hover:text-emerald-700 font-medium"
          >
            <ThumbsUp className="w-3.5 h-3.5 text-slate-400 hover:text-emerald-600" />
            <span>{idea.likes}</span>
          </button>

          <span className="flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
            <span>{idea.comments?.length || 0}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* External Map button */}
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            title="গুগল ম্যাপে লোকেশন দেখুন"
            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button 
            type="button"
            className="px-3 py-1.5 rounded-lg bg-emerald-600 group-hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center gap-1"
          >
            ম্যাপ ও বিবরণ
          </button>
        </div>
      </div>
    </div>
  );
};
