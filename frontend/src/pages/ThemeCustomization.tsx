import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { getCurrentUser } from '../lib/authStore';
import { localStore, ThemeSettings } from '../lib/localStore';
import OwnerLayout from '../components/OwnerLayout';
import { Check, Palette } from 'lucide-react';
import { toast } from 'sonner';

const THEMES = [
  { name: 'Royal Purple', primary: '#7c3aed', bg: 'from-purple-900 to-purple-700' },
  { name: 'Rose Gold', primary: '#e11d48', bg: 'from-rose-900 to-rose-600' },
  { name: 'Midnight Blue', primary: '#1e40af', bg: 'from-blue-900 to-blue-700' },
  { name: 'Emerald', primary: '#059669', bg: 'from-emerald-900 to-emerald-700' },
  { name: 'Amber Glow', primary: '#d97706', bg: 'from-amber-900 to-amber-600' },
  { name: 'Crimson', primary: '#dc2626', bg: 'from-red-900 to-red-700' },
  { name: 'Teal Luxe', primary: '#0d9488', bg: 'from-teal-900 to-teal-700' },
  { name: 'Indigo Dream', primary: '#4338ca', bg: 'from-indigo-900 to-indigo-700' },
  { name: 'Pink Bliss', primary: '#db2777', bg: 'from-pink-900 to-pink-700' },
  { name: 'Slate Elegance', primary: '#475569', bg: 'from-slate-900 to-slate-700' },
  { name: 'Violet Mist', primary: '#7c3aed', bg: 'from-violet-900 to-violet-600' },
  { name: 'Coral Sunset', primary: '#ea580c', bg: 'from-orange-900 to-orange-600' },
  { name: 'Forest Green', primary: '#15803d', bg: 'from-green-900 to-green-700' },
  { name: 'Deep Ocean', primary: '#0369a1', bg: 'from-sky-900 to-sky-700' },
  { name: 'Burgundy', primary: '#9f1239', bg: 'from-rose-950 to-rose-800' },
  { name: 'Lavender', primary: '#8b5cf6', bg: 'from-purple-800 to-purple-500' },
  { name: 'Champagne', primary: '#b45309', bg: 'from-yellow-900 to-yellow-700' },
  { name: 'Sapphire', primary: '#1d4ed8', bg: 'from-blue-950 to-blue-800' },
  { name: 'Plum', primary: '#86198f', bg: 'from-fuchsia-900 to-fuchsia-700' },
  { name: 'Copper', primary: '#c2410c', bg: 'from-orange-950 to-orange-800' },
  { name: 'Jade', primary: '#047857', bg: 'from-emerald-950 to-emerald-800' },
  { name: 'Mauve', primary: '#9d174d', bg: 'from-pink-950 to-pink-800' },
  { name: 'Cobalt', primary: '#1e3a8a', bg: 'from-blue-950 to-indigo-800' },
  { name: 'Garnet', primary: '#991b1b', bg: 'from-red-950 to-red-800' },
  { name: 'Turquoise', primary: '#0f766e', bg: 'from-teal-950 to-teal-800' },
  { name: 'Orchid', primary: '#a21caf', bg: 'from-fuchsia-950 to-fuchsia-800' },
  { name: 'Onyx', primary: '#1f2937', bg: 'from-gray-950 to-gray-800' },
  { name: 'Pearl', primary: '#6b7280', bg: 'from-gray-700 to-gray-500' },
  { name: 'Topaz', primary: '#b45309', bg: 'from-amber-950 to-amber-800' },
  { name: 'Aquamarine', primary: '#0891b2', bg: 'from-cyan-900 to-cyan-700' },
  { name: 'Magenta', primary: '#c026d3', bg: 'from-fuchsia-900 to-purple-800' },
  { name: 'Sienna', primary: '#92400e', bg: 'from-amber-900 to-orange-800' },
  { name: 'Cerulean', primary: '#0284c7', bg: 'from-sky-900 to-blue-800' },
  { name: 'Fuchsia', primary: '#d946ef', bg: 'from-fuchsia-800 to-pink-700' },
  { name: 'Charcoal', primary: '#374151', bg: 'from-gray-900 to-gray-700' },
  { name: 'Blush', primary: '#f43f5e', bg: 'from-rose-800 to-pink-600' },
  { name: 'Midnight', primary: '#0f172a', bg: 'from-slate-950 to-slate-800' },
  { name: 'Sage', primary: '#4d7c0f', bg: 'from-lime-900 to-green-800' },
  { name: 'Dusty Rose', primary: '#be185d', bg: 'from-pink-900 to-rose-700' },
  { name: 'Navy', primary: '#1e3a8a', bg: 'from-blue-950 to-blue-900' },
  { name: 'Terracotta', primary: '#c2410c', bg: 'from-orange-900 to-red-800' },
  { name: 'Lilac', primary: '#a78bfa', bg: 'from-violet-800 to-purple-600' },
  { name: 'Mocha', primary: '#78350f', bg: 'from-amber-950 to-yellow-900' },
  { name: 'Seafoam', primary: '#0d9488', bg: 'from-teal-800 to-cyan-700' },
  { name: 'Raspberry', primary: '#be123c', bg: 'from-rose-900 to-red-800' },
  { name: 'Denim', primary: '#1d4ed8', bg: 'from-blue-900 to-indigo-900' },
  { name: 'Olive', primary: '#3f6212', bg: 'from-lime-950 to-green-900' },
  { name: 'Peach', primary: '#ea580c', bg: 'from-orange-800 to-amber-700' },
  { name: 'Slate Blue', primary: '#4f46e5', bg: 'from-indigo-900 to-blue-800' },
  { name: 'Wine', primary: '#881337', bg: 'from-rose-950 to-red-900' },
  { name: 'Mint', primary: '#059669', bg: 'from-emerald-800 to-teal-700' },
];

const FONTS = [
  'Playfair Display', 'Cormorant Garamond', 'Lora', 'Merriweather', 'EB Garamond',
  'Libre Baskerville', 'Crimson Text', 'Spectral', 'Cardo', 'Gentium Book Basic',
  'Josefin Sans', 'Raleway', 'Montserrat', 'Nunito', 'Poppins',
  'Quicksand', 'Comfortaa', 'Varela Round', 'Cabin', 'Karla',
  'Open Sans', 'Lato', 'Source Sans Pro', 'PT Sans', 'Roboto',
  'Noto Sans', 'Ubuntu', 'Muli', 'Hind', 'Fira Sans',
  'Cinzel', 'Italiana', 'Philosopher', 'Tenor Sans', 'Poiret One',
  'Bodoni Moda', 'Didact Gothic', 'Jost', 'Outfit', 'DM Sans',
  'Syne', 'Space Grotesk', 'Plus Jakarta Sans', 'Figtree', 'Manrope',
  'Bitter', 'Arvo', 'Rokkitt', 'Zilla Slab', 'Rubik',
  'Exo 2', 'Titillium Web', 'Barlow', 'Mulish', 'Work Sans',
];

export default function ThemeCustomization() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [settings, setSettings] = useState<ThemeSettings>(localStore.getTheme());

  useEffect(() => {
    if (!user || user.role !== 'owner') navigate({ to: '/login' });
  }, [user, navigate]);

  const applyTheme = (theme: typeof THEMES[0]) => {
    const updated = { ...settings, theme: theme.name, primaryColor: theme.primary };
    setSettings(updated);
    localStore.setTheme(updated);
    toast.success(`Theme "${theme.name}" applied!`);
  };

  const applyFont = (font: string) => {
    const updated = { ...settings, font };
    setSettings(updated);
    localStore.setTheme(updated);
    toast.success(`Font "${font}" applied!`);
  };

  return (
    <OwnerLayout title="Theme & Customization">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <div className="luxury-card bg-white rounded-3xl p-5 shadow-md border border-purple-100">
          <div className="flex items-center gap-2 mb-1">
            <Palette className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-purple-900 font-playfair">Current Settings</h3>
          </div>
          <p className="text-purple-600 text-sm">Theme: <span className="font-semibold">{settings.theme}</span></p>
          <p className="text-purple-600 text-sm">Font: <span className="font-semibold">{settings.font}</span></p>
        </div>

        {/* Themes */}
        <div className="luxury-card bg-white rounded-3xl p-5 shadow-md border border-purple-100">
          <h3 className="font-bold text-purple-900 font-playfair mb-4">50+ Premium Themes</h3>
          <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
            {THEMES.map(theme => (
              <button
                key={theme.name}
                onClick={() => applyTheme(theme)}
                className={`relative flex items-center gap-3 p-3 rounded-2xl border-2 transition-all duration-200 hover:scale-[1.02] ${
                  settings.theme === theme.name
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-purple-100 bg-white hover:border-purple-300'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${theme.bg} flex-shrink-0`}
                />
                <span className="text-xs font-medium text-purple-900 text-left leading-tight">{theme.name}</span>
                {settings.theme === theme.name && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Fonts */}
        <div className="luxury-card bg-white rounded-3xl p-5 shadow-md border border-purple-100">
          <h3 className="font-bold text-purple-900 font-playfair mb-4">50+ Font Styles</h3>
          <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto pr-1">
            {FONTS.map(font => (
              <button
                key={font}
                onClick={() => applyFont(font)}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl border-2 transition-all duration-200 hover:scale-[1.01] ${
                  settings.font === font
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-purple-100 bg-white hover:border-purple-300'
                }`}
              >
                <span className="text-sm text-purple-900">{font}</span>
                {settings.font === font && (
                  <Check className="w-4 h-4 text-purple-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </OwnerLayout>
  );
}
