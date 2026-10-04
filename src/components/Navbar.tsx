import React from 'react';
import { ShoppingBag, Phone, MessageCircle, Menu, X, Sparkles, MapPin, SlidersHorizontal } from 'lucide-react';
import { COMPANY_DETAILS } from '../data/products';
import { SiteContent } from '../data/siteContent';

interface NavbarProps {
  activeTab: 'home' | 'catalogue' | 'story' | 'store';
  setActiveTab: (tab: 'home' | 'catalogue' | 'story' | 'store') => void;
  cartCount: number;
  openCart: () => void;
  onOpenPhotoManager?: () => void;
  onOpenAdmin?: () => void;
  isOwnerMode?: boolean;
  content?: SiteContent;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  openCart,
  onOpenPhotoManager,
  onOpenAdmin,
  isOwnerMode = false,
  content,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const announcementText = content?.announcement.text || "100% Pure Combed Natural Cotton Bedsheets · Sector 46 Gurgaon Atelier";
  const brandName = content?.company.name || "Cotton Nest";
  const contactPhone = content?.company.phone || COMPANY_DETAILS.phone;

  const handleNavClick = (tab: 'home' | 'catalogue' | 'story' | 'store') => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Subtle announcement bar */}
      <aside aria-label="Announcement" className="bg-[#F4EFE6] border-b border-[#EAE2D5] text-[#7A6458] text-xs py-1.5 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
          <span className="flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#C29E57]" />
            {announcementText}
          </span>
          <span className="hidden md:inline text-[#DCD0C0]">|</span>
          <a
            href={`tel:${contactPhone.replace(/\s+/g, '')}`}
            className="hidden md:inline-flex items-center gap-1 text-[#9E7B3B] hover:underline font-semibold"
          >
            <Phone className="w-3 h-3" />
            {contactPhone}
          </a>
        </div>
      </aside>

      {/* Main Header strictly adhering to the 3-zone Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EAE2D5] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Zone 1: Single text element wordmark in display face */}
          <button
            onClick={() => handleNavClick('home')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <span className="font-serif-luxury text-2xl sm:text-3xl font-semibold tracking-tight text-[#2C2420] group-hover:text-[#B83F60] transition-colors">
              {brandName}
            </span>
          </button>

          {/* Zone 2: 4 clean text navigation links with active state indicator */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <button
              onClick={() => handleNavClick('home')}
              className={`transition-colors relative py-1 cursor-pointer ${
                activeTab === 'home'
                  ? 'text-[#2C2420] font-semibold'
                  : 'text-[#6B5D55] hover:text-[#2C2420]'
              }`}
            >
              Home
              {activeTab === 'home' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C29E57] rounded-full" />
              )}
            </button>

            {/* Special Tab: Catalogue as specifically highlighted by user */}
            <button
              onClick={() => handleNavClick('catalogue')}
              className={`relative py-1 cursor-pointer transition-colors flex items-center gap-1.5 ${
                activeTab === 'catalogue'
                  ? 'text-[#B83F60] font-semibold'
                  : 'text-[#6B5D55] hover:text-[#B83F60]'
              }`}
            >
              <span>Catalogue</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#FDEAF0] text-[#B83F60] border border-[#F9D3DE]">
                9 Designs
              </span>
              {activeTab === 'catalogue' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B83F60] rounded-full" />
              )}
            </button>

            <button
              onClick={() => handleNavClick('story')}
              className={`transition-colors relative py-1 cursor-pointer ${
                activeTab === 'story'
                  ? 'text-[#2C2420] font-semibold'
                  : 'text-[#6B5D55] hover:text-[#2C2420]'
              }`}
            >
              Our Story
              {activeTab === 'story' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C29E57] rounded-full" />
              )}
            </button>

            <button
              onClick={() => handleNavClick('store')}
              className={`transition-colors relative py-1 cursor-pointer flex items-center gap-1 ${
                activeTab === 'store'
                  ? 'text-[#2C2420] font-semibold'
                  : 'text-[#6B5D55] hover:text-[#2C2420]'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-[#C29E57]" />
              Sector 46 Gurgaon
              {activeTab === 'store' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C29E57] rounded-full" />
              )}
            </button>
          </nav>

          {/* Zone 3: 1-2 primary functional actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Owner Exclusive Controls: Admin Panel & Photo Studio */}
            {isOwnerMode && (
              <>
                {onOpenAdmin && (
                  <button
                    type="button"
                    onClick={onOpenAdmin}
                    className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-[#8C2E46] bg-[#FDEAF0] hover:bg-[#F9D3DE] border border-[#FAD1DC] rounded-lg transition-colors cursor-pointer shadow-2xs"
                    title="Open Store Admin Panel (Owner Mode)"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-[#8C2E46]" />
                    <span>Admin Panel</span>
                  </button>
                )}

                {onOpenPhotoManager && (
                  <button
                    type="button"
                    onClick={onOpenPhotoManager}
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#2C2420] bg-white border border-[#EAE2D5] rounded-lg hover:bg-[#F4EFE6] transition-colors cursor-pointer"
                    title="Upload or change photos (Owner Mode)"
                  >
                    <span>📷 Upload Photos</span>
                  </button>
                )}
              </>
            )}

            {/* WhatsApp direct assistance */}
            <a
              href={COMPANY_DETAILS.whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#2C2420] bg-[#FAF7F2] border border-[#EAE2D5] rounded-lg hover:border-[#C29E57] hover:bg-[#F4EFE6] transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </a>

            {/* Shopping Bag CTA */}
            <button
              onClick={openCart}
              aria-label="View Shopping Bag"
              className="relative p-2 text-[#2C2420] hover:text-[#B83F60] transition-colors rounded-lg hover:bg-[#F4EFE6] cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#B83F60] text-white text-[10px] font-bold rounded-full flex items-center justify-center tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="md:hidden p-2 text-[#2C2420] hover:bg-[#F4EFE6] rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FAF7F2] border-b border-[#EAE2D5] px-4 pt-2 pb-6 space-y-2 shadow-lg animate-in fade-in duration-150">
            <button
              onClick={() => handleNavClick('home')}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                activeTab === 'home' ? 'bg-[#F4EFE6] text-[#2C2420] font-semibold' : 'text-[#6B5D55]'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('catalogue')}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between ${
                activeTab === 'catalogue' ? 'bg-[#FDEAF0] text-[#B83F60] font-semibold' : 'text-[#6B5D55]'
              }`}
            >
              <span>Product Catalogue</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FAF7F2] text-[#B83F60] border border-[#F9D3DE]">
                9 Bedsheets
              </span>
            </button>
            <button
              onClick={() => handleNavClick('story')}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                activeTab === 'story' ? 'bg-[#F4EFE6] text-[#2C2420] font-semibold' : 'text-[#6B5D55]'
              }`}
            >
              Our Story &amp; Craft
            </button>
            <button
              onClick={() => handleNavClick('store')}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                activeTab === 'store' ? 'bg-[#F4EFE6] text-[#2C2420] font-semibold' : 'text-[#6B5D55]'
              }`}
            >
              Visit Store (Sector 46, Gurgaon)
            </button>

            {isOwnerMode && (
              <>
                {onOpenPhotoManager && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenPhotoManager();
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-[#8C2E46] bg-[#FDEAF0] border border-[#FAD1DC] flex items-center justify-between"
                  >
                    <span>📷 Upload / Change Photos</span>
                    <span className="text-[10px] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#F9D3DE]">Photo Studio</span>
                  </button>
                )}

                {onOpenAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAdmin();
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-[#2C2420] bg-white border border-[#DEC89B] flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4 text-[#A8823B]" />
                      Admin Panel (Prices & Stock)
                    </span>
                    <span className="text-[10px] bg-[#F4EFE6] px-2 py-0.5 rounded font-bold text-[#A8823B]">Store Admin</span>
                  </button>
                )}
              </>
            )}

            <div className="pt-3 border-t border-[#EAE2D5] flex items-center gap-3">
              <a
                href={COMPANY_DETAILS.callUrl}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-[#2C2420] bg-[#F4EFE6] rounded-lg border border-[#EAE2D5]"
              >
                <Phone className="w-3.5 h-3.5 text-[#C29E57]" />
                Call +91 7838625915
              </a>
              <a
                href={COMPANY_DETAILS.whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-white bg-[#B83F60] hover:bg-[#A33452] rounded-lg"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                WhatsApp
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
