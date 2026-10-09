import React, { useState } from 'react';
import { X, PlusCircle, MapPin, Tag, CheckCircle2, ShoppingBag } from 'lucide-react';

interface PostIdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (idea: any) => void;
}

export const PostIdeaModal: React.FC<PostIdeaModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('পোশাক');
  const [district, setDistrict] = useState('ঢাকা');
  const [upazila, setUpazila] = useState('');
  const [exactLocation, setExactLocation] = useState('');
  const [wholesalePrice, setWholesalePrice] = useState<number | ''>('');
  const [retailPrice, setRetailPrice] = useState<number | ''>('');
  const [unit, setUnit] = useState('প্রতি পিস');
  const [moq, setMoq] = useState('১০ পিস');
  const [description, setDescription] = useState('');
  const [supplierTip, setSupplierTip] = useState('');
  const [authorName, setAuthorName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !wholesalePrice || !retailPrice || !exactLocation) {
      alert('দয়া করে শিরোনাম, নির্দিষ্ট ঠিকানা, পাইকারি দাম ও বিক্রয়মূল্য লিখুন।');
      return;
    }

    onSubmit({
      title,
      category,
      district,
      upazilaOrArea: upazila || district,
      exactLocation,
      coordinates: {
        lat: 23.8103,
        lng: 90.4125
      },
      wholesalePrice: Number(wholesalePrice),
      retailPrice: Number(retailPrice),
      unit,
      moq,
      isVerified: false,
      verificationBadgeText: 'কমিউনিটি পর্যালোচনায়',
      description,
      supplierTip,
      tags: [`#${district}`, `#${category}`, '#সোর্সিং'],
      postedBy: {
        name: authorName || 'কমিউনিটি সদস্য',
        role: 'উদ্যোক্তা',
        isVerifiedUser: false
      }
    });

    onClose();
    alert('ধন্যবাদ! আপনার দেওয়া সোর্সিং তথ্যটি সফলভাবে জমা হয়েছে। এটি পর্যালোচনার পর ভেরিফায়েড ব্যাজ পাবে।');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 bg-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-emerald-200" />
            <h3 className="font-extrabold text-base sm:text-lg">
              নতুন বিজনেস আইডিয়া ও সোর্সিং পয়েন্ট শেয়ার করুন
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-emerald-800 text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs sm:text-sm">
          <div className="space-y-1">
            <label className="font-bold text-slate-700">পোস্টের শিরোনাম (Title) *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="যেমন: সাভারের লোকাল তরল দুধ পাইকারি সোর্সিং"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">ক্যাটাগরি *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white"
              >
                <option value="পোশাক">পোশাক ও ফ্যাশন</option>
                <option value="খাবার ও দুগ্ধ">খাবার ও দুগ্ধ</option>
                <option value="কৃষি">কৃষি ও এগ্রো</option>
                <option value="পোশাক ও গহনা">জুয়েলারি ও এক্সেসরিজ</option>
                <option value="চামড়াজাত">চামড়াজাত পণ্য</option>
                <option value="কসমেটিক্স">কসমেটিক্স ও বিউটি</option>
                <option value="অন্যান্য">অন্যান্য পণ্য</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">জেলা (District) *</label>
              <input
                type="text"
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="যেমন: ঢাকা, বগুড়া, নরসিংদী"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">উপজেলা বা এরিয়া</label>
              <input
                type="text"
                value={upazila}
                onChange={(e) => setUpazila(e.target.value)}
                placeholder="যেমন: সাভার, চকবাজার"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">আপনার নাম</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="যেমন: তানভীর আহমেদ"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">নির্দিষ্ট সোর্সিং ঠিকানা বা বাজারের নাম (Exact Location) *</label>
            <input
              type="text"
              required
              value={exactLocation}
              onChange={(e) => setExactLocation(e.target.value)}
              placeholder="যেমন: সাভার পৌরসভা রোড, বংশী নদীর ঘাট সংলগ্ন খামারি সমিতি আড়ত"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">পাইকারি দাম (৳) *</label>
              <input
                type="number"
                required
                value={wholesalePrice}
                onChange={(e) => setWholesalePrice(e.target.value ? Number(e.target.value) : '')}
                placeholder="৬৫"
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">খুচরা দাম (৳) *</label>
              <input
                type="number"
                required
                value={retailPrice}
                onChange={(e) => setRetailPrice(e.target.value ? Number(e.target.value) : '')}
                placeholder="১০০"
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">পরিমাপের ইউনিট</label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="প্রতি লিটার"
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">মিনিমাম লট (MOQ)</label>
              <input
                type="text"
                value={moq}
                onChange={(e) => setMoq(e.target.value)}
                placeholder="২০ লিটার"
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">সোর্সিং বিবরণ ও পরামর্শ</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="পণ্য কীভাবে সংগ্রহ করতে হবে, কোয়ালিটি কেমন ইত্যাদি..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">সাপ্লায়ারের সাথে কথা বলার টিপস (যদি থাকে)</label>
            <input
              type="text"
              value={supplierTip}
              onChange={(e) => setSupplierTip(e.target.value)}
              placeholder="সকালে গেলে খাঁটি দুধ সরাসরি খামারিদের থেকে পাওয়া যায়"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-md cursor-pointer"
            >
              কমিউনিটি পোস্টে জমা দিন
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
