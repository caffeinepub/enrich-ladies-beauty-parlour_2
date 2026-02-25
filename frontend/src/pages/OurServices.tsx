import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { getCurrentUser } from '../lib/authStore';
import { localStore } from '../lib/localStore';
import CustomerLayout from '../components/CustomerLayout';
import { Scissors, CalendarPlus } from 'lucide-react';

export default function OurServices() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const services = localStore.getServices();

  useEffect(() => {
    if (!user) navigate({ to: '/login' });
  }, [user, navigate]);

  const categories = [...new Set(services.map(s => s.category))];

  return (
    <CustomerLayout title="Our Services" showFloatingButton={true}>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h2 className="text-xl font-bold text-purple-900 font-playfair mb-6">Our Services</h2>

        {categories.map(category => (
          <div key={category} className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Scissors className="w-4 h-4 text-purple-500" />
              <h3 className="font-semibold text-purple-700 text-sm uppercase tracking-wider">{category}</h3>
            </div>
            <div className="space-y-3">
              {services.filter(s => s.category === category).map(service => {
                const discount = service.normalPrice > 0
                  ? Math.round(((service.normalPrice - service.discountedPrice) / service.normalPrice) * 100)
                  : 0;
                return (
                  <div key={service.id} className="luxury-card bg-white rounded-2xl p-4 shadow-sm border border-purple-100 flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-purple-900 text-sm">{service.name}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-purple-700 font-bold">₹{service.discountedPrice}</span>
                        <span className="text-gray-400 text-sm line-through">₹{service.normalPrice}</span>
                        {discount > 0 && (
                          <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                            {discount}% OFF
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => navigate({ to: '/book-appointment' })}
                      className="flex items-center gap-1.5 px-3 py-2 bg-purple-700 text-white rounded-xl text-xs font-semibold hover:bg-purple-800 transition-colors ml-3"
                    >
                      <CalendarPlus className="w-3.5 h-3.5" />
                      Book
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </CustomerLayout>
  );
}
