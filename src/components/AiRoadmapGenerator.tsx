import React, { useState } from 'react';
import { 
  Sparkles, 
  Wallet, 
  MapPin, 
  Tag, 
  Store, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Package, 
  Truck, 
  Download, 
  Printer, 
  RefreshCw,
  Compass
} from 'lucide-react';
import { BusinessRoadmap, RoadmapRequest } from '../types';
import { generateSmartLocalRoadmap } from '../services/roadmapGenerator';

const DISTRICTS = [
  'ঢাকা', 'চট্টগ্রাম', 'বগুড়া', 'নরসিংদী', 'রাজশাহী', 'সিলেট', 'যশোর', 
  'খুলনা', 'রংপুর', 'ময়মনসিংহ', 'কুমিল্লা', 'গাজীপুর', 'নারায়ণগঞ্জ', 
  'টাঙ্গাইল', 'কিশোরগঞ্জ', 'ফরিদপুর', 'দিনাজপুর', 'নোয়াখালী', 'বরিশাল'
];

const CATEGORIES = [
  'পোশাক ও ফ্যাশন',
  'খাবার ও দুগ্ধ (ডেইরি)',
  'কৃষি ও অর্গানিক খাদ্য',
  'জুয়েলারি ও ট্রেন্ডি এক্সেসরিজ',
  'চামড়াজাত ও ফুটওয়্যার',
  'কসমেটিক্স ও স্কিনকেয়ার',
  'হ্যান্ডিক্রাফট ও হোম ডেকোর',
  'ইলেকট্রনিক্স ও গ্যাজেট'
];

export const AiRoadmapGenerator: React.FC = () => {
  const [budget, setBudget] = useState<number>(10000);
  const [customBudget, setCustomBudget] = useState<string>('');
  const [location, setLocation] = useState<string>('ঢাকা');
  const [category, setCategory] = useState<string>('পোশাক ও ফ্যাশন');
  const [businessType, setBusinessType] = useState<'online' | 'offline' | 'hybrid'>('online');
  const [loading, setLoading] = useState<boolean>(false);
  const [roadmap, setRoadmap] = useState<BusinessRoadmap | null>(null);

  const budgetPresets = [5000, 10000, 20000, 50000, 100000];

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const effectiveBudget = customBudget ? parseInt(customBudget, 10) || 10000 : budget;
    
    setLoading(true);
    setRoadmap(null);

    try {
      // First try backend server route if available
      const response = await fetch('/api/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          budget: effectiveBudget,
          location,
          category,
          businessType
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.roadmap) {
          setRoadmap(data.roadmap);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      // fallback smoothly to local expert generator
      console.log('Using local intelligent roadmap engine');
    }

    // Local smart generation fallback
    setTimeout(() => {
      const generated = generateSmartLocalRoadmap({
        budget: effectiveBudget,
        location,
        category,
        businessType
      });
      setRoadmap(generated);
      setLoading(false);
    }, 700);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      
      {/* Intro Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          AI বিজনেস রোডম্যাপ ইঞ্জিন
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          আপনার বাজেট ও পছন্দের ওপর ভিত্তি করে ব্যক্তিগত রোডম্যাপ
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          সব উদ্যোক্তার বাজেট এক নয়। কেউ ৫ হাজার টাকা দিয়ে শুরু করতে চান, কেউ ২০ হাজার, আবার কারও বাজেট ১ লাখ টাকা। নিচের তথ্যগুলো দিন, AI আপনার জন্য একটি সুনির্দিষ্ট পরিকল্পনা সাজিয়ে দেবে।
        </p>
      </div>

      {/* Generator Form */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-8 shadow-sm">
        <form onSubmit={handleGenerate} className="space-y-6">
          
          {/* Budget Selection */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <Wallet className="w-4 h-4 text-emerald-600" />
              আপনার শুরুর বাজেট কত টাকা?
            </label>

            {/* Presets */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {budgetPresets.map((amt) => {
                const isSelected = !customBudget && budget === amt;
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setBudget(amt);
                      setCustomBudget('');
                    }}
                    className={`py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    ৳ {amt.toLocaleString('bn-BD')}
                  </button>
                );
              })}
            </div>

            {/* Custom Budget input */}
            <div className="pt-1">
              <input
                type="number"
                value={customBudget}
                onChange={(e) => setCustomBudget(e.target.value)}
                placeholder="অথবা অন্য কোনো বাজেট লিখুন (যেমন: ১৫০০০)"
                className="w-full px-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-500 outline-none text-slate-800"
              />
            </div>
          </div>

          {/* District & Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* District */}
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-800">
                <MapPin className="w-4 h-4 text-emerald-600" />
                আপনার জেলা বা বর্তমান লোকেশন
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-500 outline-none bg-white text-slate-800"
              >
                {DISTRICTS.map((dist) => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-800">
                <Tag className="w-4 h-4 text-emerald-600" />
                আগ্রহের ক্যাটাগরি
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-500 outline-none bg-white text-slate-800"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Business Type */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-800">
              <Store className="w-4 h-4 text-emerald-600" />
              ব্যবসার মডেল বা ধরন
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'online', label: 'অনলাইন (ফেসবুক/ই-কমার্স)' },
                { id: 'offline', label: 'অফলাইন (ডেলিভারি/লোকাল)' },
                { id: 'hybrid', label: 'হাইব্রিড (অনলাইন + অফলাইন)' }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setBusinessType(item.id as any)}
                  className={`py-2 px-2 rounded-xl border text-[11px] sm:text-xs font-semibold transition-all cursor-pointer ${
                    businessType === item.id
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-sm sm:text-base shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>AI আপনার জন্য বিশ্লেষণ করছে...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>আমার এআই বিজনেস রোডম্যাপ তৈরি করুন</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Generated Roadmap Output Display */}
      {roadmap && (
        <div className="bg-white rounded-3xl border border-emerald-200 p-5 sm:p-8 space-y-8 shadow-md animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          {/* Top Roadmap Title & Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-100 px-3 py-1 rounded-full">
                রেডি এআই রোডম্যাপ
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
                {roadmap.ideaTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                {roadmap.summary}
              </p>
            </div>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold shrink-0 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              প্রিন্ট বা সেভ করুন
            </button>
          </div>

          {/* Sourcing & Recommended Product Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase">
                প্রস্তাবিত পণ্য (Primary Product)
              </span>
              <p className="text-base font-bold text-slate-900">
                {roadmap.recommendedProduct}
              </p>
              <p className="text-xs text-slate-600">
                শুরুতে একাধিক প্রোডাক্টে ফোকাস না করে একটি সিঙ্গেল হিরো প্রোডাক্ট নিয়ে যাত্রা শুরু করুন।
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase">
                সম্ভাব্য সোর্সিং হাব (Location Hub)
              </span>
              <p className="text-base font-bold text-slate-900">
                {roadmap.suggestedDistrictHub}
              </p>
              <p className="text-xs text-slate-600">
                স্থানীয় পরিচিত আড়ত বা আমাদের প্ল্যাটফর্মের ভেরিফায়েড তালিকা থেকে তথ্য নিন।
              </p>
            </div>
          </div>

          {/* Budget Breakdown (১. পণ্য কেনার জন্য সম্ভাব্য বাজেট বণ্টন) */}
          <div className="space-y-3">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-600" />
              বাজেট বণ্টন ম্যাট্রিক্স (Budget Allocation)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {roadmap.budgetBreakdown.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                    <span>{item.category}</span>
                    <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">{item.percentage}%</span>
                  </div>
                  <div className="text-xl font-extrabold text-slate-900">
                    ৳ {item.amount.toLocaleString('bn-BD')}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    {item.note}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing, Costing & Margin (২. সম্ভাব্য বিক্রয়মূল্য বা প্রফিট মার্জিন) */}
          <div className="p-5 sm:p-6 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-emerald-950 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-700" />
              কস্টিং ও আনুমানিক প্রফিট মার্জিন
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-white rounded-xl border border-emerald-200">
                <span className="text-[11px] text-slate-500 font-medium">পাইকারি কেনা রেট</span>
                <p className="text-lg font-extrabold text-slate-900">৳ {roadmap.pricing.estimatedPurchaseCost}</p>
                <span className="text-[10px] text-slate-400">{roadmap.pricing.unit}</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-emerald-200">
                <span className="text-[11px] text-slate-500 font-medium">সম্ভাব্য বিক্রয় রেট</span>
                <p className="text-lg font-extrabold text-slate-900">৳ {roadmap.pricing.estimatedSellingPrice}</p>
                <span className="text-[10px] text-slate-400">{roadmap.pricing.unit}</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-emerald-200">
                <span className="text-[11px] text-emerald-700 font-medium">ইউনিট প্রতি লাভ</span>
                <p className="text-lg font-extrabold text-emerald-700">৳ {roadmap.pricing.profitMarginPerUnit}</p>
                <span className="text-[10px] text-emerald-600 font-bold">({roadmap.pricing.profitPercentage}% মার্জিন)</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-emerald-200">
                <span className="text-[11px] text-slate-500 font-medium">মিনিমাম লট (MOQ)</span>
                <p className="text-xs font-bold text-slate-800 mt-2">{roadmap.pricing.moqAdvice}</p>
              </div>
            </div>
          </div>

          {/* Packaging & Delivery (৩. প্যাকেজিং ও ডেলিভারি খরচের ধারণা) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Package className="w-4 h-4 text-emerald-600" />
                প্যাকেজিং নির্দেশনা ও খরচ
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {roadmap.packagingAndDelivery.packagingAdvice}
              </p>
              <span className="text-xs font-semibold text-emerald-700 block">
                আনুমানিক প্যাকেজিং খরচ: ৳ {roadmap.packagingAndDelivery.packagingCostPerUnit} / ইউনিট
              </span>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-600" />
                ডেলিভারি স্ট্র্যাটেজি
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {roadmap.packagingAndDelivery.deliveryStrategy}
              </p>
              <span className="text-xs text-slate-500 font-medium block">
                টিপস: ঢাকার বাইরে ডেলিভারি চার্জ অগ্রিম নিন যাতে কাস্টমার পার্সেল না নিলে লস না হয়।
              </span>
            </div>
          </div>

          {/* Marketing Plan (৪. প্রাথমিক মার্কেটিং বা প্রচারণার প্ল্যান) */}
          <div className="space-y-3">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              প্রাথমিক মার্কেটিং ও প্রচারণার প্ল্যান
            </h3>
            <div className="space-y-2">
              {roadmap.marketingPlan.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs sm:text-sm text-slate-800">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Risks & Next Steps (৫. সম্ভাব্য ঝুঁকি এবং পরবর্তী করণীয়) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Risks */}
            <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-2.5">
              <h4 className="text-sm font-bold text-rose-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                ব্যবসার সম্ভাব্য ঝুঁকিগুলো
              </h4>
              <ul className="space-y-1.5 text-xs text-rose-950">
                {roadmap.potentialRisks.map((risk, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Next Steps */}
            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2.5">
              <h4 className="text-sm font-bold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                পরবর্তী করণীয় (Next Steps)
              </h4>
              <ul className="space-y-1.5 text-xs text-emerald-950">
                {roadmap.nextSteps.map((next, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{next}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Advisory Note */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
            <strong>সতর্কীকরণ ও পরামর্শ:</strong> এআই-জেনারেটেড এই রোডম্যাপটি একটি প্রাথমিক গাইডলাইন হিসেবে কাজ করবে। চূড়ান্ত সিদ্ধান্ত নেওয়ার আগে আপনাকে অবশ্যই স্থানীয় বাজার ও সাপ্লায়ার-সংক্রান্ত তথ্য নিজে যাচাই করে নিতে হবে।
          </div>
        </div>
      )}
    </div>
  );
};
