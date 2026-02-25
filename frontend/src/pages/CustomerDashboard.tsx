import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { getCurrentUser } from '../lib/authStore';
import { localStore } from '../lib/localStore';
import CustomerLayout from '../components/CustomerLayout';
import { Scissors, Star, CalendarPlus, Sparkles } from 'lucide-react';

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const announcement = localStore.getAnnouncement();
  const services = localStore.getServices();
  const profile = localStore.getProfile();

  useEffect(() => {
    if (!user) navigate({ to: '/login' });
  }, [user, navigate]);

  const featuredServices = services.slice(0, 4);

  return (
    <CustomerLayout title="Home" showFloatingButton={true}>
      <div className="max-w-2xl mx-auto">
        {/* Hero Banner */}
        <div className="relative overflow-hidden">
          <img
            src="/assets/generated/homepage-banner.dim_1200x400.png"
            alt="Enrich Beauty Parlour"
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-purple-700/60 flex items-center px-6">
            <div>
              <h2 className="text-white text-2xl font-bold font-playfair leading-tight">
                Welcome to<br />Enrich Beauty
              </h2>
              <p className="text-purple-200 text-sm mt-1">Luxury • Elegance • Beauty</p>
              <button
                onClick={() => navigate({ to: '/book-appointment' })}
                className="mt-3 flex items-center gap-2 px-5 py-2.5 bg-white text-purple-900 rounded-full text-sm font-bold shadow-lg hover:bg-purple-50 transition-all duration-300 hover:scale-105"
              >
                <CalendarPlus className="w-4 h-4" />
                Book Now
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Announcement */}
          {announcement && (
            <div className="bg-gradient-to-r from-purple-100 to-purple-50 rounded-2xl p-4 border border-purple-200">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <p className="text-xs font-bold text-purple-600 uppercase tracking-wider">Today's Announcement</p>
              </div>
              <p className="text-purple-800 text-sm">{announcement}</p>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Scissors, label: 'Our Services', path: '/customer/services', color: 'bg-purple-100 text-purple-700' },
              { icon: CalendarPlus, label: 'Book Now', path: '/book-appointment', color: 'bg-pink-100 text-pink-700' },
              { icon: Star, label: 'Reviews', path: '/customer/reviews', color: 'bg-amber-100 text-amber-700' },
            ].map(item => (
              <button
                key={item.path}
                onClick={() => navigate({ to: item.path })}
                className="luxury-card bg-white rounded-2xl p-4 flex flex-col items-center gap-2 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 border border-purple-100"
              >
                <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-purple-900 text-center">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Featured Services */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-purple-900 font-playfair">Featured Services</h3>
              <button
                onClick={() => navigate({ to: '/customer/services' })}
                className="text-purple-600 text-xs font-semibold hover:text-purple-800 transition-colors"
              >
                View All →
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {featuredServices.map(service => {
                const discount = service.normalPrice > 0
                  ? Math.round(((service.normalPrice - service.discountedPrice) / service.normalPrice) * 100)
                  : 0;
                return (
                  <div
                    key={service.id}
                    onClick={() => navigate({ to: '/book-appointment' })}
                    className="luxury-card bg-white rounded-2xl p-4 shadow-sm border border-purple-100 cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all duration-300"
                  >
                    <p className="font-semibold text-purple-900 text-sm mb-2 leading-tight">{service.name}</p>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-purple-700 font-bold text-sm">₹{service.discountedPrice}</span>
                      <span className="text-gray-400 text-xs line-through">₹{service.normalPrice}</span>
                    </div>
                    {discount > 0 && (
                      <span className="inline-block mt-1 bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                        {discount}% OFF
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* About */}
          <div className="luxury-card bg-gradient-to-br from-purple-700 to-purple-900 rounded-3xl p-5 text-white shadow-xl">
            <h3 className="font-bold font-playfair text-lg mb-2">About Us</h3>
            <p className="text-purple-200 text-sm leading-relaxed">
              {profile.businessName} is your premium beauty destination in Hubli. 
              Expert care, luxury treatments, and a warm welcoming atmosphere await you.
            </p>
            <div className="mt-3 pt-3 border-t border-white/20">
              <p className="text-purple-300 text-xs">📍 {profile.address}</p>
              <p className="text-purple-300 text-xs mt-1">📞 {profile.contact}</p>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
