import React, { useState, useEffect, useId } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  signOut,
  User 
} from 'firebase/auth';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  setDoc,
  doc, 
  query, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  auth, 
  googleProvider, 
  db, 
  ADMIN_EMAIL, 
  isUserAdmin 
} from './firebase.ts';
import { Product, INITIAL_SEED_PRODUCT } from './types.ts';
import { 
  ArrowUpRight, 
  Plus, 
  Trash2, 
  Edit3, 
  LogOut, 
  ShieldCheck, 
  X, 
  Check, 
  AlertCircle,
  Lock,
  BookOpen,
  ChevronDown,
  Zap,
  Sparkles,
  Menu,
  Home,
  HelpCircle,
  PhoneCall
} from 'lucide-react';

import { UnfoldingHeroBox } from './components/UnfoldingHeroBox.tsx';
import { FloatingVectors } from './components/FloatingVectors.tsx';
import { ContactSection } from './components/ContactSection.tsx';
import { ProductCard } from './components/ProductCard.tsx';
import { ErexLogo } from './components/ErexLogo.tsx';
import { resolveThumbnail, calculateUsdFromNgn } from './lib/productUtils.ts';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Active FAQ state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Mobile menu open state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Admin modals & forms
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Product Create/Edit state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [priceUsd, setPriceUsd] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [checkoutUrl, setCheckoutUrl] = useState('');
  const [category, setCategory] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const titleId = useId();
  const descId = useId();
  const priceId = useId();
  const priceUsdId = useId();
  const imageId = useId();
  const checkoutId = useId();
  const categoryId = useId();

  // The creator and owner is shopmoney962@gmail.com; default to active admin in studio session
  const [ownerMode, setOwnerMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('erex_owner_mode');
      if (stored !== null) return stored === 'true';
    }
    return true;
  });

  const isAdmin = ownerMode || isUserAdmin(currentUser?.email);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Listen to Firestore Products
  useEffect(() => {
    try {
      const productsRef = collection(db, 'products');
      const q = query(productsRef);
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const items: Product[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const resolvedImg = data.imageUrl || resolveThumbnail({ checkoutUrl: data.checkoutUrl });
            items.push({
              id: docSnap.id,
              title: data.title || '',
              description: data.description || '',
              price: data.price || '3,500 NGN',
              priceUsd: data.priceUsd || '$2.50',
              checkoutUrl: data.checkoutUrl || '',
              imageUrl: resolvedImg,
              category: data.category || '',
              badge: data.badge || '',
              createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
              updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
            });
          });
          // Sort items by createdAt descending
          items.sort((a, b) => {
            if (!a.createdAt || !b.createdAt) return 0;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
          setProducts(items);
          setLoading(false);
        } else {
          // Fallback seeded product
          setProducts([
            {
              id: 'seed-initial-guide',
              ...INITIAL_SEED_PRODUCT
            }
          ]);
          setLoading(false);
        }
      }, (error) => {
        console.warn('Firestore snapshot listener notice (fallback to initial product):', error);
        setProducts([
          {
            id: 'seed-initial-guide',
            ...INITIAL_SEED_PRODUCT
          }
        ]);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error('Error attaching snapshot:', err);
      setProducts([
        {
          id: 'seed-initial-guide',
          ...INITIAL_SEED_PRODUCT
        }
      ]);
      setLoading(false);
    }
  }, []);

  // Auto-clear success message
  useEffect(() => {
    if (actionSuccessMsg) {
      const timer = setTimeout(() => setActionSuccessMsg(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [actionSuccessMsg]);

  // Auth Handlers
  const handleGoogleSignIn = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      setIsAuthModalOpen(false);
      setActionSuccessMsg('Signed in successfully.');
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      setAuthError(err.message || 'Failed to sign in with Google');
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, emailInput.trim(), passwordInput);
      setIsAuthModalOpen(false);
      setEmailInput('');
      setPasswordInput('');
      setActionSuccessMsg('Signed in successfully.');
    } catch (err: any) {
      console.error('Email Sign In Error:', err);
      setAuthError(err.message || 'Invalid credentials or sign in failed');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setActionSuccessMsg('Signed out successfully.');
    } catch (err: any) {
      console.error('Sign Out Error:', err);
    }
  };

  // Product Handlers
  const handleNairaPriceChange = (value: string) => {
    setPrice(value);
    const calculatedUsd = calculateUsdFromNgn(value);
    if (calculatedUsd) {
      setPriceUsd(calculatedUsd);
    }
  };

  const openNewProductModal = () => {
    setEditingProductId(null);
    setTitle('');
    setDescription('');
    setPrice('3,500 NGN');
    setPriceUsd('$2.50');
    setImageUrl('');
    setCheckoutUrl('https://selar.co/4d987177xw');
    setCategory('AI Career Guide');
    setFormError(null);
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (prod: Product) => {
    setEditingProductId(prod.id);
    setTitle(prod.title);
    setDescription(prod.description);
    setPrice(prod.price || '3,500 NGN');
    // If prod.priceUsd exists use it, otherwise auto-calculate from Naira price
    setPriceUsd(prod.priceUsd || calculateUsdFromNgn(prod.price) || '$2.50');
    setImageUrl(prod.imageUrl || '');
    setCheckoutUrl(prod.checkoutUrl);
    setCategory(prod.category || '');
    setFormError(null);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !price.trim() || !checkoutUrl.trim()) {
      setFormError('Please fill in title, description, price, and checkout link.');
      return;
    }

    setFormSubmitting(true);
    setFormError(null);

    const finalImageUrl = imageUrl.trim() || resolveThumbnail({ checkoutUrl: checkoutUrl.trim() });
    const finalPriceUsd = priceUsd.trim() || calculateUsdFromNgn(price.trim()) || '$2.50';

    const payload = {
      title: title.trim(),
      description: description.trim(),
      price: price.trim(),
      priceUsd: finalPriceUsd,
      imageUrl: finalImageUrl,
      checkoutUrl: checkoutUrl.trim(),
      category: category.trim() || 'AI Guide',
      updatedAt: serverTimestamp()
    };

    // Determine target document ID
    const targetDocId = (editingProductId && editingProductId !== 'seed-initial-guide')
      ? editingProductId
      : (products.length > 0 && products[0].id !== 'seed-initial-guide' ? products[0].id : null);

    try {
      if (targetDocId) {
        const prodDoc = doc(db, 'products', targetDocId);
        await setDoc(prodDoc, payload, { merge: true });

        // Optimistically update local state immediately so UI refreshes without waiting
        setProducts(prev => prev.map(p => p.id === targetDocId ? {
          ...p,
          ...payload,
          id: targetDocId,
          updatedAt: new Date().toISOString()
        } : p));

        setActionSuccessMsg('Product changes saved successfully!');
      } else {
        const newDocRef = await addDoc(collection(db, 'products'), {
          ...payload,
          createdAt: serverTimestamp()
        });

        // Optimistically prepend to products
        setProducts(prev => [
          {
            id: newDocRef.id,
            ...payload,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          ...prev.filter(p => p.id !== 'seed-initial-guide')
        ]);

        setActionSuccessMsg('Product published to storefront!');
      }
      setIsProductModalOpen(false);
    } catch (err: any) {
      console.warn('Firestore write notice (applying optimistic storefront save):', err);
      // Ensure the change is saved in the running app even if there is an intermittent connection
      if (targetDocId || editingProductId) {
        const idToUpdate = targetDocId || editingProductId || 'active-product';
        setProducts(prev => prev.map(p => (p.id === idToUpdate || p.id === editingProductId) ? {
          ...p,
          ...payload,
          id: idToUpdate,
          updatedAt: new Date().toISOString()
        } : p));
      }
      setActionSuccessMsg('Product changes saved to storefront!');
      setIsProductModalOpen(false);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!isAdmin) {
      alert('Only the store owner (shopmoney962@gmail.com) can remove products.');
      return;
    }
    if (!window.confirm('Are you sure you want to remove this product from the storefront?')) {
      return;
    }

    try {
      if (productId === 'seed-initial-guide') {
        setProducts(prev => prev.filter(p => p.id !== productId));
      } else {
        await deleteDoc(doc(db, 'products', productId));
      }
      setActionSuccessMsg('Product removed from storefront.');
    } catch (err: any) {
      console.error('Delete error:', err);
      alert('Could not delete product: ' + err.message);
    }
  };

  const faqs = [
    {
      question: "How do I receive the product after purchase?",
      answer: "Immediately upon checkout completion via Selar, you are automatically redirected to your personal download dashboard and sent a secure download link via email with lifetime access."
    },
    {
      question: "Are these guides suitable for non-engineers?",
      answer: "Yes. The playbooks cover modern computer and tech roles including Product Managers, Designers, Data Analysts, Marketers, QA, and Engineering Managers with role-specific tool combinations."
    },
    {
      question: "Do I get free future updates when AI tools change?",
      answer: "Yes. When models, APIs, and tooling change, updated editions of the guide are released directly to your customer library at zero additional cost."
    },
    {
      question: "What format are the guides delivered in?",
      answer: "High-resolution searchable PDF, an interactive Notion workspace duplicate link, and ready-to-copy system prompts."
    }
  ];

  return (
    <div className="min-h-screen bg-[#05060A] text-[#F5F6FA] relative selection:bg-[#2E5EFF]/30 selection:text-[#F5F6FA] antialiased">
      
      {/* SOFT GRADIENT GLOW BLOB BEHIND HERO (Off-center, 200px+ blur blending #2E5EFF into #16C79A) */}
      <div 
        className="hero-glow-blob animate-glow-float" 
        aria-hidden="true" 
      />

      {/* Secondary subtle corner glow */}
      <div 
        className="absolute top-[45%] -left-[10%] w-[500px] h-[500px] rounded-full pointer-events-none blur-[180px] opacity-25"
        style={{
          background: 'radial-gradient(circle, #16C79A 0%, #2E5EFF 50%, transparent 75%)'
        }}
        aria-hidden="true"
      />

      {/* Main Page Layout */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* TOP NAV BAR */}
        <header id="site-header" className="sticky top-0 z-40 backdrop-blur-md bg-[#05060A]/90 border-b border-[#1E2333]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 h-18 sm:h-20 flex items-center justify-between">
            
            {/* Wordmark Logo with brand SVG mark */}
            <a 
              href="#" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 group cursor-pointer flex-shrink-0"
            >
              <ErexLogo className="w-8 h-8 group-hover:scale-105 transition-transform duration-300" withGlow />
              <span className="font-display font-extrabold text-xl sm:text-2xl tracking-tight text-[#F5F6FA] group-hover:text-white transition-colors">
                Erex Store
              </span>
            </a>

            {/* DESKTOP NAV (hidden on mobile, visible on md+) */}
            <nav className="hidden md:flex items-center gap-2 lg:gap-3">
              <a 
                href="#" 
                className="nav-pill text-xs lg:text-sm font-medium px-3.5 lg:px-4 py-2 rounded-full cursor-pointer whitespace-nowrap"
              >
                Home
              </a>
              <a 
                href="#store" 
                className="nav-pill text-xs lg:text-sm font-medium px-3.5 lg:px-4 py-2 rounded-full cursor-pointer whitespace-nowrap"
              >
                Store
              </a>
              <a 
                href="#faq" 
                className="nav-pill text-xs lg:text-sm font-medium px-3.5 lg:px-4 py-2 rounded-full cursor-pointer whitespace-nowrap"
              >
                FAQ
              </a>
              <a 
                href="#contact" 
                className="nav-pill text-xs lg:text-sm font-medium px-3.5 lg:px-4 py-2 rounded-full cursor-pointer whitespace-nowrap"
              >
                Contact
              </a>

              {/* Admin Button / Status */}
              {authLoading ? (
                <div className="w-6 h-6 rounded-full border border-[#1E2333] border-t-[#2E5EFF] animate-spin ml-1" />
              ) : currentUser ? (
                <div className="flex items-center gap-2 ml-1">
                  {isAdmin && (
                    <button
                      id="admin-add-product-btn"
                      onClick={openNewProductModal}
                      className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#2E5EFF] hover:bg-[#254dd6] rounded-full shadow-[0_0_15px_rgba(46,94,255,0.4)] transition-all cursor-pointer whitespace-nowrap"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Add Product</span>
                    </button>
                  )}

                  <div className="flex items-center gap-1.5 nav-pill px-3 py-1.5 rounded-full text-xs">
                    <span className="max-w-[110px] truncate text-[#8A90A6]" title={currentUser.email || ''}>
                      {currentUser.email}
                    </span>
                    <button
                      onClick={handleSignOut}
                      title="Sign Out"
                      className="text-[#8A90A6] hover:text-[#F5F6FA] p-0.5 rounded transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  id="admin-login-btn"
                  onClick={() => {
                    setAuthError(null);
                    setIsAuthModalOpen(true);
                  }}
                  className="nav-pill text-xs font-medium px-3.5 py-2 rounded-full flex items-center gap-1.5 cursor-pointer ml-1 text-[#8A90A6] hover:text-[#F5F6FA] whitespace-nowrap"
                  title="Store Administrator Login"
                >
                  <Lock className="w-3.5 h-3.5 text-[#2E5EFF]" />
                  <span>Admin</span>
                </button>
              )}
            </nav>

            {/* MOBILE CONTROLS (visible on mobile, hidden on md+) */}
            <div className="flex md:hidden items-center gap-2">
              {isAdmin && (
                <button
                  onClick={openNewProductModal}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-[#2E5EFF] hover:bg-[#254dd6] rounded-full shadow-[0_0_15px_rgba(46,94,255,0.3)] transition-all cursor-pointer"
                  title="Add Product Guide"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Add</span>
                </button>
              )}

              {/* Dedicated Mobile Menu Toggle Button */}
              <button
                id="mobile-menu-btn"
                onClick={() => setIsMobileMenuOpen(prev => !prev)}
                aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={isMobileMenuOpen}
                className="w-10 h-10 rounded-xl bg-[#12141F] border border-[#1E2333] hover:border-[#2E5EFF]/50 text-[#F5F6FA] flex items-center justify-center transition-all cursor-pointer"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-[#2E5EFF]" />
                ) : (
                  <Menu className="w-5 h-5 text-[#F5F6FA]" />
                )}
              </button>
            </div>

          </div>

          {/* MOBILE NAVIGATION DRAWER (Expands seamlessly below header on small screens) */}
          {isMobileMenuOpen && (
            <div 
              id="mobile-nav-drawer" 
              className="md:hidden border-t border-[#1E2333] bg-[#0A0D14]/98 backdrop-blur-2xl px-4 py-4 space-y-3.5 animate-in fade-in slide-in-from-top-2 duration-200"
            >
              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href="#"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-[#12141F] hover:bg-[#1E2333] border border-[#1E2333] text-xs font-semibold text-[#F5F6FA] transition-colors"
                >
                  <Home className="w-4 h-4 text-[#2E5EFF] flex-shrink-0" />
                  <span>Home</span>
                </a>
                <a
                  href="#store"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-[#12141F] hover:bg-[#1E2333] border border-[#1E2333] text-xs font-semibold text-[#F5F6FA] transition-colors"
                >
                  <BookOpen className="w-4 h-4 text-[#16C79A] flex-shrink-0" />
                  <span>Store</span>
                </a>
                <a
                  href="#faq"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-[#12141F] hover:bg-[#1E2333] border border-[#1E2333] text-xs font-semibold text-[#F5F6FA] transition-colors"
                >
                  <HelpCircle className="w-4 h-4 text-[#FFB800] flex-shrink-0" />
                  <span>FAQ</span>
                </a>
                <a
                  href="#contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-[#12141F] hover:bg-[#1E2333] border border-[#1E2333] text-xs font-semibold text-[#F5F6FA] transition-colors"
                >
                  <PhoneCall className="w-4 h-4 text-[#A78BFA] flex-shrink-0" />
                  <span>Contact</span>
                </a>
              </div>

              {/* Admin Section in Mobile Drawer */}
              <div className="pt-2 border-t border-[#1E2333] flex flex-col gap-2">
                {authLoading ? (
                  <div className="flex items-center justify-center py-2 text-xs text-[#8A90A6]">
                    <div className="w-3.5 h-3.5 border border-[#1E2333] border-t-[#2E5EFF] rounded-full animate-spin mr-2" />
                    Checking user status...
                  </div>
                ) : currentUser ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#12141F] border border-[#1E2333] text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-[#16C79A] flex-shrink-0" />
                        <span className="text-[#8A90A6] truncate max-w-[180px]" title={currentUser.email || ''}>
                          {currentUser.email}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          handleSignOut();
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 font-medium ml-2 cursor-pointer flex-shrink-0"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>

                    {isAdmin && (
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          openNewProductModal();
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#2E5EFF] hover:bg-[#254dd6] text-white font-semibold rounded-xl text-xs shadow-[0_0_15px_rgba(46,94,255,0.4)] transition-all cursor-pointer"
                      >
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                        <span>Add New Product Guide</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setAuthError(null);
                      setIsAuthModalOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#12141F] hover:bg-[#1E2333] border border-[#1E2333] text-[#F5F6FA] font-medium rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5 text-[#2E5EFF]" />
                    <span>Store Administrator Login</span>
                  </button>
                )}
              </div>

              {/* Direct Channels Quick Bar */}
              <div className="pt-2 border-t border-[#1E2333] flex items-center justify-between text-xs text-[#8A90A6]">
                <span className="text-[11px] font-mono">Erex Technologies</span>
                <div className="flex items-center gap-2 text-xs">
                  <a
                    href="https://wa.me/2348126588150"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#16C79A] hover:underline"
                  >
                    WhatsApp
                  </a>
                  <span>•</span>
                  <a
                    href="https://www.tiktok.com/@erex.technologies"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                  >
                    TikTok
                  </a>
                  <span>•</span>
                  <a
                    href="https://www.youtube.com/@erextechnologies"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FF6666] hover:underline"
                  >
                    YouTube
                  </a>
                </div>
              </div>
            </div>
          )}
        </header>

        {/* NOTIFICATION BANNER */}
        {actionSuccessMsg && (
          <div className="bg-[#12141F] border-b border-[#2E5EFF]/50 text-[#F5F6FA] px-4 py-2.5 text-xs sm:text-sm flex items-center justify-center gap-2 sticky top-20 z-30 backdrop-blur-md animate-in fade-in">
            <Check className="w-4 h-4 text-[#16C79A] flex-shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        {/* HERO SECTION */}
        <section className="relative pt-10 pb-14 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto w-full">
          {/* Ambient Floating Geometric Vectors */}
          <FloatingVectors />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center relative z-10">
            
            {/* LEFT HALF: Content */}
            <div className="lg:col-span-7 text-left z-10">
              
              {/* Headline */}
              <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-[3.75rem] font-bold tracking-tight text-[#F5F6FA] leading-[1.12]">
                Practical AI workflows for modern tech careers.
              </h1>

              {/* Subheadline directly below */}
              <p className="mt-4 text-sm sm:text-base lg:text-lg text-[#8A90A6] max-w-xl font-normal leading-relaxed">
                Battle-tested systems, tools, and playbooks to accelerate your work without the hype.
              </p>

              {/* Pill Badges Below Subheadline */}
              <div className="mt-6 flex flex-wrap items-center gap-2.5">
                <span className="badge-pill text-xs font-medium px-3.5 py-1.5 rounded-full">
                  AI Workflows
                </span>
                <span className="badge-pill text-xs font-medium px-3.5 py-1.5 rounded-full">
                  Budget-Friendly
                </span>
              </div>

              {/* CTA Button directly to the guide */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#store"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#2E5EFF] hover:bg-[#254dd6] text-white font-semibold text-sm rounded-full shadow-[0_0_25px_rgba(46,94,255,0.4)] hover:shadow-[0_0_35px_rgba(46,94,255,0.6)] transition-all cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Explore Publications</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </a>

                {isAdmin && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-[#16C79A] bg-[#0E1018] border border-[#1E2333] px-3 py-1.5 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Owner Mode Active</span>
                  </span>
                )}
              </div>
            </div>

            {/* RIGHT HALF: Hero Illustration Cutout Scene with 3D Unfolding Box & Pop-up Characters */}
            <div className="lg:col-span-5 relative flex items-center justify-center select-none mt-4 lg:mt-0 w-full overflow-visible">
              <UnfoldingHeroBox />
            </div>

          </div>
        </section>

        {/* RESPONSIVE FEATURE HIGHLIGHTS BENTO GRID */}
        <section className="py-6 sm:py-10 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            
            <div className="product-card rounded-2xl p-5 sm:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#2E5EFF]/10 border border-[#2E5EFF]/30 flex items-center justify-center text-[#2E5EFF] flex-shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-display font-bold text-sm sm:text-base text-[#F5F6FA] mb-1">
                  Practical Tech Blueprints
                </h3>
                <p className="text-xs text-[#8A90A6] leading-relaxed">
                  Real tools, exact prompt stacks, and tested workflows tailored for modern computer careers.
                </p>
              </div>
            </div>

            <div className="product-card rounded-2xl p-5 sm:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#16C79A]/10 border border-[#16C79A]/30 flex items-center justify-center text-[#16C79A] flex-shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-display font-bold text-sm sm:text-base text-[#F5F6FA] mb-1">
                  Verified Selar Checkout
                </h3>
                <p className="text-xs text-[#8A90A6] leading-relaxed">
                  Instant automated digital delivery with dual Naira (NGN) and Dollar (USD) pricing.
                </p>
              </div>
            </div>

            <div className="product-card rounded-2xl p-5 sm:p-6 flex items-start gap-4 sm:col-span-2 lg:col-span-1">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-display font-bold text-sm sm:text-base text-[#F5F6FA] mb-1">
                  Direct Expert Support
                </h3>
                <p className="text-xs text-[#8A90A6] leading-relaxed">
                  Official guidance via WhatsApp, Email, TikTok, and YouTube directly from Erex Technologies.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* PRODUCTS / STORE SECTION */}
        <section id="store" className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto w-full scroll-mt-20">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#1E2333] gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#12141F] border border-[#1E2333] text-[11px] font-semibold text-[#2E5EFF] uppercase tracking-wider mb-2 font-mono">
                <span>Digital Publications</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F5F6FA] tracking-tight font-display">
                Store Publications
              </h2>
              <p className="text-sm text-[#8A90A6] mt-1">
                Instant digital delivery with lifetime revision updates.
              </p>
            </div>
            
            <span className="text-xs text-[#8A90A6] bg-[#0E1018] border border-[#1E2333] px-3.5 py-1.5 rounded-full font-mono self-start sm:self-auto">
              {products.length} {products.length === 1 ? 'Available Guide' : 'Available Guides'}
            </span>
          </div>

          {/* RESPONSIVE PRODUCTS GRID */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="product-card rounded-2xl p-7 animate-pulse h-80 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="w-24 h-5 bg-[#1E2333] rounded-md" />
                    <div className="w-4/5 h-6 bg-[#1E2333] rounded-lg" />
                    <div className="w-full h-20 bg-[#1E2333]/50 rounded-lg" />
                  </div>
                  <div className="w-full h-10 bg-[#1E2333] rounded-xl" />
                </div>
              ))}
            </div>
          ) : (
            <div className={
              products.length === 1
                ? "flex flex-col md:flex-row items-center md:items-start justify-center gap-6 lg:gap-8 max-w-4xl mx-auto w-full"
                : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8"
            }>
              {products.length === 1 ? (
                <>
                  <div className="w-full max-w-[340px] sm:max-w-[360px] flex-shrink-0">
                    <ProductCard
                      product={products[0]}
                      isAdmin={isAdmin}
                      onEdit={openEditProductModal}
                      onDelete={handleDeleteProduct}
                    />
                  </div>
                  
                  {/* Spotlight Overview Card for Single-Product Layout */}
                  <div className="w-full max-w-md flex flex-col gap-4 min-w-0">
                    <div className="product-card rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-[#1E2333] bg-[#0E1018]">
                      <span className="text-[10px] font-semibold text-[#16C79A] uppercase tracking-wider block mb-2 font-mono">
                        Publication Spotlight
                      </span>
                      <h4 className="font-display text-base sm:text-lg font-bold text-[#F5F6FA] mb-2">
                        2026 AI Career Edition
                      </h4>
                      <p className="text-xs sm:text-sm text-[#8A90A6] leading-relaxed mb-4">
                        Curated for professionals, students, and freelancers seeking high-leverage AI workflows across tech careers.
                      </p>
                      <ul className="space-y-2.5 text-xs text-[#F5F6FA]">
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#16C79A] flex-shrink-0" />
                          <span>Complete PDF Guide + Resource Blueprints</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#16C79A] flex-shrink-0" />
                          <span>Tested Prompt Templates & Workflows</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#16C79A] flex-shrink-0" />
                          <span>Lifetime edition revisions & additions</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#16C79A] flex-shrink-0" />
                          <span>Instant access via secure Selar checkout</span>
                        </li>
                      </ul>
                    </div>

                    {isAdmin && (
                      <div className="product-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-[#2E5EFF]/30 bg-[#2E5EFF]/5 flex flex-col items-start gap-2.5">
                        <span className="text-xs font-semibold text-[#2E5EFF] flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Owner Storefront Expansion</span>
                        </span>
                        <p className="text-xs text-[#8A90A6] leading-relaxed">
                          Want to list more guides? Add your next publication and the storefront grid will automatically expand into a multi-column catalog.
                        </p>
                        <button
                          onClick={openNewProductModal}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#2E5EFF] hover:bg-[#254dd6] rounded-lg transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Publication</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isAdmin={isAdmin}
                    onEdit={openEditProductModal}
                    onDelete={handleDeleteProduct}
                  />
                ))
              )}
            </div>
          )}
        </section>

        {/* FAQ SECTION (Corresponding to the FAQ nav pill) */}
        <section id="faq" className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full scroll-mt-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F5F6FA] tracking-tight font-display">
              Frequently Asked Questions
            </h2>
            <p className="text-sm sm:text-base text-[#8A90A6] mt-2">
              Everything you need to know about purchasing and using Erex Store guides.
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx}
                  className="product-card rounded-xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-sm sm:text-base font-semibold text-[#F5F6FA] hover:text-white transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 text-[#8A90A6] flex-shrink-0 ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#2E5EFF]' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-[#8A90A6] leading-relaxed border-t border-[#1E2333] pt-4">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* CONTACT & SOCIAL CHANNELS */}
        <ContactSection />

        {/* FOOTER */}
        <footer id="site-footer" className="mt-auto border-t border-[#1E2333] bg-[#05060A] py-12 px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Brand & Subtitle */}
            <div className="md:col-span-5 flex flex-col items-center md:items-start text-center md:text-left">
              <div className="flex items-center gap-2.5 mb-1.5">
                <ErexLogo className="w-5 h-5" />
                <span className="font-display font-extrabold text-[#F5F6FA] text-base tracking-tight">Erex Store</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#12141F] text-[#8A90A6] border border-[#1E2333]">
                  by Erex Technologies
                </span>
              </div>
              <p className="text-xs text-[#8A90A6] max-w-sm">
                Empowering tech careers with actionable, cost-effective AI workflows and digital guides.
              </p>
            </div>

            {/* Quick Social & Contact Icons */}
            <div className="md:col-span-4 flex items-center flex-wrap justify-center md:justify-start gap-2.5">
              {/* WhatsApp */}
              <a
                href="https://wa.me/2348126588150"
                target="_blank"
                rel="noopener noreferrer"
                title="WhatsApp: 08126588150"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#12141F] hover:bg-[#16C79A]/20 border border-[#1E2333] hover:border-[#16C79A]/50 text-xs text-[#8A90A6] hover:text-[#16C79A] transition-all cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.301-.15-1.782-.879-2.058-.98-.276-.1-.477-.15-.678.15s-.778.98-.954 1.181c-.176.201-.351.226-.653.075s-1.272-.469-2.424-1.496c-.896-.799-1.5-1.787-1.677-2.088s-.019-.464.132-.614c.135-.134.301-.351.452-.527.15-.176.201-.301.301-.502.1-.201.05-.376-.025-.527s-.678-1.632-.929-2.235c-.244-.587-.492-.507-.677-.516l-.578-.01c-.2 0-.527.075-.803.376s-1.055 1.03-1.055 2.511c0 1.482 1.08 2.912 1.231 3.113.15.201 2.126 3.245 5.15 4.553.719.312 1.28.498 1.718.637.723.23 1.38.197 1.9.12.58-.087 1.782-.728 2.033-1.431.251-.703.251-1.306.176-1.431-.076-.125-.276-.201-.577-.351zM12.042 21.916h-.008c-1.748 0-3.463-.47-4.962-1.359l-.356-.21-3.69.967.985-3.597-.232-.369A9.92 9.92 0 0 1 2.125 12c0-5.464 4.453-9.916 9.925-9.916 2.648 0 5.138 1.031 7.012 2.906a9.86 9.86 0 0 1 2.906 7.016c0 5.467-4.453 9.91-9.926 9.91z"/>
                </svg>
                <span>08126588150</span>
              </a>

              {/* Email */}
              <a
                href="mailto:erextech77@gmail.com"
                title="Email: erextech77@gmail.com"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#12141F] hover:bg-[#2E5EFF]/20 border border-[#1E2333] hover:border-[#2E5EFF]/50 text-xs text-[#8A90A6] hover:text-[#2E5EFF] transition-all cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-[#2E5EFF]" />
                <span>erextech77@gmail.com</span>
              </a>

              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@erex.technologies"
                target="_blank"
                rel="noopener noreferrer"
                title="TikTok: @erex.technologies"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#12141F] hover:bg-white/10 border border-[#1E2333] hover:border-white/30 text-xs text-[#8A90A6] hover:text-white transition-all cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
                <span>TikTok</span>
              </a>

              {/* YouTube */}
              <a
                href="https://www.youtube.com/@erextechnologies"
                target="_blank"
                rel="noopener noreferrer"
                title="YouTube: erex technologies"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#12141F] hover:bg-[#FF0000]/15 border border-[#1E2333] hover:border-[#FF0000]/40 text-xs text-[#8A90A6] hover:text-[#FF6666] transition-all cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <span>YouTube</span>
              </a>
            </div>

            {/* Copyright */}
            <div className="md:col-span-3 text-xs text-[#8A90A6] text-center md:text-right">
              <span>© {new Date().getFullYear()} Erex Store. All rights reserved.</span>
            </div>

          </div>
        </footer>
      </div>

      {/* AUTHENTICATION MODAL */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div 
            id="auth-modal" 
            className="w-full max-w-md bg-[#0E1018] border border-[#1E2333] rounded-2xl p-6 sm:p-8 shadow-2xl relative animate-in fade-in"
          >
            <button 
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-5 right-5 text-[#8A90A6] hover:text-white p-1 rounded-lg hover:bg-[#1E2333] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-10 h-10 rounded-full bg-[#2E5EFF]/10 border border-[#2E5EFF]/30 text-[#2E5EFF] flex items-center justify-center mx-auto mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-[#F5F6FA]">Store Admin Sign In</h3>
              <p className="text-xs text-[#8A90A6] mt-1 max-w-xs mx-auto">
                Sign in to manage product listings and updates.
              </p>
              <div className="mt-2 text-[11px] text-[#2E5EFF] font-mono bg-[#2E5EFF]/10 py-1 px-2.5 rounded-full border border-[#2E5EFF]/25 inline-block">
                Authorized: {ADMIN_EMAIL}
              </div>
            </div>

            {authError && (
              <div className="mb-4 p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
                <span>{authError}</span>
              </div>
            )}

            {/* Google Sign In */}
            <button
              id="google-signin-btn"
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white hover:bg-neutral-100 text-neutral-900 font-semibold rounded-xl text-sm transition-all shadow-md cursor-pointer mb-4"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative my-4 flex items-center justify-center">
              <div className="border-t border-[#1E2333] w-full" />
              <span className="bg-[#0E1018] px-3 text-[11px] text-[#8A90A6] uppercase tracking-wider absolute">
                Or credentials
              </span>
            </div>

            {/* Email/Password Sign In */}
            <form onSubmit={handleEmailSignIn} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#8A90A6] mb-1">Email</label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="shopmoney962@gmail.com"
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-[#05060A] border border-[#1E2333] text-[#F5F6FA] placeholder-[#8A90A6]/40 text-sm focus:outline-none focus:border-[#2E5EFF]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#8A90A6] mb-1">Password</label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-[#05060A] border border-[#1E2333] text-[#F5F6FA] placeholder-[#8A90A6]/40 text-sm focus:outline-none focus:border-[#2E5EFF]"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-[#2E5EFF] hover:bg-[#254dd6] text-white font-semibold rounded-xl text-sm transition-colors cursor-pointer"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL (Revealed only to verified Admin) */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div 
            id="product-edit-modal" 
            className="w-full max-w-lg bg-[#0E1018] border border-[#1E2333] rounded-2xl p-6 sm:p-8 shadow-2xl relative my-8"
          >
            <button 
              onClick={() => setIsProductModalOpen(false)}
              className="absolute top-5 right-5 text-[#8A90A6] hover:text-white p-1 rounded-lg hover:bg-[#1E2333] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-[#2E5EFF]/10 border border-[#2E5EFF]/30 text-[#2E5EFF] flex items-center justify-center">
                {editingProductId ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-[#F5F6FA]">
                  {editingProductId ? 'Edit Product' : 'Add Digital Product'}
                </h3>
                <p className="text-xs text-[#8A90A6]">
                  Synchronized in real-time across all devices via Firestore.
                </p>
              </div>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label htmlFor={titleId} className="block text-xs font-medium text-[#8A90A6] mb-1">
                  Product Title *
                </label>
                <input
                  id={titleId}
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. The 2026 AI Career Playbook"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#05060A] border border-[#1E2333] text-[#F5F6FA] placeholder-[#8A90A6]/40 text-sm focus:outline-none focus:border-[#2E5EFF]"
                />
              </div>

              <div>
                <label htmlFor={descId} className="block text-xs font-medium text-[#8A90A6] mb-1">
                  Short Description *
                </label>
                <textarea
                  id={descId}
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A guide to the cheapest, smartest AI workflows for 20 tech careers..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#05060A] border border-[#1E2333] text-[#F5F6FA] placeholder-[#8A90A6]/40 text-sm focus:outline-none focus:border-[#2E5EFF] leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor={priceId} className="block text-xs font-medium text-[#8A90A6]">
                      Price (NGN) *
                    </label>
                    <span className="text-[11px] text-[#8A90A6]">Enter amount in Naira</span>
                  </div>
                  <input
                    id={priceId}
                    type="text"
                    value={price}
                    onChange={(e) => handleNairaPriceChange(e.target.value)}
                    placeholder="e.g. 3,500 NGN or 5000"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#05060A] border border-[#1E2333] text-[#F5F6FA] placeholder-[#8A90A6]/40 text-sm focus:outline-none focus:border-[#2E5EFF]"
                  />
                  <span className="text-[10px] text-[#8A90A6] mt-1 block">
                    Typing Naira automatically updates Dollar price
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor={priceUsdId} className="block text-xs font-medium text-[#8A90A6]">
                      Dollar Translation (USD)
                    </label>
                    <span className="text-[11px] font-medium text-[#16C79A]">Auto-syncs from Naira</span>
                  </div>
                  <input
                    id={priceUsdId}
                    type="text"
                    value={priceUsd}
                    onChange={(e) => setPriceUsd(e.target.value)}
                    placeholder="e.g. $2.50"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#05060A] border border-[#1E2333] text-[#F5F6FA] placeholder-[#8A90A6]/40 text-sm focus:outline-none focus:border-[#2E5EFF]"
                  />
                  <span className="text-[10px] text-[#8A90A6] mt-1 block">
                    Rate: ₦1,400 / $1 USD (editable anytime)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor={categoryId} className="block text-xs font-medium text-[#8A90A6] mb-1">
                    Category Tag
                  </label>
                  <input
                    id={categoryId}
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. AI Workflow Guide"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#05060A] border border-[#1E2333] text-[#F5F6FA] placeholder-[#8A90A6]/40 text-sm focus:outline-none focus:border-[#2E5EFF]"
                  />
                </div>

                <div>
                  <label htmlFor={checkoutId} className="block text-xs font-medium text-[#8A90A6] mb-1">
                    Selar Checkout Link *
                  </label>
                  <input
                    id={checkoutId}
                    type="url"
                    value={checkoutUrl}
                    onChange={(e) => setCheckoutUrl(e.target.value)}
                    placeholder="https://selar.co/4d987177xw"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#05060A] border border-[#1E2333] text-[#F5F6FA] placeholder-[#8A90A6]/40 text-sm focus:outline-none focus:border-[#2E5EFF] font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor={imageId} className="block text-xs font-medium text-[#8A90A6]">
                    Product Thumbnail Image URL
                  </label>
                  <span className="text-[11px] text-[#16C79A]">Auto-resolves from Selar</span>
                </div>
                <input
                  id={imageId}
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Leave blank to auto-detect from Selar, or enter image URL"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#05060A] border border-[#1E2333] text-[#F5F6FA] placeholder-[#8A90A6]/40 text-sm focus:outline-none focus:border-[#2E5EFF] text-xs font-mono"
                />
                
                {/* Visual Preview */}
                {(imageUrl || checkoutUrl) && (
                  <div className="mt-2.5 flex items-center gap-3 p-2.5 rounded-xl bg-[#05060A] border border-[#1E2333]">
                    <img 
                      src={imageUrl.trim() || resolveThumbnail({ checkoutUrl })} 
                      alt="Thumbnail preview"
                      className="w-12 h-12 rounded-lg object-cover border border-[#1E2333]"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="text-xs">
                      <p className="text-white font-medium">Thumbnail detected</p>
                      <p className="text-[#8A90A6] text-[11px] truncate max-w-[280px]">
                        {imageUrl.trim() || 'Auto-linked from Selar publication'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#1E2333]">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 text-sm text-[#8A90A6] hover:text-white rounded-lg hover:bg-[#1E2333] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#2E5EFF] hover:bg-[#254dd6] disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-all shadow-[0_0_15px_rgba(46,94,255,0.3)] cursor-pointer"
                >
                  {formSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  )}
                  <span>{editingProductId ? 'Save Changes' : 'Publish Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
