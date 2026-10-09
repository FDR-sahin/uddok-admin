import React from 'react';
import { Quote, Sparkles, Target, Compass, Award, Building, CheckCircle2 } from 'lucide-react';

export const FounderSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-b from-slate-900 to-slate-950 text-white py-12 sm:py-20 px-4 sm:px-6 rounded-3xl my-8 relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-10 relative z-10">
        
        {/* Section Heading Badge */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800 text-xs font-semibold tracking-wider uppercase">
            <Compass className="w-3.5 h-3.5" />
            আমাদের লক্ষ্য ও প্রতিষ্ঠাতা বার্তা
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-tight">
            তরুণদের উদ্যোক্তা হয়ে উঠতে আমাদের এই প্ল্যাটফর্ম কীভাবে সহযোগিতা করবে?
          </h2>
        </div>

        {/* Narrative Card */}
        <div className="bg-slate-800/60 backdrop-blur-md rounded-3xl border border-slate-700/80 p-6 sm:p-10 space-y-6 shadow-xl">
          <div className="flex items-start gap-4">
            <span className="p-3 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 shrink-0">
              <Quote className="w-6 h-6" />
            </span>
            <div className="space-y-4 text-slate-200 text-sm sm:text-base leading-relaxed">
              <p>
                ধরুন, আপনি একজন স্বপ্নবাজ তরুণ। অনেক কষ্টে কিছু টাকা জমিয়েছেন এবং স্বপ্ন দেখছেন নিজের একটি ছোট ব্যবসা দাঁড় করানোর। কিন্তু মাঠে নামার আগেই মাথায় ঘুরপাক খাচ্ছে এক গাদা প্রশ্ন:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {[
                  'ঠিক কোন পণ্যটি নিয়ে ব্যবসা শুরু করলে ভালো হবে?',
                  'নির্ভরযোগ্য সোর্সিং লোকেশন বা পাইকারি বাজার কোথায়?',
                  'পণ্যগুলোর আসল পাইকারি দাম কত?',
                  'সব খরচ বাদ দিয়ে কত টাকা লাভ বা প্রফিট মার্জিন রাখা উচিত?'
                ].map((q, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-700/60 text-xs sm:text-sm text-emerald-300 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span>{q}</span>
                  </div>
                ))}
              </div>

              <p className="pt-2">
                আশেপাশে নির্ভরযোগ্য উত্তরের অভাবে আপনার মতো বাংলাদেশের হাজারো তরুণ উদ্যোক্তা হওয়ার স্বপ্ন নিয়ে দ্বিধায় ভোগেন। প্রবল ইচ্ছা আর কিছু পুঁজি থাকার পরও শুধু সঠিক তথ্য, যাচাইকৃত সোর্সিং লোকেশন এবং একটি বাস্তবসম্মত পরিকল্পনার অভাবে অনেকেই শুরুতে আটকে যান কিংবা মাঝপথে হাল ছেড়ে দেন।
              </p>

              <p>
                নতুন উদ্যোক্তাদের এই অনিশ্চয়তা দূর করতে এবং ব্যবসা শুরুর পথকে মসৃণ করতেই যাত্রা শুরু করেছে আমাদের প্ল্যাটফর্ম। আমরা বিশ্বাস করি, সঠিক তথ্য আর দিকনির্দেশনা পেলে আপনার জমানো ছোট পুঁজি থেকেই গড়ে উঠতে পারে সফল একটি উদ্যোগ। এই প্ল্যাটফর্মটি হবে আপনার ব্যবসা শুরুর প্রথম ও সবচেয়ে বিশ্বস্ত গাইডলাইন!
              </p>
            </div>
          </div>

          {/* Key 3 Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-700/80">
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase">
                <Target className="w-4 h-4" />
                বাজেট অনুযায়ী রোডম্যাপ
              </div>
              <p className="text-xs text-slate-300 leading-normal">
                ৫ হাজার, ১০ হাজার বা ৫০ হাজার— আপনার সামর্থ্য অনুযায়ী পণ্য নির্বাচন ও বাজেট বণ্টনের বিজ্ঞানসম্মত পরিকল্পনা।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase">
                <Building className="w-4 h-4" />
                যাচাইকৃত সোর্সিং হাব
              </div>
              <p className="text-xs text-slate-300 leading-normal">
                বিভিন্ন জেলার আসল পাইকারি বাজার, সুনির্দিষ্ট ঠিকানা, গুগল ম্যাপ এবং মিনিমাম অর্ডার কোয়ান্টিটি (MOQ)।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase">
                <Award className="w-4 h-4" />
                সিদ্ধান্ত নেওয়ার বিশ্বস্ত স্থান
              </div>
              <p className="text-xs text-slate-300 leading-normal">
                কমিউনিটির মাধ্যমে ফিল্ড তথ্য যাচাই এবং ভেরিফিকেশন স্ট্যাটাস দিয়ে ভুল সিদ্ধান্তের আর্থিক ঝুঁকি কমানো।
              </p>
            </div>
          </div>

          {/* Quote conclusion & Founder Signature */}
          <div className="pt-4 border-t border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <blockquote className="text-sm font-semibold text-emerald-300 italic">
              "আপনার বাজেট ছোট হতে পারে, কিন্তু আপনার শুরুটা হতে পারে একদম গোছানো ও পরিকল্পিত।"
            </blockquote>

            <div className="text-left sm:text-right shrink-0">
              <h4 className="font-extrabold text-base text-white">
                MD. Delowar Hossen (Mithun)
              </h4>
              <p className="text-xs font-medium text-emerald-400">
                Founder & CEO at Regards Tech
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
