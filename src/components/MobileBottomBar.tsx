import React from 'react';
import { ShoppingBag, Grid, Phone, MessageCircle, MapPin } from 'lucide-react';
import { COMPANY_DETAILS } from '../data/products';

interface MobileBottomBarProps {
  activeTab: 'home' | 'catalogue' | 'story' | 'store';
  setActiveTab: (tab: 'home' | 'catalogue' | 'story' | 'store') => void;
  cartCount: number;
  openCart: () => void;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  openCart,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#EAE2D5] px-3 py-2 flex items-center justify-around text-xs shadow-lg">
      
      {/* Catalogue Tab Button */}
      <button
        onClick={() => {
          setActiveTab('catalogue');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`flex flex-col items-center gap-0.5 cursor-pointer ${
          activeTab === 'catalogue' ? 'text-[#B83F60] font-semibold' : 'text-[#6B5D55]'
        }`}
      >
        <Grid className="w-5 h-5" />
        <span className="text-[10px]">Catalogue</span>
      </button>

      {/* Store Location */}
      <button
        onClick={() => {
          setActiveTab('store');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`flex flex-col items-center gap-0.5 cursor-pointer ${
          activeTab === 'store' ? 'text-[#B83F60] font-semibold' : 'text-[#6B5D55]'
        }`}
      >
        <MapPin className="w-5 h-5" />
        <span className="text-[10px]">Studio</span>
      </button>

      {/* WhatsApp Quick Message */}
      <a
        href={COMPANY_DETAILS.whatsappUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Direct WhatsApp Message"
        className="flex flex-col items-center gap-0.5 text-emerald-700"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="text-[10px]">WhatsApp</span>
      </a>

      {/* Direct Call Button */}
      <a
        href={COMPANY_DETAILS.callUrl}
        aria-label="Direct Call"
        className="flex flex-col items-center gap-0.5 text-[#C29E57]"
      >
        <Phone className="w-5 h-5" />
        <span className="text-[10px]">Call</span>
      </a>

      {/* Shopping Bag Button with Badge */}
      <button
        onClick={openCart}
        className="flex flex-col items-center gap-0.5 text-[#2C2420] relative cursor-pointer"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#B83F60] text-white text-[9px] font-bold rounded-full flex items-center justify-center tabular-nums">
              {cartCount}
            </span>
          )}
        </div>
        <span className="text-[10px]">Bag</span>
      </button>

    </div>
  );
};
