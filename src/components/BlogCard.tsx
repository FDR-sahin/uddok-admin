import React from 'react';
import { Clock, Calendar, ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { BlogPost } from '../types';

interface BlogCardProps {
  blog: BlogPost;
  indexNumber: number;
  onSelect: (blog: BlogPost) => void;
}

export const BlogCard: React.FC<BlogCardProps> = ({ blog, indexNumber, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(blog)}
      className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-400 hover:shadow-lg transition-all duration-200 p-5 sm:p-6 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
    >
      {/* Top index & category strip */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center justify-center">
              {indexNumber}
            </span>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200/70">
              {blog.category}
            </span>
          </div>

          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
            <Clock className="w-3 h-3" />
            {blog.readTime}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-extrabold text-slate-900 text-base sm:text-lg group-hover:text-emerald-700 transition-colors leading-snug line-clamp-2 mb-2">
          {blog.title}
        </h3>

        {/* Excerpt */}
        <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed mb-4">
          {blog.excerpt}
        </p>
      </div>

      {/* Footer Info & Read prompt */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="font-semibold text-slate-700 truncate max-w-[140px]">
          {blog.author}
        </span>

        <span className="text-emerald-700 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
          বিস্তারিত পড়ুন
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};
