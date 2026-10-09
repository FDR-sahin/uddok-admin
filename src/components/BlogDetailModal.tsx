import React from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  Tag, 
  CheckCircle2, 
  Share2, 
  Bookmark, 
  ArrowRight,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { BlogPost } from '../types';

interface BlogDetailModalProps {
  blog: BlogPost | null;
  onClose: () => void;
  onSelectCategory?: (cat: string) => void;
}

export const BlogDetailModal: React.FC<BlogDetailModalProps> = ({ blog, onClose, onSelectCategory }) => {
  if (!blog) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.excerpt,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${blog.title} - ${window.location.href}`);
      alert('ব্লগের লিংক কপি করা হয়েছে!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <BookOpen className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-emerald-800 tracking-wide uppercase">
              উদ্যোক্তা গাইডলাইন ও ব্লগ
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 sm:p-8 space-y-6 max-h-[82vh] overflow-y-auto">
          
          {/* Category & Read Time */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
              {blog.category}
            </span>
            <span className="flex items-center gap-1 text-slate-500">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {blog.readTime} পড়ার সময়
            </span>
            <span className="flex items-center gap-1 text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {blog.date}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
            {blog.title}
          </h1>

          {/* Author Block */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                {blog.author.slice(0, 1)}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{blog.author}</p>
                <p className="text-xs text-slate-500">{blog.authorTitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleShare}
                title="শেয়ার করুন"
                className="p-2 rounded-lg hover:bg-white text-slate-600 hover:text-emerald-700 border border-slate-200 text-xs flex items-center gap-1 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">শেয়ার</span>
              </button>
            </div>
          </div>

          {/* Excerpt Lead */}
          <div className="p-4 rounded-xl bg-emerald-50/50 border-l-4 border-emerald-600 text-sm sm:text-base text-slate-700 font-medium italic">
            "{blog.excerpt}"
          </div>

          {/* Main Rich Content */}
          <div className="text-slate-800 text-sm sm:text-base leading-relaxed space-y-4 font-normal">
            {blog.content.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={index} className="text-lg sm:text-xl font-bold text-slate-900 pt-3">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('```')) {
                const code = paragraph.replace(/```/g, '').trim();
                return (
                  <div key={index} className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs sm:text-sm overflow-x-auto">
                    {code}
                  </div>
                );
              }
              if (paragraph.startsWith('> ')) {
                return (
                  <blockquote key={index} className="pl-4 border-l-2 border-emerald-500 text-slate-700 italic my-2">
                    {paragraph.replace('> ', '')}
                  </blockquote>
                );
              }
              return (
                <p key={index} className="whitespace-pre-line text-slate-700 leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Key Bullet Takeaways */}
          {blog.bulletPoints && blog.bulletPoints.length > 0 && (
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2.5">
              <h4 className="text-sm font-bold text-amber-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                গুরুত্বপূর্ণ শিক্ষা ও টেক-অ্যাওয়ে (Key Takeaways):
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm text-amber-950">
                {blog.bulletPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Checklist */}
          {blog.actionChecklist && blog.actionChecklist.length > 0 && (
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
              <h4 className="text-sm font-bold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                আপনার জন্য করণীয় চেকলিস্ট (Action Checklist):
              </h4>
              <div className="space-y-2 text-xs sm:text-sm text-emerald-950">
                {blog.actionChecklist.map((task, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-white/80 border border-emerald-200/60">
                    <input 
                      type="checkbox" 
                      id={`check-${idx}`} 
                      className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer" 
                    />
                    <label htmlFor={`check-${idx}`} className="cursor-pointer font-medium">
                      {task}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-400 font-semibold">ট্যাগ:</span>
              {blog.tags.map((tag, idx) => (
                <span key={idx} className="text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 font-medium">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Bottom Close Button */}
          <div className="pt-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors cursor-pointer"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
