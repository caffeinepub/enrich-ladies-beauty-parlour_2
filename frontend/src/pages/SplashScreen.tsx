import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate({ to: '/login' });
    }, 2800);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-screen">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/generated/splash-bg.dim_1080x1920.png')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/80 via-purple-900/70 to-purple-950/90" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8 text-center">
        {/* Logo */}
        <div className="splash-logo-container mb-8">
          <img
            src="/assets/generated/salon-logo.dim_512x512.png"
            alt="Enrich Ladies Beauty Parlour Logo"
            className="w-40 h-40 rounded-full object-cover shadow-2xl border-4 border-purple-300/50"
          />
        </div>

        {/* Salon Name */}
        <div className="splash-text-container">
          <h1 className="text-4xl font-bold text-white mb-2 tracking-wide font-playfair">
            Enrich
          </h1>
          <h2 className="text-xl font-medium text-purple-200 mb-1 tracking-widest uppercase font-cormorant">
            Ladies Beauty Parlour
          </h2>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-purple-300 to-transparent mx-auto mt-4 mb-6" />
          <p className="text-purple-300 text-sm tracking-widest uppercase font-light">
            Luxury • Elegance • Beauty
          </p>
        </div>

        {/* Loading dots */}
        <div className="flex gap-2 mt-16">
          <div className="w-2 h-2 rounded-full bg-purple-300 animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-purple-300 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-purple-300 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
