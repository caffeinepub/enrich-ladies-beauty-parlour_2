// Local storage helpers for features not yet in backend
// (services, holidays, reviews, announcements, profile, theme)

export interface Service {
  id: string;
  name: string;
  category: string;
  normalPrice: number;
  discountedPrice: number;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  text: string;
  date: string;
  ownerReply?: string;
}

export interface BusinessProfile {
  businessName: string;
  ownerName: string;
  contact: string;
  address: string;
  email: string;
}

export interface ThemeSettings {
  theme: string;
  font: string;
  primaryColor: string;
}

const DEFAULT_SERVICES: Service[] = [
  { id: '1', name: 'Threading', category: 'Face Care', normalPrice: 50, discountedPrice: 40 },
  { id: '2', name: 'Waxing', category: 'Body Care', normalPrice: 300, discountedPrice: 250 },
  { id: '3', name: 'D-Tan', category: 'Face Care', normalPrice: 500, discountedPrice: 400 },
  { id: '4', name: 'Facial', category: 'Face Care', normalPrice: 800, discountedPrice: 650 },
  { id: '5', name: 'Body Massage', category: 'Body Care', normalPrice: 1200, discountedPrice: 999 },
  { id: '6', name: 'Haircuts & Styling', category: 'Hair', normalPrice: 400, discountedPrice: 350 },
  { id: '7', name: 'Hair Spa & Treatments', category: 'Hair', normalPrice: 1000, discountedPrice: 800 },
  { id: '8', name: 'Root Touch Up', category: 'Hair', normalPrice: 600, discountedPrice: 500 },
  { id: '9', name: 'Makeup Packages', category: 'Makeup', normalPrice: 2000, discountedPrice: 1699 },
  { id: '10', name: 'Temporary Straight', category: 'Hair', normalPrice: 1500, discountedPrice: 1299 },
  { id: '11', name: 'Global Hair Colour', category: 'Hair', normalPrice: 2500, discountedPrice: 1999 },
];

const DEFAULT_PROFILE: BusinessProfile = {
  businessName: 'Enrich Ladies Beauty Parlour',
  ownerName: 'Savita M C',
  contact: '70906 43373',
  address: 'Opposite R Club Gym, Near Rajeev Nagar Circle, Hubli, Karnataka – 580021',
  email: 'enrichbeautyparlour29@gmail.com',
};

const DEFAULT_THEME: ThemeSettings = {
  theme: 'Royal Purple',
  font: 'Playfair Display',
  primaryColor: '#7c3aed',
};

function getItem<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored) as T;
  } catch {}
  return defaultValue;
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export const localStore = {
  getServices: (): Service[] => getItem('enrich_services', DEFAULT_SERVICES),
  setServices: (services: Service[]) => setItem('enrich_services', services),

  getHolidays: (): string[] => getItem('enrich_holidays', []),
  setHolidays: (dates: string[]) => setItem('enrich_holidays', dates),

  getReviews: (): Review[] => getItem('enrich_reviews', []),
  setReviews: (reviews: Review[]) => setItem('enrich_reviews', reviews),

  getAnnouncement: (): string => getItem('enrich_announcement', ''),
  setAnnouncement: (text: string) => setItem('enrich_announcement', text),

  getProfile: (): BusinessProfile => getItem('enrich_profile', DEFAULT_PROFILE),
  setProfile: (profile: BusinessProfile) => setItem('enrich_profile', profile),

  getTheme: (): ThemeSettings => getItem('enrich_theme', DEFAULT_THEME),
  setTheme: (theme: ThemeSettings) => setItem('enrich_theme', theme),

  getBookingDetails: () => getItem<Record<string, unknown> | null>('enrich_last_booking', null),
  setBookingDetails: (details: Record<string, unknown>) => setItem('enrich_last_booking', details),
};
