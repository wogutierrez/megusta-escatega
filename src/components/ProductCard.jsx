import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Clock, 
  ShoppingBag, 
  TrendingUp, 
  Eye 
} from 'lucide-react';

/**
 * AuctionCountdown Component
 * Enlarged digital countdown banner matching button dimensions.
 */
function AuctionCountdown({ endDate }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false });

  React.useEffect(() => {
    if (!endDate) return;

    const calculateTime = () => {
      const difference = new Date(endDate) - new Date();
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, expired: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  if (!endDate) return null;
  
  if (timeLeft.expired) {
    return (
      <div className="w-full py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 font-mono font-bold text-xs rounded-xl flex items-center justify-center gap-2">
        <Clock className="w-4 h-4" /> AUCTION CLOSED
      </div>
    );
  }

  return (
    <div className="w-full py-2 bg-teal-950/60 border border-teal-500/30 rounded-xl px-3 flex items-center justify-between text-teal-300 font-mono shadow-inner">
      <div className="flex items-center gap-1.5 text-xs text-teal-400 font-semibold tracking-wider">
        <Clock className="w-4 h-4 text-teal-400 animate-pulse shrink-0" />
        <span>CLOSES IN:</span>
      </div>
      <div className="text-xs font-black tracking-tight text-white flex items-center gap-1">
        <span className="bg-teal-900/80 px-1.5 py-0.5 rounded text-teal-200">{timeLeft.days}d</span>
        <span className="text-teal-500">:</span>
        <span className="bg-teal-900/80 px-1.5 py-0.5 rounded text-teal-200">{String(timeLeft.hours).padStart(2, '0')}h</span>
        <span className="text-teal-500">:</span>
        <span className="bg-teal-900/80 px-1.5 py-0.5 rounded text-teal-200">{String(timeLeft.minutes).padStart(2, '0')}m</span>
        <span className="text-teal-500">:</span>
        <span className="bg-teal-900/80 px-1.5 py-0.5 rounded text-teal-200 animate-pulse">{String(timeLeft.seconds).padStart(2, '0')}s</span>
      </div>
    </div>
  );
}

/**
 * ProductCard Component
 * Renders individual item cards with expandable descriptions and condition notes.
 */
export default function ProductCard({ item, onBuy, onBid, onViewHistory }) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false); // 👈 Expandable description state

  const imagesList = (item.images && item.images.length > 0) 
    ? item.images 
    : [item.image, item.image2, item.image3].filter(Boolean);

  const activeImage = imagesList.length > 0 
    ? imagesList[currentImgIndex] 
    : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80';

  const nextImage = (e) => {
    e.stopPropagation();
    if (imagesList.length > 1) {
      setCurrentImgIndex((prev) => (prev + 1) % imagesList.length);
    }
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (imagesList.length > 1) {
      setCurrentImgIndex((prev) => (prev - 1 + imagesList.length) % imagesList.length);
    }
  };

  const rawType = item.listingType || item.listingtype || '';
  const listingTypeLower = String(rawType).toLowerCase().trim();
  const isAuction = listingTypeLower.includes('auction');

  return (
    <div className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl overflow-hidden shadow-lg transition-all flex flex-col group">
      
      {/* 1. PHOTO CAROUSEL SECTION */}
      <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden">
        <img 
            src={activeImage} 
            alt={item.title}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
        />

        {/* Category & Condition Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-slate-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30 rounded-full">
            {item.category || 'General'}
          </span>
          <span className="px-2.5 py-1 text-[10px] font-semibold bg-slate-950/80 backdrop-blur-md text-slate-300 border border-slate-800 rounded-full">
            {item.condition || 'As-Is'}
          </span>
        </div>

        {/* Seller Verification Tag */}
        <div className="absolute top-3 right-3 z-10">
          <span className="px-2.5 py-1 text-[10px] font-medium bg-slate-950/80 backdrop-blur-md text-slate-200 border border-slate-800 rounded-full flex items-center gap-1 shadow-md">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">{item.sellerTag || 'Verified Acquaintance'}</span>
          </span>
        </div>

        {imagesList.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/70 hover:bg-slate-900 text-white flex items-center justify-center opacity-80 hover:opacity-100 transition-all z-10 border border-slate-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/70 hover:bg-slate-900 text-white flex items-center justify-center opacity-80 hover:opacity-100 transition-all z-10 border border-slate-800"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
              {imagesList.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => { e.stopPropagation(); setCurrentImgIndex(idx); }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentImgIndex ? 'bg-emerald-400 w-4' : 'bg-slate-500/60'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* 2. CARD CONTENT SECTION */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-white text-base leading-snug group-hover:text-emerald-300 transition-colors">
              {item.title}
            </h3>
          </div>

          {/* Expandable Description */}
          <div className="mt-2">
            <p className={`text-xs text-slate-300 leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
              {item.description}
            </p>
            {item.description && item.description.length > 90 && (
              <button 
                onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold mt-1 transition-colors flex items-center gap-1"
              >
                {isExpanded ? 'Show less' : 'Read full description...'}
              </button>
            )}
          </div>

          {/* 👈 Important Item Notes / Flaws Callout Box */}
          {item.itemNotes && (
            <div className="mt-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2">
              <span className="font-bold shrink-0 uppercase text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded text-amber-200">Note:</span>
              <p className="leading-tight">{item.itemNotes}</p>
            </div>
          )}
        </div>

        {/* 3. PRICING & ACTION BUTTONS */}
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          
          {!isAuction ? (
            <div className="mb-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-500 block">Direct Purchase Price</span>
                <span className="text-xl font-black text-emerald-400">${item.price || 0}</span>
              </div>
              <span className="px-2.5 py-1 text-[10px] uppercase font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                Buy Item
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 mb-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-500 block">Current Bid</span>
                <span className="text-lg font-black text-white">${item.currentBid || 0}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-mono text-slate-500 block">Highest Bidder</span>
                <div className="flex items-center justify-end gap-1">
                  <span className="text-sm font-mono font-bold text-teal-400">{item.bids && item.bids.length > 0 ? item.bids[0].bidder : 'No bids'}</span>
                  <button 
                    onClick={onViewHistory}
                    title="View Bidder History"
                    className="text-slate-400 hover:text-emerald-400 ml-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Action Trigger Buttons */}
          {!isAuction ? (
            <button
              onClick={onBuy}
              className="w-full py-2.5 bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/10"
            >
              <ShoppingBag className="w-3.5 h-3.5" /> Buy Now Directly (${item.price || 0})
            </button>
          ) : (
            <div className="space-y-2">
              {item.auctionEndDate && (
                <AuctionCountdown endDate={item.auctionEndDate} />
              )}
              
              <button
                onClick={onBid}
                className="w-full py-2.5 bg-teal-500 text-slate-950 hover:bg-teal-400 font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-teal-500/20"
              >
                <TrendingUp className="w-3.5 h-3.5" /> Place Bid
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}