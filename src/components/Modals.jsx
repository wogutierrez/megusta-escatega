import React from 'react';
import { 
  X, 
  ShoppingBag, 
  TrendingUp, 
  Lock, 
  PlusCircle, 
  Code, 
  CheckCircle2, 
  Copy, 
  Check, 
  Sparkles, 
  Mail 
} from 'lucide-react';

/**
 * Modals Component
 * Contains all popup dialogs and drawers used across the app (Buy, Bid, Consignment, CMS Guide, Register, Sign-In, and History).
 */
export default function Modals({
  // Active modal states & setters
  activeBuyItem,
  setActiveBuyItem,
  activeBidItem,
  setActiveBidItem,
  activeHistoryItem,
  setActiveHistoryItem,
  showConsignmentModal,
  setShowConsignmentModal,
  showCMSGuide,
  setShowCMSGuide,
  showRegisterModal,
  setShowRegisterModal,
  showSignInModal,
  setShowSignInModal,

  // User & Form states
  registeredUser,
  customBidAmount,
  setCustomBidAmount,
  regForm,
  setRegForm,
  regLoading,
  regMessage,
  signInEmail,
  setSignInEmail,
  signInLoading,
  signInMessage,
  copiedYaml,
  sampleCMSYaml,

  // Handlers
  handleConfirmBuy,
  handlePlaceBid,
  handleRegisterSubmit,
  handleSignInSubmit,
  copyYamlToClipboard
}) {
  return (
    <>
      {/* 1. INSTANT PURCHASE MODAL */}
      {activeBuyItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setActiveBuyItem(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider mb-2">
              <ShoppingBag className="w-4 h-4" /> Instant Purchase
            </div>

            <h3 className="text-xl font-bold text-white">{activeBuyItem.title}</h3>
            <p className="text-xs text-slate-400 mt-1">Condition: {activeBuyItem.condition} • Location: {activeBuyItem.location}</p>

            <div className="mt-4 p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Buy Now Listed Price</span>
                <span className="text-2xl font-black text-emerald-400">${activeBuyItem.price} USD</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">Guaranteed Seller</span>
              </div>
            </div>

            <form onSubmit={handleConfirmBuy} className="mt-5 space-y-4">
              {registeredUser ? (
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 flex items-center justify-between">
                  <span>Purchasing as: <strong className="text-white">{registeredUser.email}</strong></span>
                  <span className="font-mono text-emerald-400">{registeredUser.pseudonym}</span>
                </div>
              ) : (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-300 flex items-center justify-between">
                  <span>Please register your details before making a purchase.</span>
                  <button 
                    type="button"
                    onClick={() => { setActiveBuyItem(null); setShowRegisterModal(true); }}
                    className="px-2.5 py-1 bg-amber-500 text-slate-950 font-bold rounded text-[11px]"
                  >
                    Register Now
                  </button>
                </div>
              )}

              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-200/90 leading-relaxed">
                <strong>Consignment Direct Policy:</strong> Submitting this request reserves the item for 24 hours. The admin team will contact you to confirm inspection & payment.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setActiveBuyItem(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={!registeredUser}
                  className="px-5 py-2 text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 rounded-lg transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                >
                  Confirm Purchase Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. PLACE BID MODAL */}
      {activeBidItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setActiveBidItem(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-teal-400 font-semibold text-xs uppercase tracking-wider mb-2">
              <TrendingUp className="w-4 h-4" /> Place Private Bid
            </div>

            <h3 className="text-xl font-bold text-white">{activeBidItem.title}</h3>
            
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-[11px] text-slate-400 block">Current High Bid</span>
                <span className="text-xl font-extrabold text-white">${activeBidItem.currentBid}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-[11px] text-slate-400 block">Min Next Bid</span>
                <span className="text-xl font-extrabold text-teal-400">${(activeBidItem.currentBid || 0) + (activeBidItem.minBidIncrement || 5)}</span>
              </div>
            </div>

            <form onSubmit={handlePlaceBid} className="mt-5 space-y-4">
              {registeredUser ? (
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 flex items-center justify-between">
                  <span>Bidding as handle: <strong className="text-emerald-400 font-mono">{registeredUser.pseudonym}</strong></span>
                  <span className="text-slate-500 text-[10px]">{registeredUser.email}</span>
                </div>
              ) : (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-300 flex items-center justify-between">
                  <span>You must register your profile before placing a bid.</span>
                  <button 
                    type="button"
                    onClick={() => { setActiveBidItem(null); setShowRegisterModal(true); }}
                    className="px-2.5 py-1 bg-amber-500 text-slate-950 font-bold rounded text-[11px]"
                  >
                    Register Now
                  </button>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Your Bid Amount ($ USD)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input 
                    type="number" 
                    min={(activeBidItem.currentBid || 0) + (activeBidItem.minBidIncrement || 5)}
                    step={activeBidItem.minBidIncrement || 5}
                    placeholder={`${(activeBidItem.currentBid || 0) + (activeBidItem.minBidIncrement || 5)}`}
                    value={customBidAmount}
                    onChange={(e) => setCustomBidAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  {[5, 10, 25, 50].map(inc => (
                    <button
                      type="button"
                      key={inc}
                      onClick={() => setCustomBidAmount(((activeBidItem.currentBid || 0) + inc).toString())}
                      className="px-2 py-1 text-[11px] font-mono bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white rounded border border-slate-700"
                    >
                      +${inc}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <p className="text-[11px] text-slate-400 leading-normal">
                  <strong>Privacy Shield Active:</strong> Your email is kept strictly private. Publicly, your bid will display under an automatically generated handle.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setActiveBidItem(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={!registeredUser}
                  className="px-5 py-2 text-xs font-bold bg-teal-500 text-slate-950 hover:bg-teal-400 rounded-lg transition-all shadow-lg shadow-teal-500/20 disabled:opacity-50"
                >
                  Submit Private Bid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. BID HISTORY DRAWER */}
      {activeHistoryItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-end p-0 sm:p-4">
          <div className="bg-slate-900 border-l sm:border border-slate-800 w-full sm:max-w-md h-full sm:h-auto sm:max-h-[90vh] sm:rounded-2xl p-6 shadow-2xl flex flex-col relative animate-in slide-in-from-right duration-200">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-white text-base">Bid Activity History</h3>
                <p className="text-xs text-slate-400 truncate max-w-[280px]">{activeHistoryItem.title}</p>
              </div>
              <button 
                onClick={() => setActiveHistoryItem(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4 p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Total Bids Recorded</span>
              <span className="font-mono font-bold text-emerald-400">{activeHistoryItem.bids ? activeHistoryItem.bids.length : 0}</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 my-2">
              {(!activeHistoryItem.bids || activeHistoryItem.bids.length === 0) ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  No bids recorded yet. Be the first to place a bid!
                </div>
              ) : (
                activeHistoryItem.bids.map((b, idx) => (
                  <div 
                    key={b.id || idx} 
                    className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                      idx === 0 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200' 
                        : 'bg-slate-800/40 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                        idx === 0 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-300'
                      }`}>
                        #{activeHistoryItem.bids.length - idx}
                      </div>
                      <div>
                        <div className="font-mono text-xs font-bold flex items-center gap-1.5">
                          <span>{b.bidder}</span>
                          {idx === 0 && <span className="text-[9px] bg-emerald-500 text-slate-950 px-1.5 py-0.2 rounded font-sans uppercase">Highest</span>}
                        </div>
                        <span className="text-[10px] text-slate-500 block">{b.timestamp}</span>
                      </div>
                    </div>
                    <span className="font-mono text-base font-extrabold text-white">${b.amount}</span>
                  </div>
                ))
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button 
                onClick={() => {
                  const item = activeHistoryItem;
                  setActiveHistoryItem(null);
                  setActiveBidItem(item);
                }}
                className="w-full py-2.5 bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <TrendingUp className="w-4 h-4" /> Place Higher Bid
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. CONSIGNMENT INFO MODAL */}
      {showConsignmentModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button 
              onClick={() => setShowConsignmentModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
              <PlusCircle className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-white">How to Consign an Item</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Consignment Direct Network operates exclusively for verified acquaintances. Keep 80% of the sale price with zero upfront listing fees.
            </p>

            <div className="space-y-3 mt-4 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0">1</span>
                <div>
                  <h4 className="font-bold text-slate-200">Email Details & Photos</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">Send photos and details to <span className="text-emerald-400 font-mono">info@escatega.com</span>.</p>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0">2</span>
                <div>
                  <h4 className="font-bold text-slate-200">Keep Item at Home</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">You retain custody of your item while listed online.</p>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0">3</span>
                <div>
                  <h4 className="font-bold text-slate-200">Doorstep Pickup & Payout</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">Once sold, we handle pickup, delivery, and immediate cash payout.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <a 
                href="mailto:info@escatega.com?subject=New%20Consignment%20Item%20Listing"
                className="w-full py-2.5 bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-bold text-xs rounded-xl transition-all text-center flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" /> Email info@escatega.com
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 5. CMS SETUP GUIDE MODAL */}
      {showCMSGuide && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] flex flex-col">
            <button 
              onClick={() => setShowCMSGuide(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-teal-400 font-semibold text-xs uppercase tracking-wider mb-1">
              <Code className="w-4 h-4" /> Free Cloudflare Pages + Sveltia CMS Guide
            </div>

            <h3 className="text-xl font-bold text-white">How to Manage Listings for Free</h3>
            <p className="text-xs text-slate-400 mt-1">
              Store inventory items as markdown/JSON in a GitHub repo connected to Cloudflare Pages.
            </p>

            <div className="flex-1 overflow-y-auto my-4 space-y-4 pr-1 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <h4 className="font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Step 1: Deploy to Cloudflare Pages
                </h4>
                <p className="text-slate-400 leading-relaxed">
                  Connect your GitHub repository to Cloudflare Pages under your domain <span className="font-mono text-slate-300">escatega.com</span>.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
                    <Code className="w-4 h-4 text-teal-400" /> Step 2: Add Sveltia Config <span className="font-mono text-[10px] text-slate-500">public/admin/config.yml</span>
                  </h4>
                  <button 
                    onClick={copyYamlToClipboard}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-mono flex items-center gap-1 transition-all"
                  >
                    {copiedYaml ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedYaml ? 'Copied' : 'Copy YAML'}
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-[10px] font-mono text-emerald-300 overflow-x-auto max-h-48">
                  {sampleCMSYaml}
                </pre>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <h4 className="font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" /> Step 3: Access Admin Portal
                </h4>
                <p className="text-slate-400 leading-relaxed">
                  Navigate to <span className="font-mono text-emerald-400">megusta.escatega.com/admin/</span> to upload photos and adjust prices directly.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button 
                onClick={() => setShowCMSGuide(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl"
              >
                Close Setup Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. REGISTRATION MODAL */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
            <button 
              onClick={() => setShowRegisterModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-xl font-bold text-white mb-1">Join Megusta Network</h2>
            <p className="text-xs text-slate-400 mb-6">Register your details once to receive private bidding handles.</p>

            {regMessage && (
              <div className="mb-4 p-3 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                {regMessage}
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">First Name</label>
                  <input 
                    type="text" 
                    required
                    value={regForm.firstName}
                    onChange={(e) => setRegForm({...regForm, firstName: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Last Name</label>
                  <input 
                    type="text" 
                    required
                    value={regForm.lastName}
                    onChange={(e) => setRegForm({...regForm, lastName: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={regForm.email}
                  onChange={(e) => setRegForm({...regForm, email: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  required
                  placeholder="+263 ..."
                  value={regForm.phone}
                  onChange={(e) => setRegForm({...regForm, phone: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={regLoading}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 font-semibold text-slate-950 rounded-lg transition-all text-sm mt-2 disabled:opacity-50"
              >
                {regLoading ? 'Registering...' : 'Complete Registration'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 7. SIGN IN MODAL */}
      {showSignInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
            <button 
              onClick={() => setShowSignInModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-xl font-bold text-white mb-1">Sign In to Megusta</h2>
            <p className="text-xs text-slate-400 mb-6">Enter your registered email address to restore your private bidding handle.</p>

            {signInMessage && (
              <div className="mb-4 p-3 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                {signInMessage}
              </div>
            )}

            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Your Registered Email</label>
                <input 
                  type="email" 
                  required
                  placeholder="yourname@domain.com"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={signInLoading}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 font-semibold text-slate-950 rounded-lg transition-all text-sm mt-2 disabled:opacity-50"
              >
                {signInLoading ? 'Verifying Email...' : 'Restore My Handle'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}