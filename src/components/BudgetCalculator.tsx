import React, { useState } from 'react';
import { Calculator, Wallet, ArrowRight, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';

export const BudgetCalculator: React.FC = () => {
  const [totalBudget, setTotalBudget] = useState<number>(10000);
  const [purchasePrice, setPurchasePrice] = useState<number>(300);
  const [packagingCost, setPackagingCost] = useState<number>(25);
  const [shippingCost, setShippingCost] = useState<number>(20);
  const [marketingBudgetPerUnit, setMarketingBudgetPerUnit] = useState<number>(60);
  const [returnRiskPercent, setReturnRiskPercent] = useState<number>(10);
  const [desiredProfit, setDesiredProfit] = useState<number>(100);

  // Calculations
  const returnAllowance = Math.round((purchasePrice * returnRiskPercent) / 100);
  const trueCostPerUnit = purchasePrice + packagingCost + shippingCost + marketingBudgetPerUnit + returnAllowance;
  const suggestedSellingPrice = trueCostPerUnit + desiredProfit;
  const profitMarginPercent = suggestedSellingPrice > 0 ? Math.round((desiredProfit / suggestedSellingPrice) * 100) : 0;

  // Inventory Capacity
  const sourcingFund = Math.round((totalBudget * 0.55));
  const estimatedUnitsToBuy = purchasePrice > 0 ? Math.floor(sourcingFund / purchasePrice) : 0;
  const potentialTotalProfit = estimatedUnitsToBuy * desiredProfit;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          <Calculator className="w-3.5 h-3.5 text-emerald-600" />
          স্মার্ট কস্টিং ও বাজেট ক্যালকুলেটর
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          প্রোডাক্ট কস্টিং ও সম্ভাব্য লাভ হিসাব করুন
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          পাইকারি কেনা দাম ছাড়াও পরিবহন, প্যাকেজিং, বিজ্ঞাপন এবং রিটার্ন লস যোগ করে আপনার সঠিক বিক্রয়মূল্য নির্ধারণ করুন।
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input parameters */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 space-y-4 shadow-xs">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 pb-2 border-b border-slate-100">
            <Wallet className="w-4 h-4 text-emerald-600" />
            খরচের উপাদানসমূহ লিখুন
          </h3>

          <div className="space-y-3 text-xs sm:text-sm">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                আপনার মোট বাজেট (টাকা)
              </label>
              <input
                type="number"
                value={totalBudget}
                onChange={(e) => setTotalBudget(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                পাইকারি কেনা দাম (৳ / ইউনিট)
              </label>
              <input
                type="number"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  প্যাকেজিং খরচ (৳)
                </label>
                <input
                  type="number"
                  value={packagingCost}
                  onChange={(e) => setPackagingCost(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  পরিবহন ভাড়া (৳/ইউনিট)
                </label>
                <input
                  type="number"
                  value={shippingCost}
                  onChange={(e) => setShippingCost(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  মার্কেটিং / অ্যাড খরচ (৳)
                </label>
                <input
                  type="number"
                  value={marketingBudgetPerUnit}
                  onChange={(e) => setMarketingBudgetPerUnit(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  রিটার্ন রিস্ক বাফার (%)
                </label>
                <input
                  type="number"
                  value={returnRiskPercent}
                  onChange={(e) => setReturnRiskPercent(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                প্রত্যাশিত নিট লাভ (৳ / ইউনিট)
              </label>
              <input
                type="number"
                value={desiredProfit}
                onChange={(e) => setDesiredProfit(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Calculated Results */}
        <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/50 rounded-3xl border border-emerald-200 p-5 sm:p-6 space-y-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-bold text-emerald-950 text-sm flex items-center gap-1.5 pb-2 border-b border-emerald-200/80">
              <TrendingUp className="w-4 h-4 text-emerald-700" />
              বিশ্লেষণ ও সঠিক বিক্রয়মূল্য
            </h3>

            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between items-center py-1 border-b border-emerald-200/50">
                <span className="text-slate-600">আসল খরচ (True COGS):</span>
                <span className="font-bold text-slate-900">৳ {trueCostPerUnit}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-emerald-200/50">
                <span className="text-slate-600">রিটার্ন বাফার প্রভিশন:</span>
                <span className="font-semibold text-slate-700">৳ {returnAllowance}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-emerald-200/50">
                <span className="text-slate-600">নিট প্রফিট মার্জিন:</span>
                <span className="font-bold text-emerald-700">{profitMarginPercent}%</span>
              </div>
            </div>

            {/* Big Price Box */}
            <div className="p-4 rounded-2xl bg-white border border-emerald-300 shadow-xs text-center space-y-1">
              <span className="text-xs font-semibold text-slate-500 block">
                প্রস্তাবিত সর্বনিম্ন বিক্রয়মূল্য
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-700">
                ৳ {suggestedSellingPrice}
              </div>
              <p className="text-[11px] text-slate-500">
                (আসল খরচ ৳{trueCostPerUnit} + আপনার লাভ ৳{desiredProfit})
              </p>
            </div>
          </div>

          {/* Sourcing capacity based on budget */}
          <div className="p-3.5 rounded-xl bg-white/80 border border-emerald-200 text-xs text-slate-700 space-y-1">
            <span className="font-bold text-slate-900 block">বাজেট সামর্থ্য:</span>
            <p>
              আপনার ৳{totalBudget.toLocaleString('bn-BD')} বাজেটের মধ্যে আপনি প্রায় <strong>{estimatedUnitsToBuy} পিস</strong> পণ্য কিনতে পারবেন এবং সব বিক্রি হলে মোট সম্ভাব্য লাভ হতে পারে <strong>৳{potentialTotalProfit.toLocaleString('bn-BD')}</strong>।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
