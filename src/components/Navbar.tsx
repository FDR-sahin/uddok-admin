import React, { useState } from 'react';
import { 
  Compass, 
  BookOpen, 
  MapPin, 
  PlusCircle, 
  Sparkles, 
  ShieldCheck, 
  Search, 
  Calculator, 
  Menu, 
  X,
  Code2,
  Building2,
  UserCheck
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenPostModal: () => void;
  onOpenAdminModal: () => void;
  onOpenApiModal: () => void;
  isAdmin: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenPostModal,
  onOpenAdminModal,
  onOpenApiModal,
  isAdmin,
  searchQuery,
  setSearchQuery
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'হোম', icon: Building2 },
    { id: 'roadmap', label: 'AI রোডম্যাপ', icon: Sparkles },
    { id: 'sourcing', label: 'সোর্সিং হাব ও ম্যাপ', icon: MapPin },
    { id: 'blogs', label: 'উদ্যোক্তা ব্লগ (২০)', icon: BookOpen },
    { id: 'calculator', label: 'ক্যালকুলেটর', icon: Calculator },
    { id: 'about', label: 'আমাদের সম্পর্কে', icon: UserCheck },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Logo & Brand */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none group"
            onClick={() => { setCurrentTab('home'); }}
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg sm:text-xl tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                  উদ্যোগ বন্ধু
                </span>
                <span className="text-[10px] font-semibold tracking-wide bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full hidden sm:inline-block">
                  BE AN ENTREPRENEUR
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                স্বপ্নের ব্যবসা শুরুর প্রথম ও বিশ্বস্ত গাইড
              </p>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-xs xl:max-w-sm mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="পণ্য, পাইকারি বাজার বা জেলা খুঁজুন..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-100/90 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-lg outline-none transition-all placeholder:text-slate-400 text-slate-800"
              />
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Post Idea Button */}
            <button
              onClick={onOpenPostModal}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-medium text-xs sm:text-sm shadow-sm shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">আইডিয়া/সোর্সিং পোস্ট</span>
              <span className="sm:hidden">পোস্ট</span>
            </button>

            {/* API Docs Button */}
            <button
              onClick={onOpenApiModal}
              title="API Integration Docs & Endpoints"
              className="flex items-center gap-1 px-2.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs border border-slate-200 transition-colors"
            >
              <Code2 className="w-4 h-4 text-emerald-600" />
              <span className="hidden xl:inline">API ডক</span>
            </button>

            {/* Admin Panel Button */}
            <button
              onClick={onOpenAdminModal}
              className={`flex items-center gap-1 px-2.5 py-2 rounded-lg text-xs font-semibold border transition-all ${
                isAdmin 
                  ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              <ShieldCheck className={`w-4 h-4 ${isAdmin ? 'text-amber-600' : 'text-slate-500'}`} />
              <span className="hidden sm:inline">{isAdmin ? 'অ্যাডমিন ড্যাশবোর্ড' : 'অ্যাডমিন'}</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="lg:hidden pb-3 pt-1">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="পণ্য, পাইকারি বাজার বা জেলা খুঁজুন..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-100 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-lg outline-none text-slate-800"
            />
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-3 space-y-1 animate-in slide-in-from-top-2 duration-150">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4 text-emerald-600" />
                  {item.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
