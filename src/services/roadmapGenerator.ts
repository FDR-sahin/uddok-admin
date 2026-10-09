import { BusinessRoadmap, RoadmapRequest } from '../types';

export function generateSmartLocalRoadmap(req: RoadmapRequest): BusinessRoadmap {
  const budget = Number(req.budget) || 10000;
  const location = req.location || 'ঢাকা';
  const category = req.category || 'পোশাক ও ফ্যাশন';
  const isOnline = req.businessType === 'online';

  // Budget calculations
  const sourcingPercent = budget <= 5000 ? 60 : 50;
  const packagingPercent = 15;
  const marketingPercent = budget <= 5000 ? 15 : 20;
  const emergencyPercent = 100 - sourcingPercent - packagingPercent - marketingPercent;

  const sourcingAmount = Math.round((budget * sourcingPercent) / 100);
  const packagingAmount = Math.round((budget * packagingPercent) / 100);
  const marketingAmount = Math.round((budget * marketingPercent) / 100);
  const emergencyAmount = Math.round((budget * emergencyPercent) / 100);

  // Category specific logic
  if (category.includes('দুগ্ধ') || category.includes('খাবার') || category.includes('Food')) {
    const unitCost = 65;
    const sellPrice = 100;
    const profit = sellPrice - unitCost;
    return {
      ideaTitle: `${location}-এ লোকাল খাঁটি তরল দুধ ও ডেইরি খাদ্য উদ্যোগ`,
      summary: `মাত্র ${budget.toLocaleString('bn-BD')} টাকা বাজেটে স্থানীয় খামারিদের থেকে সরাসরি ফ্রেশ দুধ সংগ্রহ করে লোকাল কাস্টমার ও অ্যাপার্টমেন্ট বিল্ডিংয়ে নিয়মিত ডেলিভারি দেওয়ার বাস্তবমুখী প্ল্যান।`,
      recommendedProduct: 'খাঁটি তরল গরুর দুধ, গাওয়া ঘি বা দই তৈরির র মিল্ক',
      suggestedDistrictHub: `${location} পৌরসভা ও সংলগ্ন দুগ্ধ খামারি সমবায় সমিতি আড়ত`,
      budgetBreakdown: [
        {
          category: 'পণ্য ক্রয় (দুগ্ধ সোর্সিং)',
          amount: sourcingAmount,
          percentage: sourcingPercent,
          note: `খামারিদের থেকে ${Math.floor(sourcingAmount / unitCost)} লিটার ফ্রেশ দুধ সংগ্রহের জন্য`
        },
        {
          category: 'ফুড-গ্রেড প্যাকেজিং ও জার',
          amount: packagingAmount,
          percentage: packagingPercent,
          note: 'সিলযুক্ত ফুড গ্রেড প্লাস্টিক বোতল, জার ও ওয়াটারপ্রুফ লেবেল'
        },
        {
          category: 'লোকাল প্রচারণা ও ভিজিটিং কার্ড',
          amount: marketingAmount,
          percentage: marketingPercent,
          note: 'স্থানীয় আবাসিক এলাকায় লিফলেট বিতরণ ও ফেসবুক গ্রুপ প্রচার'
        },
        {
          category: 'ডেলিভারি ব্যাকআপ ও কোল্ড প্যাক ফান্ড',
          amount: emergencyAmount,
          percentage: emergencyPercent,
          note: 'গরমে দুধ যাতে নষ্ট না হয় সেজন্য আইস প্যাক ও জরুরি ট্রান্সপোর্ট ব্যাকআপ'
        }
      ],
      pricing: {
        estimatedPurchaseCost: unitCost,
        estimatedSellingPrice: sellPrice,
        unit: 'প্রতি লিটার',
        profitMarginPerUnit: profit,
        profitPercentage: Math.round((profit / sellPrice) * 100),
        moqAdvice: 'শুরুতে ২০ লিটার দিয়ে ট্রায়াল দিন, ডেলিভারি রুট ফিক্সড হলে পরিমাণ বাড়ান'
      },
      packagingAndDelivery: {
        packagingCostPerUnit: 12,
        packagingAdvice: 'ফুড-গ্রেড ১ লিটার বোতল ব্যবহার করুন এবং মুখে অ্যালুমিনিয়াম ফয়েল বা হিট-সিল ক্যাপ নিশ্চিত করুন।',
        deliveryStrategy: 'ভোর ৬টা থেকে ৮টার মধ্যে স্থানীয় ফ্ল্যাট ও বাসাবাড়িতে নিজস্ব সাইকেল বা রিকশায় ডোর-টু-ডোর ডেলিভারি দিন।'
      },
      marketingPlan: [
        'নিকটস্থ ৫-১০টি বহুতল ভবনের সোসাইটি সেক্রেটারির সাথে কথা বলে টেস্ট স্যাম্পল দিন।',
        'ফেসবুকে স্থানীয় কমিউনিটি গ্রুপে ভোরবেলার খামারের দুধ দোয়ানোর রিয়েল ভিডিও পোস্ট করুন।',
        'মাসিক সাবস্ক্রিপশন অফার করুন (যেমন: মাসে ৩০ দিন দুধ নিলে প্রতি লিটারে ৫ টাকা ডিসকাউন্ট)।'
      ],
      potentialRisks: [
        'দুধ দ্রুত পচনশীল পণ্য, তাই সংগৃহীত হওয়ার ৩-৪ ঘণ্টার মধ্যে সরবরাহ বা শীতলীকরণ নিশ্চিত করতে হবে।',
        'খামারির সাথে চুক্তি ছাড়া হঠাৎ দুধের দাম ওঠানামা করার ঝুঁকি।'
      ],
      nextSteps: [
        'সাভার বা স্থানীয় খামার পরিদর্শন করে সকালের দুধের ফ্যাট ও স্বাদ টেস্ট করুন।',
        '২০টি ফুড গ্রেড বোতল ও লেবেল রেডি করুন।',
        'প্রথম ৫ জন রেগুলার কাস্টমার বুকিং নিয়ে ডেলিভারি শুরু করুন।'
      ],
      verificationTips: [
        'ল্যাকটোমিটার দিয়ে দুধের ঘনত্ব ও পানির মিশ্রণ পরীক্ষা করে নিন।',
        'খামারির ঠিকানা ও গাভী পালনের স্বাস্থ্যসম্মত পরিবেশ নিজের চোখে দেখে আসুন।'
      ]
    };
  }

  if (category.includes('পোশাক') || category.includes('Cloth') || category.includes('ফ্যাশন')) {
    const unitCost = 280;
    const sellPrice = 490;
    const profit = sellPrice - unitCost;
    return {
      ideaTitle: `${location}-এ ট্রেন্ডি সুতি পোশাক ও হোম টেক্সটাইল অনলাইন ব্র্যান্ড`,
      summary: `${budget.toLocaleString('bn-BD')} টাকা পুঁজিতে ইসলামপুর বা বাবুরহাটের মতো পাইকারি হাব থেকে সুতি থান বা প্রস্তুত কাপড় সোর্সিং করে অনলাইন শপ পরিচালনা।`,
      recommendedProduct: 'প্রিমিয়াম সুতি হ্যান্ডলুম কুর্তি, বাটিক ও ট্রেন্ডি হোম-ডেকোর বেডশিট',
      suggestedDistrictHub: location === 'ঢাকা' ? 'ইসলামপুর ও চকবাজার' : 'নরসিংদী বাবুরহাট বা স্থানীয় টেক্সটাইল মোকাম',
      budgetBreakdown: [
        {
          category: 'পণ্য ক্রয় (প্রাথমিক লট)',
          amount: sourcingAmount,
          percentage: sourcingPercent,
          note: `পাইকারি বাজার থেকে প্রায় ${Math.floor(sourcingAmount / unitCost)} পিস পোশাক/থান সংগ্রহ`
        },
        {
          category: 'ক্রাফট প্যাকেজিং ও থ্যাঙ্ক-ইউ কার্ড',
          amount: packagingAmount,
          percentage: packagingPercent,
          note: 'ব্র্যান্ডেড পলি, সিকিউরিটি ব্যাগ ও বাবল র‍্যাপ'
        },
        {
          category: 'মেটা সোশ্যাল অ্যাড ও বুস্টিং',
          amount: marketingAmount,
          percentage: marketingPercent,
          note: 'টার্গেটেড মেটা ক্যাম্পেইন ও রিলস প্রোমোশন'
        },
        {
          category: 'কুরিয়ার রিটার্ন ও ইমার্জেন্সি ফান্ড',
          amount: emergencyAmount,
          percentage: emergencyPercent,
          note: 'ক্যাশ অন ডেলিভারিতে পার্সেল রিটার্ন কাভার করার নিরাপদ বাফার'
        }
      ],
      pricing: {
        estimatedPurchaseCost: unitCost,
        estimatedSellingPrice: sellPrice,
        unit: 'প্রতি পিস',
        profitMarginPerUnit: profit,
        profitPercentage: Math.round((profit / sellPrice) * 100),
        moqAdvice: 'শুরুতে ১২ থেকে ২০ পিসের ছোট অ্যাসোর্টেড লট নিন'
      },
      packagingAndDelivery: {
        packagingCostPerUnit: 20,
        packagingAdvice: 'ম্যাট ফিনিশ ক্রাফট পেপারের খাম বা ইকো বক্সের সাথে একটি পার্সোনালাইজড থ্যাঙ্ক ইউ কার্ড দিন।',
        deliveryStrategy: 'স্লোডেলিভারি এড়াতে নির্ভরযোগ্য হোম পিকআপ কুরিয়ার সার্ভিস ব্যবহার করুন।'
      },
      marketingPlan: [
        'দিনের আলোতে পোশাকের ট্রু-কালার ছবি ও আনবক্সিং ভিডিও শুট করুন।',
        'সাইজ চার্ট ও ফ্যাব্রিকের আসল পরিমাপ পোস্ট ক্যাপশনে স্পষ্ট করে উল্লেখ করুন।',
        'ইনস্টাগ্রাম ও ফেসবুক পেজে ৩টি হাই-কোয়ালিটি রিল ও কাস্টমার রিভিউ শেয়ার করুন।'
      ],
      potentialRisks: [
        'কাস্টমার ভুল সাইজ পছন্দ করলে রিটার্ন রেট বেড়ে যাওয়ার সম্ভাবনা।',
        'ছবি ও আসল কাপড়ের রঙে পার্থক্য দেখা দিলে অসন্তোষ।'
      ],
      nextSteps: [
        'পাইকারি মার্কেটে গিয়ে কাপড়ের রঙের স্থায়িত্ব ও সুতার কাউন্ট যাচাই করুন।',
        'ফেসবুক পেজের বায়ো, মেসেঞ্জার অটো-রিপ্লাই ও কভার ছবি সেট করুন।',
        'প্রথম ব্যাচ স্টক এনে ফটোশুট করুন।'
      ],
      verificationTips: [
        'কাপড় ধোয়ার পর সঙ্কুচিত (Shrink) হয় কি না এক গজ স্যাম্পল পানিতে ভিজিয়ে দেখুন।',
        'দোকানদারের মেমোতে রিটার্ন/এক্সচেঞ্জ শর্ত লিখিয়ে নিন।'
      ]
    };
  }

  // Default / Handicraft / General
  const unitCost = 150;
  const sellPrice = 350;
  const profit = sellPrice - unitCost;
  return {
    ideaTitle: `${location}-এ লো-বাজেট নিস ${category} মাইক্রো-উদ্যোগ`,
    summary: `মাত্র ${budget.toLocaleString('bn-BD')} টাকা নিয়ে শুরু করার জন্য একটি ক্যালকুলেটেড ও ঝুঁকিমুক্ত মাইক্রো-ইনভেন্টরি বিজনেস মডেল।`,
    recommendedProduct: `ট্রেন্ডি ${category} গিফট আইটেম বা ডেইলি ইউটিলিটি প্রোডাক্ট`,
    suggestedDistrictHub: `${location} সদর পাইকারি মার্কেট ও অনলাইন ভেরিফায়েড সোর্সিং হাব`,
    budgetBreakdown: [
      {
        category: 'পণ্য সংগ্রহ (সোর্সিং)',
        amount: sourcingAmount,
        percentage: sourcingPercent,
        note: `প্রায় ${Math.floor(sourcingAmount / unitCost)} ইউনিটের টেস্ট ইনভেন্টরি`
      },
      {
        category: 'কাস্টম প্যাকেজিং',
        amount: packagingAmount,
        percentage: packagingPercent,
        note: 'পরিচ্ছন্ন ইকো-ফ্রেন্ডলি বক্স ও স্টিকার'
      },
      {
        category: 'ডিজিটাল অর্গানিক প্রমোশন',
        amount: marketingAmount,
        percentage: marketingPercent,
        note: 'সোশ্যাল মিডিয়া কন্টেন্ট ও বুস্টিং'
      },
      {
        category: 'রিটার্ন ব্যাকআপ রিজার্ভ',
        amount: emergencyAmount,
        percentage: emergencyPercent,
        note: 'ক্যাশফ্লো সুরক্ষিত রাখার জন্য সেফটি রিজার্ভ'
      }
    ],
    pricing: {
      estimatedPurchaseCost: unitCost,
      estimatedSellingPrice: sellPrice,
      unit: 'প্রতি পিস',
      profitMarginPerUnit: profit,
      profitPercentage: Math.round((profit / sellPrice) * 100),
      moqAdvice: 'একবারে বড় অর্ডার না দিয়ে ছোট লটে টেস্ট করুন'
    },
    packagingAndDelivery: {
      packagingCostPerUnit: 15,
      packagingAdvice: 'পণ্য ভাঙা বা ক্ষতি হওয়া রোধে ভেতরের দিকে বাবল র‍্যাপ এবং বাইরে ব্র্যান্ড স্টিকার লাগান।',
      deliveryStrategy: 'ক্যাশ অন ডেলিভারি এবং ঢাকার বাইরে আংশিক ডেলিভারি চার্জ অগ্রিম নিন।'
    },
    marketingPlan: [
      'পণ্যটি ব্যবহারের প্র্যাকটিক্যাল সমস্যা ও সমাধানের ভিডিও বানান।',
      'প্রথম ১০ জন ক্রেতাকে বিশেষ গিফট ভাউচার দিন।',
      'সন্তুষ্ট গ্রাহকের অডিও বা টেক্সট রিভিউ সোশ্যাল মিডিয়ায় পোস্ট করুন।'
    ],
    potentialRisks: [
      'অতিরিক্ত ক্যাশ ব্লকেজ যদি পণ্য এক মাসে বিক্রি না হয়।',
      'সাপ্লায়ার হঠাৎ সরবরাহ বন্ধ করে দেওয়া।'
    ],
    nextSteps: [
      'আমাদের প্ল্যাটফর্মের ভেরিফায়েড ডিরেক্টরি থেকে সোর্সিং লোকেশন সিলেক্ট করুন।',
      'প্রোডাক্ট স্যাম্পল এনে ফটো ও ভিডিও বানান।',
      'বন্ধুবান্ধব ও পরিচিত মহলে সফট-লঞ্চ টেস্ট চালান।'
    ],
    verificationTips: [
      'সাপ্লায়ারের সাথে সরাসরি কথা বলুন এবং মেমো সংগ্রহ করুন।',
      'অগ্রিম ১০০% টাকা বিকাশ বা ব্যাংকে পাঠানোর আগে সশরীরে পরিচিত হন।'
    ]
  };
}
