export interface SiteContent {
  company: {
    name: string;
    tagline: string;
    phone: string;
    rawPhone: string;
    address: string;
    city: string;
    pincode: string;
    operatingHours: string;
  };
  announcement: {
    enabled: boolean;
    text: string;
    badge: string;
  };
  hero: {
    kicker: string;
    headline: string;
    subheadline: string;
    ctaButtonText: string;
    secondaryButtonText: string;
  };
  story: {
    tagline: string;
    heading: string;
    paragraph1: string;
    paragraph2: string;
    pillar1Title: string;
    pillar1Desc: string;
    pillar2Title: string;
    pillar2Desc: string;
    pillar3Title: string;
    pillar3Desc: string;
    pillar4Title: string;
    pillar4Desc: string;
  };
}

export const INITIAL_SITE_CONTENT: SiteContent = {
  company: {
    name: "Cotton Nest",
    tagline: "Pure Cotton Comfort, Everyday Elegance",
    phone: "+91 7838625915",
    rawPhone: "917838625915",
    address: "House Number 2508, Ground Floor, Sector 46, Gurgaon, Haryana",
    city: "Gurgaon, Haryana",
    pincode: "122003",
    operatingHours: "Monday - Sunday · 10:00 AM - 8:30 PM IST",
  },
  announcement: {
    enabled: true,
    text: "Experience 100% Pure Combed Cotton · Direct From Sector 46 Gurgaon Atelier",
    badge: "Gurgaon Atelier Exclusive",
  },
  hero: {
    kicker: "Handcrafted Pure Cotton Bedding · Gurgaon Atelier",
    headline: "The touch of pure cotton, woven for serene mornings.",
    subheadline: "Welcome to Cotton Nest. Discover our curated collection of King size bedsheets — tailored from 100% natural long-staple cotton with breathable comfort, delicate florals, and subtle muted golden accents.",
    ctaButtonText: "View Bedsheets Catalogue",
    secondaryButtonText: "Visit Gurgaon Studio",
  },
  story: {
    tagline: "The Cotton Nest Story",
    heading: "Honest pure cotton, tailored for Indian bedrooms.",
    paragraph1: "At Cotton Nest, based in Sector 46 Gurgaon, we started with a simple belief: bedsheets should never be made with sweaty synthetic microfiber or shrunk down to stingy sizes that untuck the moment you turn in bed.",
    paragraph2: "Every single bedsheet in our collection is cut to an expansive King size (108×108 / 100×108 inch), guaranteeing a generous tuck-in under even the thickest modern orthopaedic mattresses.",
    pillar1Title: "100% Natural Breathable Cotton",
    pillar1Desc: "Zero polyester blends. Completely breathable and cool against the skin during Indian summers.",
    pillar2Title: "No Untucking Generous Drop",
    pillar2Desc: "Expansive 108×108 inch proportion ensures mattress corners remain neatly tucked all night.",
    pillar3Title: "Color-Fast Reactive Inks",
    pillar3Desc: "Wash after domestic wash, florals and geometric linework retain their rich clarity.",
    pillar4Title: "Gurgaon Local Studio Reassurance",
    pillar4Desc: "Direct support, prompt exchange assistance, and open touch-and-feel visits in Sector 46.",
  },
};
