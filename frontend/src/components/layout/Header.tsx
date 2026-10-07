'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Send, Menu, X, Phone, MapPin, ChevronRight, ChevronLeft, Heart, User } from 'lucide-react';

interface MenuVisualCard {
  title: string;
  image: string;
  link: string;
  tagline?: string;
}

interface MenuItemNode {
  id: string;
  title: string;
  href?: string;
  tagline?: string;
  children?: MenuItemNode[];
  visualCards?: MenuVisualCard[];
}

const CATEGORIES_SUBTREE: MenuItemNode[] = [
  {
    id: 'malas',
    title: 'Sacred Malas & Rosaries',
    href: '/products/sandalwood-rosary',
    tagline: 'Spiritual Chanting & Devotional Jewelry',
    visualCards: [
      {
        title: 'Authentic 108 Beads Japa Mala',
        image: '/static/uploads/products/10-mm-indian-sandalwood-mala_0_indian-sandalwood-mala-500x500.jpg',
        link: '/products/sandalwood-rosary'
      },
      {
        title: 'Traditional Islamic Tashbih',
        image: '/static/uploads/products/10-mm-sandalwood-tasbih-supplier-in-uae_0_sandalwood-tasbih-500x500.jpg',
        link: '/products/sandalwood-rosary'
      },
      {
        title: 'Temple Pooja Beads Mala',
        image: '/static/uploads/products/10-mm-sandalwood-beads-unpolished_0_sandalwood-beads-unpolished-500x500.jpg',
        link: '/products/sandalwood-beads'
      },
      {
        title: 'Aromatic Prayer Rosary',
        image: '/static/uploads/products/religious-sandalwood-prayer-beads_0_religious-sandalwood-prayer-beads-500x500.jpg',
        link: '/products/religious-sandalwood-jewellery'
      }
    ],
    children: [
      {
        id: 'mala-108',
        title: '108 Beads Pure Japa Mala',
        href: '/products/sandalwood-rosary',
        tagline: 'Certified 100% Mysuru Chandan'
      },
      {
        id: 'tashbih',
        title: 'Muslim Tashbih & Misbahah',
        href: '/products/sandalwood-rosary',
        tagline: '33 & 99 Beads Islamic Prayer Beads'
      },
      {
        id: 'mala-garlands',
        title: 'Sandalwood Beads Mala & Garlands',
        href: '/products/sandalwood-rosary',
        tagline: 'Temple Pooja & Silk Tassel Malas'
      },
      {
        id: 'wrist-malas',
        title: 'Compact Meditation Wristlets',
        href: '/products/sandalwood-bracelet',
        tagline: '27 Beads Meditation Counters'
      },
      {
        id: 'all-malas',
        title: 'Explore All Sacred Malas',
        href: '/products/sandalwood-rosary',
        tagline: 'View Complete Mala Collection'
      }
    ]
  },
  {
    id: 'sculptures',
    title: 'Royal Handcarved Sculptures',
    href: '/products/sandalwood-religious-god-statues',
    tagline: 'Jaipur Master Artisan Heritage',
    visualCards: [
      {
        title: 'Temple Deity God Statues',
        image: '/static/uploads/products/hindu-god-idol-sandalwood-ganesha_0_hindu-god-idol-sandalwood-ganesha-500x500.jpg',
        link: '/products/sandalwood-religious-god-statues'
      },
      {
        title: 'Undercut Net Jaali Elephant',
        image: '/static/uploads/products/elephant-carving-statue_0_elephant-carving-statue-500x500.jpg',
        link: '/products/whitewood-handicrafts'
      },
      {
        title: 'Royal Heritage Gift Items',
        image: '/static/uploads/products/mysore-sandal-beads-souvenirs-craft-japa-mala_0_mysore-sandal-beads-souvenirs-craft-japa-mala-500x500.jpg',
        link: '/products/sandalwood-gift-items'
      },
      {
        title: 'Religious Handicrafts',
        image: '/static/uploads/products/aromatic-muslim-bead_Aromatic-Muslim-Bead.jpg',
        link: '/products/religious-handicraft-sandalwood'
      }
    ],
    children: [
      {
        id: 'net-elephants',
        title: 'Undercut Net Jaali Elephants',
        href: '/products/whitewood-handicrafts',
        tagline: 'Single Piece Baby-Inside Masterpiece'
      },
      {
        id: 'solid-elephants',
        title: 'Solid Carved Royal Elephants',
        href: '/products/whitewood-handicrafts',
        tagline: 'Trunk-Up Royal Figurines'
      },
      {
        id: 'temple-idols',
        title: 'Temple Deities & Sacred Idols',
        href: '/products/sandalwood-religious-god-statues',
        tagline: 'Ganesha & Divine Altar Statues'
      },
      {
        id: 'wooden-artifacts',
        title: 'Heritage Boxes & Incense Stands',
        href: '/products/sandalwood-gift-items',
        tagline: 'Bespoke Royal Wooden Art'
      },
      {
        id: 'all-sculptures',
        title: 'Explore All Sculptures & Artifacts',
        href: '/products/sandalwood-religious-god-statues',
        tagline: 'View Complete Sculpture Collection'
      }
    ]
  },
  {
    id: 'beads',
    title: 'Loose Sandalwood Beads',
    href: '/products/sandalwood-beads-semi-finished',
    tagline: 'Calibrated Jewelry Component Supply',
    visualCards: [
      {
        title: 'Semi Finished Beads',
        image: '/static/uploads/products/12-mm-sandalwood-semi-finished-beads_0_sandalwood-semi-finished-500x500.jpg',
        link: '/products/sandalwood-beads-semi-finished'
      },
      {
        title: 'Unpolished Sandalwood Beads',
        image: '/static/uploads/products/10-mm-sandalwood-beads-unpolished_0_sandalwood-beads-unpolished-500x500.jpg',
        link: '/products/wooden-beads'
      },
      {
        title: 'Natural Brown Beads',
        image: '/static/uploads/products/brown-beads_Brown-Beads.jpg',
        link: '/products/natural-brown-wooden-beads'
      },
      {
        title: 'Pure Sandalwood Billets & Craft',
        image: '/static/uploads/products/pure-sandalwood-prayer-beads_Pure-Sandalwood-Prayer-Beads.jpg',
        link: '/products/sandalwood-product'
      }
    ],
    children: [
      {
        id: 'calibrated-beads',
        title: 'Calibrated Round Beads (6mm–20mm)',
        href: '/products/sandalwood-beads-semi-finished',
        tagline: 'High Essential Oil Spherical Beads'
      },
      {
        id: 'raw-beads',
        title: 'Semi-Finished Raw Beads',
        href: '/products/sandalwood-beads-semi-finished',
        tagline: 'Natural Unpolished Wood Texture'
      },
      {
        id: 'cylindrical-spacers',
        title: 'Cylindrical & Barrel Spacers',
        href: '/products/sandalwood-beads',
        tagline: 'Center-Drilled Guru Bead Sets'
      },
      {
        id: 'sandalwood-billets',
        title: 'Natural Brown Wooden Beads',
        href: '/products/natural-brown-wooden-beads',
        tagline: '100% Genuine Certified Hardwood'
      },
      {
        id: 'all-beads',
        title: 'Explore All Loose Beads Wholesale',
        href: '/products/sandalwood-beads-semi-finished',
        tagline: 'View Complete Beads Collection'
      }
    ]
  },
  {
    id: 'bracelets',
    title: 'Designer Bracelets & Jewelry',
    href: '/products/sandalwood-bracelet',
    tagline: 'Contemporary Spiritual Luxury',
    visualCards: [
      {
        title: 'Sandalwood Hand Chain',
        image: '/static/uploads/products/10-mm-sandalwood-hand-chain-in-china_0_sandalwood-hand-chain-in-china-500x500.png',
        link: '/products/sandalwood-hand-chain'
      },
      {
        title: 'Tiger Beads Bracelet',
        image: '/static/uploads/products/15-mm-sandalwood-tiger-beads-bracelet-supplier-in-hong-kong_0_20-mm-sandalwood-semi-finished-beads-500x500.png',
        link: '/products/sandalwood-bracelet'
      },
      {
        title: 'Buddhist Bead Bracelet',
        image: '/static/uploads/products/buddhist-bead-bracelet_Buddhist-Bead-Bracelet.jpg',
        link: '/products/sandalwood-beads-bracelet'
      },
      {
        title: 'Crafted Sandalwood Jewelry',
        image: '/static/uploads/products/108-mala-bead-sandalwood-mala-beads-mala-necklace_108-mala-bead-sandalwood-mala-beads-mala-necklace.jpg',
        link: '/products/crafted-sandalwood-jewelery'
      }
    ],
    children: [
      {
        id: 'elastic-bracelets',
        title: 'Stretchable Wrist Malas (8mm & 10mm)',
        href: '/products/sandalwood-bracelet',
        tagline: 'Durable Elastic Fit Daily Wear'
      },
      {
        id: 'silver-bracelets',
        title: 'Hand Chain & Designer Wristlets',
        href: '/products/sandalwood-hand-chain',
        tagline: 'Traditional Smooth Finish'
      },
      {
        id: 'pendants',
        title: 'Sacred Wooden Pendants & Amulets',
        href: '/products/crafted-sandalwood-jewelery',
        tagline: 'Om, Gayatri & Protective Charms'
      },
      {
        id: 'cord-bracelets',
        title: 'Carved Religious Jewelry',
        href: '/products/religious-sandalwood-jewellery',
        tagline: 'Unisex Spiritual Luxury'
      },
      {
        id: 'all-bracelets',
        title: 'Explore All Designer Jewelry',
        href: '/products/crafted-sandalwood-jewelery',
        tagline: 'View Complete Jewelry Collection'
      }
    ]
  }
];

const MEGA_MENU_ITEMS: MenuItemNode[] = [
  {
    id: 'home',
    title: 'Home',
    href: '/'
  },
  {
    id: 'about',
    title: 'About Us',
    href: '/about'
  },
  {
    id: 'categories',
    title: 'Categories',
    tagline: 'Explore All Atelier Collections',
    visualCards: [
      {
        title: 'Sacred 108 Japa Malas',
        image: '/static/uploads/products/10-mm-indian-sandalwood-mala_0_indian-sandalwood-mala-500x500.jpg',
        link: '/products/sandalwood-rosary',
        tagline: 'Certified Mysore Chandan'
      },
      {
        title: 'Royal Undercut Elephants',
        image: '/static/uploads/products/elephant-carving-statue_0_elephant-carving-statue-500x500.jpg',
        link: '/products/whitewood-handicrafts',
        tagline: 'Single Piece Carvings'
      },
      {
        title: 'Calibrated Loose Beads',
        image: '/static/uploads/products/12-mm-sandalwood-semi-finished-beads_0_sandalwood-semi-finished-500x500.jpg',
        link: '/products/sandalwood-beads-semi-finished',
        tagline: '4mm to 22mm Beads'
      },
      {
        title: 'Designer Wrist Malas',
        image: '/static/uploads/products/10-mm-sandalwood-hand-chain-in-china_0_sandalwood-hand-chain-in-china-500x500.png',
        link: '/products/sandalwood-hand-chain',
        tagline: 'Aromatic Spiritual Wear'
      }
    ],
    children: CATEGORIES_SUBTREE
  },
  {
    id: 'authenticity',
    title: 'Authenticity Test',
    href: '/about#how-to-test'
  },
  {
    id: 'contact',
    title: 'Contact Us',
    href: '/contact'
  }
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuStack, setMenuStack] = useState<MenuItemNode[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchModalRef = useRef<HTMLDivElement>(null);
  const [hasInteractedMenu, setHasInteractedMenu] = useState(false);

  const openMenu = () => {
    setHasInteractedMenu(true);
    setMenuStack([]);
    setMenuOpen(true);
  };

  const closeMenu = () => {
    setHasInteractedMenu(true);
    setMenuOpen(false);
    setTimeout(() => {
      setMenuStack([]);
    }, 600);
  };

  const pushMenu = (item: MenuItemNode) => {
    setMenuStack((prev) => [...prev, item]);
  };

  const popMenu = () => {
    setMenuStack((prev) => prev.slice(0, -1));
  };

  const currentItem = menuStack.length > 0 ? menuStack[menuStack.length - 1] : null;
  const currentList = currentItem ? currentItem.children || [] : MEGA_MENU_ITEMS;
  const currentVisuals = currentItem ? currentItem.visualCards || [] : null;

  const isAdminRoute = pathname?.startsWith('/admin') ?? false;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen || searchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen, searchOpen]);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMenu();
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    closeMenu();
    setSearchOpen(false);
  }, [pathname]);

  if (isAdminRoute) {
    return null;
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      closeMenu();
      setSearchOpen(false);
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const NAV_LINKS = [
    { name: 'Home', href: '/' },
    { name: 'Sacred Malas', href: '/collections/malas' },
    { name: 'Royal Sculptures', href: '/collections/sculptures' },
    { name: 'Loose Beads', href: '/collections/loose-beads' },
    { name: 'Bracelets', href: '/collections/bracelets' },
    { name: 'Our Catalog', href: '/products' },
    { name: 'About Heritage', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
  ];

  return (
    <>
      <header
        className="w-full z-40 fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-xs border-b border-neutral-200/80 transition-all duration-300 ease-in-out"
      >
        {/* Main Navbar: Brand Left, Desktop Nav Links Center, Actions Right */}
        <div className={`transition-all duration-300 ease-in-out ${scrolled ? 'py-2 sm:py-2.5' : 'py-2.5 sm:py-3.5'}`}>
          <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between gap-4">
            
            {/* Left: Mobile Menu Toggle + Brand Logo */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Mobile Hamburger Toggle (Visible on Mobile/Tablet only) */}
              <button
                type="button"
                onClick={openMenu}
                className="lg:hidden flex items-center gap-1.5 p-1.5 text-[#0B3C84] hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                aria-label="Open Navigation Menu"
                aria-expanded={menuOpen}
              >
                <Menu className="w-5 h-5 text-[#B3873E]" />
                <span className="text-[11px] font-cinzel font-bold uppercase text-[#0B3C84]">Menu</span>
              </button>

              {/* Brand Logo & Name */}
              <Link href="/" className="flex items-center gap-2.5 md:gap-3 group">
                <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl p-1 bg-white border border-brand-gold-200/80 shadow-xs flex items-center justify-center overflow-hidden shrink-0">
                  <Image
                    src="/logo-compact.jpeg"
                    alt="Riddhi Siddhi Arts & Crafts Logo"
                    fill
                    sizes="60px"
                    className="object-contain p-0.5"
                    priority
                  />
                </div>
                <div className="text-left">
                  <div className="font-serif font-bold text-base sm:text-lg md:text-xl text-[#0B3C84] tracking-wide leading-tight group-hover:opacity-85 transition-opacity whitespace-nowrap">
                    Riddhi Siddhi
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="h-[1px] w-2 bg-brand-gold-400/70"></span>
                    <span className="font-cinzel text-[8px] sm:text-[9px] uppercase tracking-[0.2em] font-semibold text-[#B3873E] whitespace-nowrap">
                      Arts & Crafts
                    </span>
                    <span className="h-[1px] w-2 bg-brand-gold-400/70"></span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Center: Full Desktop Navbar Links (Visible on Desktop) */}
            <nav className="hidden lg:flex items-center gap-3.5 xl:gap-6 text-[12px] xl:text-[13.5px] font-sans">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`group relative py-1.5 px-1 tracking-wide transition-colors whitespace-nowrap font-medium ${
                      isActive
                        ? 'text-[#0B3C84] font-bold'
                        : 'text-neutral-800 hover:text-[#0B3C84]'
                    }`}
                  >
                    <span>{link.name}</span>
                    {isActive ? (
                      <span className="absolute -bottom-1 left-1 right-1 h-[2.5px] bg-[#0B3C84] rounded-full" />
                    ) : (
                      <span className="absolute -bottom-1 left-1 right-1 h-[2px] bg-[#B3873E] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Quick Search, Call Us & Admin Portal */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Search Button */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-1.5 p-1.5 text-neutral-700 hover:text-[#0B3C84] hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                aria-label="Search Products"
                aria-expanded={searchOpen}
              >
                <Search className="w-4 h-4 md:w-4.5 md:h-4.5 text-[#B3873E]" />
                <span className="text-[11px] font-cinzel font-bold uppercase text-[#0B3C84] hidden sm:inline">Search</span>
              </button>

              {/* Call Us Button */}
              <a
                href="tel:+917942625339"
                className="hidden sm:inline-flex items-center gap-1.5 bg-[#0B3C84] hover:bg-[#082C62] text-white font-cinzel font-bold text-[11px] uppercase tracking-wider py-2 px-3.5 rounded-full shadow-xs transition-all select-none"
                title="Call Us Directly"
              >
                <Phone className="w-3.5 h-3.5 text-[#E5C278]" />
                <span>Call Us</span>
              </a>

              {/* Wishlist Icon */}
              <Link
                href="/products"
                className="p-1.5 text-neutral-600 hover:text-[#0B3C84] hover:bg-neutral-100 rounded-lg transition-colors"
                title="Browse Catalog"
                aria-label="Browse Catalog"
              >
                <Heart className="w-4 h-4 text-neutral-700 hover:text-[#0B3C84]" />
              </Link>

              {/* Admin Portal */}
              <Link
                href="/admin/login"
                className="p-1.5 text-neutral-600 hover:text-[#0B3C84] hover:bg-neutral-100 rounded-lg transition-colors"
                title="Admin Portal"
                aria-label="Admin Portal Login"
              >
                <User className="w-4 h-4 text-neutral-700 hover:text-[#0B3C84]" />
              </Link>
            </div>

          </div>
        </div>
      </header>

      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            ref={searchModalRef}
            className="w-full max-w-2xl bg-white border border-brand-gold-300 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-brand-sandalwood-200">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-[#B3873E]" />
                <span className="font-cinzel text-xs font-bold text-[#0B3C84] uppercase tracking-widest">
                  Quick Catalog Search
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-black transition-colors cursor-pointer"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search sandalwood malas, elephants, 10mm beads, bracelets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F6F5F2] border border-neutral-300 focus:border-[#0B3C84] rounded-2xl py-4 pl-5 pr-14 text-base text-black placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#0B3C84]/20 transition-all font-sans"
              />
              <button
                type="submit"
                className="absolute right-3 top-3 bg-[#0B3C84] hover:bg-[#082C62] text-white p-2.5 rounded-xl transition-colors cursor-pointer shadow-sm"
                aria-label="Execute search"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Hamburger Drawer with Responsive Louis Vuitton Staggered Cascade Navigation */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-500 ${menuOpen ? 'pointer-events-auto visible' : 'pointer-events-none invisible delay-500'
          }`}
      >
        <div
          className={`fixed inset-0 z-0 bg-black/60 backdrop-blur-sm transition-opacity duration-600 ease-in-out ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          onClick={closeMenu}
        />
        <div
          onClick={(e) => e.stopPropagation()}
          className={`relative z-20 bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${menuOpen
            ? 'animate-drawer-in'
            : hasInteractedMenu
              ? 'animate-drawer-out'
              : '-translate-x-full opacity-0 pointer-events-none'
            } ${menuStack.length > 0
              ? 'w-full max-w-full sm:max-w-lg md:max-w-3xl lg:max-w-[780px]'
              : 'w-full max-w-full sm:max-w-md'
            }`}
        >
          <div className="flex-1 flex flex-col md:flex-row h-full">
            <div className={`p-5 sm:p-8 flex flex-col justify-between h-auto md:h-full border-r-0 md:border-r border-brand-sandalwood-100 ${menuStack.length > 0 ? 'w-full md:w-1/2' : 'w-full'
              }`}>
              <div className="space-y-6">
                <div className="space-y-4 pb-4 border-b border-brand-sandalwood-100">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        closeMenu();
                      }}
                      className="flex items-center gap-2 text-black hover:text-[#0B3C84] transition-colors cursor-pointer group py-1.5 px-1 select-none"
                      aria-label="Close menu"
                    >
                      <X className="w-5 h-5 text-[#B3873E]" />
                      <span className="font-cinzel text-xs font-bold uppercase tracking-widest text-black group-hover:text-[#0B3C84] transition-colors">
                        Close
                      </span>
                    </button>
                  </div>
                  {/* Back Navigation Button: Displays the current menu title (e.g. < Categories, < Sacred Malas & Rosaries) */}
                  {menuStack.length > 0 && (
                    <button
                      type="button"
                      onClick={popMenu}
                      className="flex items-center gap-1.5 text-base md:text-lg font-serif text-[#0B3C84] hover:text-[#082C62] transition-colors cursor-pointer py-1 group select-none"
                    >
                      <ChevronLeft className="w-5 h-5 text-[#B3873E] group-hover:-translate-x-1 transition-transform shrink-0" />
                      <span className="font-medium tracking-wide">
                        {menuStack[menuStack.length - 1]?.title}
                      </span>
                    </button>
                  )}
                </div>
                <nav
                  key={menuStack.length > 0 ? menuStack.map((i) => i.id).join('-') : 'root'}
                  className="space-y-3.5 pt-2 animate-submenu-in"
                >
                  {currentList.map((item, idx) => {
                    const isLastLevel = !item.children || item.children.length === 0;
                    return (
                      <div key={item.id} className={`lv-link-item lv-link-${Math.min(idx + 1, 5)}`}>
                        {isLastLevel ? (
                          <Link
                            href={item.href || '/products'}
                            onClick={closeMenu}
                            className="group block py-1.5 cursor-pointer"
                          >
                            <span className="font-serif text-xl sm:text-2xl text-neutral-900 group-hover:text-[#0B3C84] animated-underline block leading-snug">
                              {item.title}
                            </span>
                            {item.tagline && (
                              <span className="text-xs text-neutral-500 font-sans block mt-0.5">
                                {item.tagline}
                              </span>
                            )}
                          </Link>
                        ) : (
                          <button
                            type="button"
                            onClick={() => pushMenu(item)}
                            className="group w-full text-left flex items-center justify-between py-1.5 cursor-pointer"
                          >
                            <div>
                              <span className="font-serif text-xl sm:text-2xl text-neutral-900 group-hover:text-[#0B3C84] animated-underline block leading-snug">
                                {item.title}
                              </span>
                              {item.tagline && (
                                <span className="text-xs text-neutral-500 font-sans block mt-0.5">
                                  {item.tagline}
                                </span>
                              )}
                            </div>
                            <ChevronRight className="w-4 h-4 text-[#B3873E] group-hover:translate-x-1 transition-transform shrink-0 ml-2" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </nav>
              </div>
              <div className="pt-6 space-y-4 border-t border-brand-sandalwood-100 lv-link-item lv-link-footer mt-6">
                <Link
                  href="/contact"
                  onClick={closeMenu}
                  className="w-full bg-[#0B3C84] hover:bg-[#082C62] text-white font-cinzel font-bold text-xs uppercase tracking-wider py-3 rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-colors text-center cursor-pointer select-none"
                >
                  <Send className="w-4 h-4 text-white" /> Send Wholesale Enquiry
                </Link>
                <div className="text-xs text-black space-y-1.5 pt-1">
                  <a href="tel:+917942625339" className="flex items-center gap-2 text-black hover:text-[#0B3C84] transition-colors font-medium">
                    <Phone className="w-3.5 h-3.5 text-[#B3873E]" /> +91-7942625339
                  </a>
                  <p className="flex items-start gap-2 text-[11px] text-neutral-700">
                    <MapPin className="w-3.5 h-3.5 text-[#B3873E] shrink-0 mt-0.5" />
                    Triveni Nagar, Jaipur - 302018
                  </p>
                </div>
              </div>
            </div>
            {/* Right Column: Studio Editorial Visual Cards (Matching Louis Vuitton Split View) */}
            {menuStack.length > 0 && currentVisuals && currentVisuals.length > 0 && (
              <div
                key={`visuals-${menuStack.map((i) => i.id).join('-')}`}
                className="w-full md:w-6/12 lg:w-6/12 bg-white p-6 sm:p-8 overflow-y-auto flex flex-col space-y-4 animate-submenu-in"
              >
                {/* 2-Column Compact Studio Cards Grid */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4.5">
                  {currentVisuals.map((card, vIdx) => (
                    <Link
                      key={vIdx}
                      href={card.link}
                      onClick={closeMenu}
                      className="group flex flex-col cursor-pointer bg-transparent"
                    >
                      {/* Compact Studio Photo Frame */}
                      <div className="w-full aspect-[4/5] bg-[#F6F5F2] overflow-hidden relative mb-2 rounded-none border-none flex items-center justify-center p-2">
                        <img
                          src={card.image}
                          alt={card.title}
                          className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-700 ease-out select-none"
                        />
                      </div>

                      {/* Minimalist Title Only (Matching Louis Vuitton) */}
                      <span className="text-xs sm:text-[13px] font-sans text-neutral-900 group-hover:text-[#0B3C84] transition-colors leading-snug line-clamp-1">
                        {card.title}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}


