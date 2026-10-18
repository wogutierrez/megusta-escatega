import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Tag, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Info, 
  Clock, 
  Mail, 
  CheckCircle2, 
  PlusCircle, 
  Code, 
  Copy, 
  Check, 
  Search, 
  Filter, 
  X, 
  Lock, 
  Eye, 
  TrendingUp, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

// Random Pseudonym Generator for Privacy Protection
const ADJECTIVES = ['Silent', 'Silver', 'Rustic', 'Golden', 'Cosmic', 'Velvet', 'Lunar', 'Nimble', 'Noble', 'Brave'];
const ANIMALS = ['Panda', 'Falcon', 'Owl', 'Jaguar', 'Otter', 'Fox', 'Eagle', 'Badger', 'Dolphin', 'Lynx'];

const generatePseudonym = () => {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  const num = Math.floor(10 + Math.random() * 89);
  return `${adj}${animal}${num}`;
};

// Initial Mock Inventory with Listing Types & Countdown Dates
const futureDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(); // 3 days from now

const INITIAL_ITEMS = [
  {
    id: 'item-1',
    title: 'Vintage Leather Armchair & Ottoman',
    listingType: 'Auction & Buy Now',
    auctionEndDate: futureDate,
    category: 'Furniture',
    description: 'Genuine full-grain leather armchair in cognac brown. Minor patina near arms, structurally perfect. Kept in smoke-free home.',
    price: 320,
    currentBid: 210,
    minBidIncrement: 10,
    condition: 'As-Is (Excellent)',
    location: 'Central District',
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?auto=format&fit=crop&w=800&q=80'
    ],
    bids: [
      { id: 'b1', amount: 210, bidder: 'SilverFalcon42', timestamp: '2 hours ago' },
      { id: 'b2', amount: 195, bidder: 'RusticOwl19', timestamp: '5 hours ago' }
    ]
  },
  {
    id: 'item-2',
    title: 'Sony Alpha A7 III Camera Body + FE 50mm Lens',
    listingType: 'Buy Now Only',
    auctionEndDate: null,
    category: 'Electronics',
    description: 'Shutter count ~12,400. Includes 2 original batteries, dual charger, and Sony FE 50mm f/1.8 lens. Sensor clean, pristine optics.',
    price: 1150,
    currentBid: 0,
    minBidIncrement: 0,
    condition: 'As-Is (Like New)',
    location: 'North Suburbs',
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80'
    ],
    bids: []
  }
];

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Furniture', 'Vehicles', 'Real Estate', 'Others'];

export default function App({ initialItems = [] }) {
  const [items, setItems] = useState(
    initialItems.length > 0 ? initialItems : INITIAL_ITEMS
  );
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [activeBuyItem, setActiveBuyItem] = useState(null);
  const [activeBidItem, setActiveBidItem] = useState(null);
  const [activeHistoryItem, setActiveHistoryItem] = useState(null);
  const [showCMSGuide, setShowCMSGuide] = useState(false);
  const [showConsignmentModal, setShowConsignmentModal] = useState(false);

  // Registration states
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);
  const [regForm, setRegForm] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [regLoading, setRegLoading] = useState(false);
  const [regMessage, setRegMessage] = useState('');

  // Sign-In States
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [signInEmail, setSignInEmail] = useState('');
  const [signInLoading, setSignInLoading] = useState(false);
  const [signInMessage, setSignInMessage] = useState('');

  // Form states
  const [customBidAmount, setCustomBidAmount] = useState('');
  
  // Toast Notification System
  const [toast, setToast] = useState(null);
  const [copiedYaml, setCopiedYaml] = useState(false);

  // Check localStorage on load for saved user handle
  useEffect(() => {
    const savedUser = localStorage.getItem('megusta_user');
    if (savedUser) {
      setRegisteredUser(JSON.parse(savedUser));
    }
  }, []);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegLoading(true);
    setRegMessage('');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regForm)
      });
      const data = await res.json();

      if (data.success) {
        const userData = { email: regForm.email, pseudonym: data.pseudonym };
        localStorage.setItem('megusta_user', JSON.stringify(userData));
        setRegisteredUser(userData);
        setRegMessage(`Registration Complete! Your private bidder handle is: ${data.pseudonym}`);
        setTimeout(() => {
          setShowRegisterModal(false);
          setRegMessage('');
        }, 2500);
      } else {
        setRegMessage(data.error || 'Registration failed.');
      }
    } catch (err) {
      setRegMessage('Network error. Please try again.');
    } finally {
      setRegLoading(false);
    }
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setSignInLoading(true);
    setSignInMessage('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signInEmail })
      });
      const data = await res.json();

      if (data.success) {
        const userData = { email: signInEmail, pseudonym: data.pseudonym };
        localStorage.setItem('megusta_user', JSON.stringify(userData));
        setRegisteredUser(userData);
        setSignInMessage(`Welcome back, ${data.firstName}! Handle [${data.pseudonym}] restored.`);
        setTimeout(() => {
          setShowSignInModal(false);
          setSignInMessage('');
          setSignInEmail('');
        }, 2000);
      } else {
        setSignInMessage(data.error || 'Email not found.');
      }
    } catch (err) {
      setSignInMessage('Network error. Please try again.');
    } finally {
      setSignInLoading(false);
    }
  };

  const showNotification = (message, title = 'NotificationSent') => {
    setToast({ title, message });
    setTimeout(() => setToast(null), 6000);
  };

  const handleConfirmBuy = (e) => {
    e.preventDefault();
    if (!registeredUser) {
      setShowRegisterModal(true);
      return;
    }

    showNotification(
      `Confirmation email dispatched to ${registeredUser.email} & info@escatega.com. We will contact you directly to schedule delivery & payment!`,
      'Instant Buy Direct Request Sent'
    );

    setActiveBuyItem(null);
  };

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    if (!registeredUser || !activeBidItem) {
      setShowRegisterModal(true);
      return;
    }

    const minAllowed = activeBidItem.currentBid + activeBidItem.minBidIncrement;
    const bidValue = customBidAmount ? parseFloat(customBidAmount) : minAllowed;

    if (bidValue < minAllowed) {
      alert(`Minimum bid must be at least $${minAllowed}`);
      return;
    }

    try {
      const res = await fetch('/api/bid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: registeredUser.email,
          itemId: activeBidItem.id,
          itemTitle: activeBidItem.title,
          bidAmount: bidValue
        })
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to place bid.");
        return;
      }

      const assignedPseudonym = data.pseudonym || registeredUser.pseudonym;

      setItems(prevItems => prevItems.map(item => {
        if (item.id === activeBidItem.id) {
          const newBidObj = {
            id: `b-${Date.now()}`,
            amount: bidValue,
            bidder: assignedPseudonym,
            timestamp: 'Just now'
          };
          return {
            ...item,
            currentBid: bidValue,
            bids: [newBidObj, ...(item.bids || [])]
          };
        }
        return item;
      }));

      showNotification(
        `Bid of $${bidValue} recorded under hidden handle [${assignedPseudonym}].`,
        'Bid Placed Successfully'
      );

      setActiveBidItem(null);
      setCustomBidAmount('');
    } catch (err) {
      console.error("Bid error:", err);
      alert("Network error while placing bid.");
    }
  };

  const filteredItems = items.filter(item => {
    const itemCat = (item.category || '').toLowerCase().trim();
    const selectedCat = selectedCategory.toLowerCase().trim();

    const matchesCategory = selectedCat === 'all' || itemCat === selectedCat;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const sampleCMSYaml = `backend:
  name: github
  repo: wogutierrez/megusta-escatega
  branch: main

media_folder: "public/uploads"
public_folder: "/uploads"

collections:
  - name: "catalog"
    label: "Catalog Items"
    folder: "src/content/catalog"
    create: true
    slug: "{{slug}}"
    fields:
      - { label: "Title", name: "title", widget: "string" }
      - { label: "Listing Type", name: "listingType", widget: "select", options: ["Auction & Buy Now", "Buy Now Only"], default: "Auction & Buy Now" }
      - { label: "Fixed Price ($)", name: "price", widget: "number", value_type: "float" }
      - { label: "Minimum Bid ($)", name: "currentBid", widget: "number", value_type: "float", required: false }
      - { label: "Auction End Date & Time", name: "auctionEndDate", widget: "datetime", date_format: "YYYY-MM-DD", time_format: "HH:mm", required: false }
      - { label: "Category", name: "category", widget: "select", options: ["Electronics", "Clothing", "Furniture", "Vehicles", "Real Estate", "Others"] }
      - { label: "Condition", name: "condition", widget: "select", options: ["As-Is (Like New)", "As-Is (Excellent)", "As-Is (Very Good)", "As-Is (Good)"] }
      - { label: "Main Image", name: "image", widget: "image" }
      - { label: "Image 2", name: "image2", widget: "image", required: false }
      - { label: "Image 3", name: "image3", widget: "image", required: false }
      - { label: "Description", name: "description", widget: "text" }
      - { label: "Seller Tag", name: "sellerTag", widget: "string", default: "Verified Acquaintance" }`;

  const copyYamlToClipboard = () => {
    navigator.clipboard.writeText(sampleCMSYaml);
    setCopiedYaml(true);
    setTimeout(() => setCopiedYaml(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col antialiased selection:bg-emerald-500 selection:text-white">
      
      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 max-w-md bg-emerald-950 border border-emerald-500/50 text-emerald-100 p-4 rounded-xl shadow-2xl shadow-emerald-950/80 backdrop-blur-md flex items-start gap-3 animate-bounce-short">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-bold text-emerald-300 text-sm">{toast.title}</h4>
            <p className="text-xs text-emerald-200/90 mt-1 leading-relaxed">{toast.message}</p>
          </div>
          <button onClick={() => setToast(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <ShoppingBag className="w-5 h-5 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white">megusta<span className="text-emerald-400">.escatega.com</span></span>
                <span className="px-2 py-0.5 text-[10px] uppercase font-mono tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">Private Network</span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Consignment Direct Network • Mercadito Confiable</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {registeredUser ? (
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-xs font-mono">
                  Handle: {registeredUser.pseudonym}
                </span>
                <button
                  onClick={() => {
                    localStorage.removeItem('megusta_user');
                    setRegisteredUser(null);
                    showNotification('Signed out from local session.', 'Session Closed');
                  }}
                  className="text-[10px] text-slate-400 hover:text-red-400 underline"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSignInModal(true)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg text-xs transition-all border border-slate-700"
                >
                  Already Registered? Sign In
                </button>
                <button
                  onClick={() => setShowRegisterModal(true)}
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs transition-all shadow-md"
                >
                  Register to Bid / Buy
                </button>
              </div>
            )}

            <button 
              onClick={() => setShowConsignmentModal(true)}
              className="px-3 py-2 text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-lg transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span className="hidden md:inline">Consign an Item</span>
              <span className="md:hidden">Consign</span>
            </button>

            <button 
              onClick={() => setShowCMSGuide(true)}
              className="px-3 py-2 text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-lg transition-all flex items-center gap-1.5"
            >
              <Code className="w-4 h-4 text-teal-400" />
              <span className="hidden md:inline">CMS & Cloudflare Setup</span>
              <span className="md:hidden">CMS Guide</span>
            </button>
          </div>
        </div>

        {/* Subheader Search and Category Pills */}
        <div className="bg-slate-950/60 border-t border-slate-800/40 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            
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

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
              {CATEGORIES.map(cat => (
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

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-slate-800/90 via-slate-900 to-slate-900 border border-slate-800 relative overflow-hidden shadow-xl">
          <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" /> Trusted Peer-to-Peer Peer Consignment
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Curated household goods from verified acquaintances.
            </h1>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Buy directly for a fixed price or submit pseudonymous bids. Bidders stay private with randomized handles. Every transaction is coordinated directly via <span className="font-mono text-emerald-400">info@escatega.com</span> with zero public username disclosures.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Available Listings</span>
            <span className="text-xs bg-slate-800 text-slate-400 font-mono px-2 py-0.5 rounded-full">{filteredItems.length} items</span>
          </h2>
          {selectedCategory !== 'All' && (
            <button 
              onClick={() => setSelectedCategory('All')} 
              className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
            >
              Reset Category
            </button>
          )}
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-slate-800/30 rounded-2xl border border-slate-800">
            <Filter className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-300">No items found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">Try adjusting your search query or selecting a different category from the filters above.</p>
            <button 
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="mt-4 px-4 py-2 text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition-all"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
            {filteredItems.map(item => (
              <ProductCard 
                key={item.id} 
                item={item} 
                onBuy={() => setActiveBuyItem(item)}
                onBid={() => setActiveBidItem(item)}
                onViewHistory={() => setActiveHistoryItem(item)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-slate-950 border-t border-slate-800/80 py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-500 flex items-center justify-center font-bold text-slate-950 text-xs">M</div>
            <span className="font-semibold text-slate-200">megusta.escatega.com</span>
            <span className="text-slate-600">•</span>
            <span>Consignment Direct Network</span>
          </div>
          <p className="text-slate-500 text-center md:text-right">
            Managed via Escatega Admin (<span className="text-slate-400 font-mono">info@escatega.com</span>). Hosted on Cloudflare Pages.
          </p>
        </div>
      </footer>

      {/* ================= MODALS & DRAWERS ================= */}

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
                <span className="text-xl font-extrabold text-teal-400">${activeBidItem.currentBid + activeBidItem.minBidIncrement}</span>
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
                    min={activeBidItem.currentBid + activeBidItem.minBidIncrement}
                    step={activeBidItem.minBidIncrement}
                    placeholder={`${activeBidItem.currentBid + activeBidItem.minBidIncrement}`}
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
                      onClick={() => setCustomBidAmount((activeBidItem.currentBid + inc).toString())}
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
                  <strong>Privacy Shield Active:</strong> Your email is kept strictly private. Publicly, your bid will display under an automatically generated handle (e.g. <em>SilverFalcon42</em>). Bids update instantly in the system database.
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
                  <p className="text-slate-400 text-[11px] mt-0.5">Send 3 clear photos, item description, and desired price directly to <span className="text-emerald-400 font-mono">info@escatega.com</span>.</p>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0">2</span>
                <div>
                  <h4 className="font-bold text-slate-200">Keep Item at Home</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">You retain custody of your item while it is listed on <span className="text-slate-300">megusta.escatega.com</span>.</p>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0">3</span>
                <div>
                  <h4 className="font-bold text-slate-200">Doorstep Pickup & Immediate Payout</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">Once a buyer confirms purchase or wins the bid, we handle pickup, delivery, and immediate cash or direct transfer payout.</p>
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
              Store inventory items as markdown/JSON in a GitHub repo connected to Cloudflare Pages with Sveltia CMS as your admin dashboard.
            </p>

            <div className="flex-1 overflow-y-auto my-4 space-y-4 pr-1 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <h4 className="font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Step 1: Deploy to Cloudflare Pages
                </h4>
                <p className="text-slate-400 leading-relaxed">
                  Connect your GitHub repository containing this project to Cloudflare Pages under your domain <span className="font-mono text-slate-300">escatega.com</span>.
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
                  Navigate to <span className="font-mono text-emerald-400">megusta.escatega.com/admin/</span> to upload photos, adjust prices, and publish items directly without touching code!
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

      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
            <button 
              onClick={() => { setShowRegisterModal(false); setRegMessage(''); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-xl font-bold text-white mb-1">Join Megusta Network</h2>
            <p className="text-xs text-slate-400 mb-6">Register your details once to receive private bidding handles and instant purchase updates.</p>

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

      {showSignInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
            <button 
              onClick={() => { setShowSignInModal(false); setSignInMessage(''); setSignInEmail(''); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-xl font-bold text-white mb-1">Sign In to Megusta</h2>
            <p className="text-xs text-slate-400 mb-6">Enter your registered email address to instantly restore your private bidding handle.</p>

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

    </div>
  );
}

// Live Countdown Timer Component for Auctions
function AuctionCountdown({ endDate }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false });

  useEffect(() => {
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
      <div className="flex items-center gap-1.5 text-xs text-red-400 font-mono font-semibold bg-red-500/10 px-2.5 py-1 rounded-lg border border-red-500/20">
        <Clock className="w-3.5 h-3.5" /> Auction Closed
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-xs text-teal-300 font-mono bg-teal-500/10 px-2.5 py-1 rounded-lg border border-teal-500/20">
      <Clock className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
      <span>
        {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s left
      </span>
    </div>
  );
}

// Product Card with Dynamic Auction & Buy-Now Support
function ProductCard({ item, onBuy, onBid, onViewHistory }) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

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

  const isBuyNowOnly = item.listingType === 'Buy Item';

  return (
    <div className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl overflow-hidden shadow-lg transition-all flex flex-col group">
      
      {/* Photo Carousel Header */}
      <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden">
        <img 
            src={activeImage} 
            alt={item.title}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-slate-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30 rounded-full">
            {item.category || 'General'}
          </span>
          <span className="px-2.5 py-1 text-[10px] font-semibold bg-slate-950/80 backdrop-blur-md text-slate-300 border border-slate-800 rounded-full">
            {item.condition || 'As-Is'}
          </span>
        </div>

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

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-white text-base leading-snug group-hover:text-emerald-300 transition-colors">
              {item.title}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-800/80">
          
          {/* Auction Countdown Timer */}
          {!isBuyNowOnly && item.auctionEndDate && (
            <div className="mb-3">
              <AuctionCountdown endDate={item.auctionEndDate} />
            </div>
          )}

          {/* Pricing Box */}
          {isBuyNowOnly ? (
            <div className="mb-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-500 block">Direct Purchase Price</span>
                <span className="text-xl font-black text-emerald-400">${item.price || 0}</span>
              </div>
              <span className="px-2.5 py-1 text-[10px] uppercase font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full">
                Fixed Price Only
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 mb-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-500 block">Buy Now Price</span>
                <span className="text-lg font-black text-emerald-400">${item.price || 0}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-mono text-slate-500 block">Highest Bidder</span>
                <div className="flex items-center justify-end gap-1">
                  <span className="text-lg font-bold text-white">${item.currentBid || 0}</span>
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

          {/* Masked Bidder Badge for Auctions */}
          {!isBuyNowOnly && item.bids && item.bids.length > 0 && (
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-4 px-1">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-400" /> High bidder:
                <span className="font-mono font-semibold text-slate-300">{item.bids[0].bidder}</span>
              </span>
              <button 
                onClick={onViewHistory} 
                className="text-emerald-400 hover:underline text-[10px]"
              >
                {item.bids.length} bid{item.bids.length > 1 ? 's' : ''} history
              </button>
            </div>
          )}

          {/* Action Buttons */}
          {isBuyNowOnly ? (
            <button
              onClick={onBuy}
              className="w-full py-2.5 bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/10"
            >
              <ShoppingBag className="w-3.5 h-3.5" /> Buy Now Directly
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onBuy}
                className="px-3 py-2.5 bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/10"
              >
                <ShoppingBag className="w-3.5 h-3.5" /> Buy Now
              </button>
              <button
                onClick={onBid}
                className="px-3 py-2.5 bg-slate-800 text-slate-200 hover:bg-slate-700 font-bold text-xs rounded-xl border border-slate-700/80 transition-all flex items-center justify-center gap-1.5"
              >
                <TrendingUp className="w-3.5 h-3.5 text-teal-400" /> Place Bid
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}