import React, { useState } from 'react';
import { X, Code2, Copy, Check, FileText, ArrowRight, ExternalLink } from 'lucide-react';

interface ApiDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiDocsModal: React.FC<ApiDocsModalProps> = ({ isOpen, onClose }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const endpoints = [
    {
      id: 'ep-1',
      title: '১. পাইকারি সোর্সিং ও বিজনেস আইডিয়া তালিকা',
      method: 'GET',
      path: '/api/sourcing',
      desc: 'বিভিন্ন জেলা, ক্যাটাগরি ও পাইকারি-খুচরা মূল্যের তালিকা পেতে',
      sampleResponse: `{\n  "success": true,\n  "count": 6,\n  "data": [\n    {\n      "id": "sourcing-1",\n      "title": "Savar-এ MILK পাইকারি সোর্সিং",\n      "category": "খাবার ও দুগ্ধ",\n      "district": "ঢাকা",\n      "exactLocation": "সাভার পৌরসভা রোড, বংশী নদীর ঘাট সংলগ্ন আড়ত",\n      "wholesalePrice": 65,\n      "retailPrice": 100,\n      "unit": "প্রতি লিটার",\n      "moq": "২০ লিটার",\n      "isVerified": true\n    }\n  ]\n}`
    },
    {
      id: 'ep-2',
      title: '২. নতুন সোর্সিং ও বিজনেস আইডিয়া পোস্ট করা',
      method: 'POST',
      path: '/api/sourcing',
      desc: 'এডমিন বা ইউজার কর্তৃক নতুন পণ্য ও লোকেশন এন্ট্রি যোগ করা',
      samplePayload: `{\n  "title": "চকবাজার ট্রেন্ডি জুয়েলারি পাইকারি সোর্সিং",\n  "category": "পোশাক ও গহনা",\n  "district": "ঢাকা",\n  "exactLocation": "আশিক প্লাজা ৩য় তলা, চক মোগলটুলী, পুরান ঢাকা",\n  "wholesalePrice": 40,\n  "retailPrice": 120,\n  "unit": "প্রতি পিস",\n  "moq": "১২ পিস (১ ডজন)",\n  "description": "অনলাইনে মেয়েদের প্রসাধনী ও হেয়ার ক্লিপ পাইকারি রেটে...",\n  "tags": ["#চকবাজার", "#জুয়েলারি"]\n}`
    },
    {
      id: 'ep-3',
      title: '৩. উদ্যোক্তা ব্লগের তালিকা (২০টি পূর্ণাঙ্গ গাইড)',
      method: 'GET',
      path: '/api/blogs',
      desc: 'সকল ২০টি উদ্যোক্তা ব্লগের টাইটেল, ক্যাটাগরি ও বিবরণ পেতে',
      sampleResponse: `{\n  "success": true,\n  "total": 20,\n  "data": [\n    {\n      "id": "blog-1",\n      "title": "৫,০০০ টাকার মধ্যে ব্যবসা শুরু করার পরিকল্পনা",\n      "category": "বাজেট প্ল্যানিং",\n      "author": "মোঃ দেলোয়ার হোসেন (মিথুন)",\n      "readTime": "৫ মিনিট"\n    }\n  ]\n}`
    },
    {
      id: 'ep-4',
      title: '৪. এডমিন প্যানেল থেকে নতুন ব্লগ পাবলিশ করা',
      method: 'POST',
      path: '/api/blogs',
      desc: 'নতুন ব্লগ বা ব্যবসায়িক পরামর্শ সরাসরি ডাটাবেজে সংরক্ষণ করা',
      samplePayload: `{\n  "title": "নতুন উদ্যোক্তার জন্য কুরিয়ার পার্টনার নির্বাচন",\n  "category": "অপারেশনস",\n  "author": "মোঃ দেলোয়ার হোসেন (মিথুন)",\n  "excerpt": "কুরিয়ার রিটার্ন চার্জ কমানোর টিপস...",\n  "content": "### বিস্তারিত নির্দেশিকা...",\n  "readTime": "৫ মিনিট"\n}`
    },
    {
      id: 'ep-5',
      title: '৫. এআই বিজনেস রোডম্যাপ তৈরি করা (AI Roadmap)',
      method: 'POST',
      path: '/api/roadmap',
      desc: 'বাজেট, লোকেশন ও ক্যাটাগরি পাঠিয়ে স্বয়ংক্রিয় ব্যবসায়িক প্ল্যান পাওয়া',
      samplePayload: `{\n  "budget": 10000,\n  "location": "ঢাকা",\n  "category": "পোশাক ও ফ্যাশন",\n  "businessType": "online"\n}`
    },
    {
      id: 'ep-6',
      title: '৬. সোর্সিং পোস্টে মন্তব্য বা প্রশ্ন পাঠানো',
      method: 'POST',
      path: '/api/sourcing/:id/comments',
      desc: 'কমিউনিটি ডিসকাশনে মন্তব্য ও রিপ্লাই যোগ করা',
      samplePayload: `{\n  "authorName": "এনএইচ সাইমন",\n  "comment": "খুচরা সরাসরি সেল পেইজের মাধ্যমে ডেলিভারি দেওয়ার নিয়ম কি?"\n}`
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">
                API কানেকশন লিঙ্ক ও এন্ডপয়েন্ট ডক
              </h3>
              <p className="text-xs text-slate-400">
                আপনার নিজস্ব ব্যাকএন্ড (Laravel, Node, Firebase) কানেক্ট করার নিয়ম
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto text-xs sm:text-sm">
          
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-slate-700 space-y-1">
            <p className="font-bold text-emerald-950 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-700" />
              ফাইল লোকেশন:
            </p>
            <p className="text-xs text-emerald-800">
              প্রজেক্টের রুট ফোল্ডারে <strong className="font-mono bg-white px-1.5 py-0.5 rounded border border-emerald-300">/API_DOCUMENTATION.md</strong> ফাইলটিতে সব রিকোয়েস্ট স্কিমা এবং বিস্তারিত দেওয়া আছে।
            </p>
          </div>

          <div className="space-y-4">
            {endpoints.map((ep) => (
              <div key={ep.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                    {ep.title}
                  </h4>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    ep.method === 'GET' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {ep.method}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 text-emerald-400 font-mono text-xs">
                  <span>{ep.path}</span>
                  <button
                    onClick={() => handleCopy(ep.path, ep.id)}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200"
                    title="Copy path"
                  >
                    {copiedId === ep.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <p className="text-xs text-slate-600">
                  {ep.desc}
                </p>

                {(ep.samplePayload || ep.sampleResponse) && (
                  <details className="text-[11px] text-slate-600">
                    <summary className="cursor-pointer font-bold text-emerald-700 hover:underline">
                      {ep.samplePayload ? 'Request Body স্যাম্পল দেখুন' : 'Response স্যাম্পল দেখুন'}
                    </summary>
                    <pre className="mt-1.5 p-3 rounded-lg bg-slate-900 text-slate-200 overflow-x-auto font-mono text-[11px]">
                      {ep.samplePayload || ep.sampleResponse}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              ঠিক আছে
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
