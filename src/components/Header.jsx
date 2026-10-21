import React from 'react';
import { ShoppingBag, Search, PlusCircle, Code, X } from 'lucide-react';

/**
 * Header Component
 * Manages the top navigation bar, search input, category filters, and user session states.
 */
export default function Header({
  registeredUser,
  onSignOut,
  onOpenSignIn,
  onOpenRegister,
  onOpenConsignment,
  onOpenCMSGuide,
  searchQuery,
  setSearchQuery,
  categories,
  selectedCategory,
  setSelectedCategory
}) {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Logo and Brand Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <ShoppingBag className="w-5 h-5 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white">
                buy<span className="text-emerald-400">.escatega.com</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] uppercase font-mono tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                Private Network
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Consignment Direct Network</p>
          </div>
        </div>

        {/* User Authentication & Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {registeredUser ? (
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-xs font-mono">
                Handle: {registeredUser.pseudonym}
              </span>
              <button
                onClick={onSignOut}
                className="text-[10px] text-slate-400 hover:text-red-400 underline"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenSignIn}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg text-xs transition-all border border-slate-700"
              >
                Already Registered? Sign In
              </button>
              <button
                onClick={onOpenRegister}
                className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs transition-all shadow-md"
              >
                Register to Bid / Buy
              </button>
            </div>
          )}

          {/* Consign Button */}
          <button 
            onClick={onOpenConsignment}
            className="px-3 py-2 text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-lg transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span className="hidden md:inline">Consign an Item</span>
            <span className="md:hidden">Consign</span>
          </button>

          {/* CMS Guide Button */}
          <button 
            onClick={onOpenCMSGuide}
            className="px-3 py-2 text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-lg transition-all flex items-center gap-1.5"
          >
            <Code className="w-4 h-4 text-teal-400" />
            <span className="hidden md:inline">CMS & Cloudflare Setup</span>
            <span className="md:hidden">CMS Guide</span>
          </button>
        </div>
      </div>

      {/* Subheader Search Bar and Category Pills */}
      <div className="bg-slate-950/60 border-t border-slate-800/40 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search catalog by title, description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/60 rounded-lg pl-9 pr-4 py-1.5 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat 
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-semibold' 
                    : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-700/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>
      </div>
    </header>
  );
}
