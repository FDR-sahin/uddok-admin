export interface Comment {
  id: string;
  authorName: string;
  authorRole?: string;
  comment: string;
  createdAt: string;
  likes: number;
  replies?: Comment[];
}

export interface SourcingIdea {
  id: string;
  title: string;
  category: string;
  district: string;
  upazilaOrArea: string;
  exactLocation: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  wholesalePrice: number;
  wholesalePriceMax?: number;
  wholesalePriceText?: string;
  retailPrice: number;
  retailPriceMax?: number;
  retailPriceText?: string;
  unit: string;
  moq: string;
  isVerified: boolean;
  verificationBadgeText?: string;
  lastUpdated: string;
  description: string;
  tags: string[];
  likes: number;
  dislikes: number;
  comments: Comment[];
  status?: 'pending' | 'approved' | 'rejected';
  authorEmail?: string;
  authorPhone?: string;
  postedBy: {
    name: string;
    role: string;
    isVerifiedUser: boolean;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  authorTitle: string;
  excerpt: string;
  content: string;
  bulletPoints: string[];
  actionChecklist: string[];
  tags: string[];
}

export interface BudgetBreakdownItem {
  category: string;
  amount: number;
  percentage: number;
  note: string;
}

export interface BusinessRoadmap {
  ideaTitle: string;
  summary: string;
  recommendedProduct: string;
  suggestedDistrictHub: string;
  budgetBreakdown: BudgetBreakdownItem[];
  pricing: {
    estimatedPurchaseCost: number;
    estimatedSellingPrice: number;
    unit: string;
    profitMarginPerUnit: number;
    profitPercentage: number;
    moqAdvice: string;
  };
  packagingAndDelivery: {
    packagingCostPerUnit: number;
    packagingAdvice: string;
    deliveryStrategy: string;
  };
  marketingPlan: string[];
  potentialRisks: string[];
  nextSteps: string[];
  verificationTips: string[];
}

export interface RoadmapRequest {
  budget: number;
  location: string;
  category: string;
  businessType: 'online' | 'offline' | 'hybrid';
  experienceLevel?: 'beginner' | 'intermediate';
  targetAudience?: string;
}
