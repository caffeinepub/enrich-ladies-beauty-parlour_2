import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { getCurrentUser } from '../lib/authStore';
import { localStore, Service } from '../lib/localStore';
import OwnerLayout from '../components/OwnerLayout';
import { Plus, Edit2, Trash2, Check, X, Scissors } from 'lucide-react';
import { toast } from 'sonner';

export default function ManageServices() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [services, setServices] = useState<Service[]>(localStore.getServices());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Service>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newService, setNewService] = useState({ name: '', category: '', normalPrice: '', discountedPrice: '' });

  useEffect(() => {
    if (!user || user.role !== 'owner') navigate({ to: '/login' });
  }, [user, navigate]);

  const saveServices = (updated: Service[]) => {
    setServices(updated);
    localStore.setServices(updated);
  };

  const startEdit = (service: Service) => {
    setEditingId(service.id);
    setEditData({ ...service });
  };

  const saveEdit = () => {
    if (!editingId) return;
    const updated = services.map(s => s.id === editingId ? { ...s, ...editData } as Service : s);
    saveServices(updated);
    setEditingId(null);
    toast.success('Service updated!');
  };

  const deleteService = (id: string) => {
    saveServices(services.filter(s => s.id !== id));
    toast.success('Service deleted!');
  };

  const addService = () => {
    if (!newService.name || !newService.normalPrice || !newService.discountedPrice) {
      toast.error('Please fill in all required fields');
      return;
    }
    const service: Service = {
      id: Date.now().toString(),
      name: newService.name,
      category: newService.category || 'General',
      normalPrice: parseFloat(newService.normalPrice),
      discountedPrice: parseFloat(newService.discountedPrice),
    };
    saveServices([...services, service]);
    setNewService({ name: '', category: '', normalPrice: '', discountedPrice: '' });
    setShowAddForm(false);
    toast.success('Service added!');
  };

  const calcDiscount = (normal: number, discounted: number) => {
    if (!normal || !discounted || normal <= 0) return 0;
    return Math.round(((normal - discounted) / normal) * 100);
  };

  const categories = [...new Set(services.map(s => s.category))];

  return (
    <OwnerLayout title="Manage Services">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-purple-900 font-playfair">Services</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-700 text-white rounded-xl text-sm font-semibold hover:bg-purple-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Service
          </button>
        </div>

        {/* Add Service Form */}
        {showAddForm && (
          <div className="luxury-card bg-white rounded-3xl p-5 shadow-md border border-purple-100 mb-6">
            <h3 className="font-semibold text-purple-900 mb-4 font-playfair">New Service</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Service Name *"
                value={newService.name}
                onChange={e => setNewService({ ...newService, name: e.target.value })}
                className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 bg-purple-50/50"
              />
              <input
                type="text"
                placeholder="Category (e.g., Hair, Face Care)"
                value={newService.category}
                onChange={e => setNewService({ ...newService, category: e.target.value })}
                className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 bg-purple-50/50"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Normal Price (₹) *"
                  value={newService.normalPrice}
                  onChange={e => setNewService({ ...newService, normalPrice: e.target.value })}
                  className="border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 bg-purple-50/50"
                />
                <input
                  type="number"
                  placeholder="Discounted Price (₹) *"
                  value={newService.discountedPrice}
                  onChange={e => setNewService({ ...newService, discountedPrice: e.target.value })}
                  className="border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 bg-purple-50/50"
                />
              </div>
              {newService.normalPrice && newService.discountedPrice && (
                <p className="text-green-600 text-sm font-medium">
                  Discount: {calcDiscount(parseFloat(newService.normalPrice), parseFloat(newService.discountedPrice))}% off
                </p>
              )}
              <div className="flex gap-2">
                <button onClick={addService} className="flex-1 py-2.5 bg-purple-700 text-white rounded-xl text-sm font-semibold hover:bg-purple-800 transition-colors">
                  Add Service
                </button>
                <button onClick={() => setShowAddForm(false)} className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Services by Category */}
        {categories.map(category => (
          <div key={category} className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Scissors className="w-4 h-4 text-purple-500" />
              <h3 className="font-semibold text-purple-700 text-sm uppercase tracking-wider">{category}</h3>
            </div>
            <div className="space-y-3">
              {services.filter(s => s.category === category).map(service => (
                <div key={service.id} className="luxury-card bg-white rounded-2xl p-4 shadow-sm border border-purple-100">
                  {editingId === service.id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editData.name || ''}
                        onChange={e => setEditData({ ...editData, name: e.target.value })}
                        className="w-full border border-purple-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          value={editData.normalPrice || ''}
                          onChange={e => setEditData({ ...editData, normalPrice: parseFloat(e.target.value) })}
                          placeholder="Normal Price"
                          className="border border-purple-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                        />
                        <input
                          type="number"
                          value={editData.discountedPrice || ''}
                          onChange={e => setEditData({ ...editData, discountedPrice: parseFloat(e.target.value) })}
                          placeholder="Discounted Price"
                          className="border border-purple-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={saveEdit} className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-semibold">
                          <Check className="w-3 h-3" /> Save
                        </button>
                        <button onClick={() => setEditingId(null)} className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold">
                          <X className="w-3 h-3" /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-purple-900 text-sm">{service.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-purple-700 font-bold text-base">₹{service.discountedPrice}</span>
                          <span className="text-gray-400 text-xs line-through">₹{service.normalPrice}</span>
                          {calcDiscount(service.normalPrice, service.discountedPrice) > 0 && (
                            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                              {calcDiscount(service.normalPrice, service.discountedPrice)}% OFF
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(service)} className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => deleteService(service.id)} className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </OwnerLayout>
  );
}
