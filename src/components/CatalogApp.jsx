import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  ShieldCheck, 
  CheckCircle2, 
  Filter, 
  X
} from 'lucide-react';

// Import modular components
import Header from './Header';
import ProductCard from './ProductCard';
import Modals from './Modals';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Furniture', 'Vehicles', 'Real Estate', 'Others'];

export default function App({ initialItems = [] }) {
  const [items, setItems] = useState(initialItems);
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

    const minAllowed = (activeBidItem.currentBid || 0) + (activeBidItem.minBidIncrement || 5);
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
          itemId: activeBidItem.id || activeBidItem.slug,
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
      - { label: "Listing Type", name: "listingType", widget: "select", options: ["auction", "sell"], default: "auction" }
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

      {/* Render Modular Header Component */}
      <Header 
        registeredUser={registeredUser}
        onSignOut={() => {
          localStorage.removeItem('megusta_user');
          setRegisteredUser(null);
          showNotification('Signed out from local session.', 'Session Closed');
        }}
        onOpenSignIn={() => setShowSignInModal(true)}
        onOpenRegister={() => setShowRegisterModal(true)}
        onOpenConsignment={() => setShowConsignmentModal(true)}
        onOpenCMSGuide={() => setShowCMSGuide(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-slate-800/90 via-slate-900 to-slate-900 border border-slate-800 relative overflow-hidden shadow-xl">
          <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" /> Trusted Peer-to-Peer Consignment
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

      {/* Render Modular Modals Component */}
      <Modals 
        activeBuyItem={activeBuyItem}
        setActiveBuyItem={setActiveBuyItem}
        activeBidItem={activeBidItem}
        setActiveBidItem={setActiveBidItem}
        activeHistoryItem={activeHistoryItem}
        setActiveHistoryItem={setActiveHistoryItem}
        showConsignmentModal={showConsignmentModal}
        setShowConsignmentModal={setShowConsignmentModal}
        showCMSGuide={showCMSGuide}
        setShowCMSGuide={setShowCMSGuide}
        showRegisterModal={showRegisterModal}
        setShowRegisterModal={setShowRegisterModal}
        showSignInModal={showSignInModal}
        setShowSignInModal={setShowSignInModal}
        registeredUser={registeredUser}
        customBidAmount={customBidAmount}
        setCustomBidAmount={setCustomBidAmount}
        regForm={regForm}
        setRegForm={setRegForm}
        regLoading={regLoading}
        regMessage={regMessage}
        signInEmail={signInEmail}
        setSignInEmail={setSignInEmail}
        signInLoading={signInLoading}
        signInMessage={signInMessage}
        copiedYaml={copiedYaml}
        sampleCMSYaml={sampleCMSYaml}
        handleConfirmBuy={handleConfirmBuy}
        handlePlaceBid={handlePlaceBid}
        handleRegisterSubmit={handleRegisterSubmit}
        handleSignInSubmit={handleSignInSubmit}
        copyYamlToClipboard={copyYamlToClipboard}
      />

    </div>
  );
}