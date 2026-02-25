import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { getCurrentUser } from '../lib/authStore';
import { localStore, BusinessProfile } from '../lib/localStore';
import OwnerLayout from '../components/OwnerLayout';
import { Building2, Phone, MapPin, Mail, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function OwnerProfile() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [profile, setProfile] = useState<BusinessProfile>(localStore.getProfile());
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<BusinessProfile>(profile);

  useEffect(() => {
    if (!user || user.role !== 'owner') navigate({ to: '/login' });
  }, [user, navigate]);

  const saveProfile = () => {
    setProfile(editData);
    localStore.setProfile(editData);
    setEditing(false);
    toast.success('Profile updated!');
  };

  const fields = [
    { icon: Building2, label: 'Business Name', key: 'businessName' as keyof BusinessProfile },
    { icon: Building2, label: 'Owner Name', key: 'ownerName' as keyof BusinessProfile },
    { icon: Phone, label: 'Contact Number', key: 'contact' as keyof BusinessProfile },
    { icon: MapPin, label: 'Address', key: 'address' as keyof BusinessProfile },
    { icon: Mail, label: 'Email', key: 'email' as keyof BusinessProfile },
  ];

  return (
    <OwnerLayout title="Profile">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Profile Header */}
        <div className="luxury-card bg-gradient-to-r from-purple-700 to-purple-900 rounded-3xl p-6 text-white shadow-xl mb-6">
          <div className="flex items-center gap-4">
            <img
              src="/assets/generated/salon-logo.dim_512x512.png"
              alt="Logo"
              className="w-16 h-16 rounded-full object-cover border-3 border-white/30 shadow-lg"
            />
            <div>
              <h2 className="text-xl font-bold font-playfair">{profile.businessName}</h2>
              <p className="text-purple-200 text-sm">Owner: {profile.ownerName}</p>
              <p className="text-purple-300 text-xs mt-1">{profile.email}</p>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="luxury-card bg-white rounded-3xl p-5 shadow-md border border-purple-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-purple-900 font-playfair">Business Information</h3>
            <button
              onClick={() => editing ? saveProfile() : setEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-700 text-white rounded-xl text-sm font-semibold hover:bg-purple-800 transition-colors"
            >
              {editing ? <><Save className="w-4 h-4" /> Save</> : <><Building2 className="w-4 h-4" /> Edit</>}
            </button>
          </div>

          <div className="space-y-4">
            {fields.map(field => (
              <div key={field.key} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <field.icon className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-purple-400 font-medium mb-1">{field.label}</p>
                  {editing ? (
                    <input
                      type="text"
                      value={editData[field.key]}
                      onChange={e => setEditData({ ...editData, [field.key]: e.target.value })}
                      className="w-full border border-purple-200 rounded-xl px-3 py-2 text-sm text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-300 bg-purple-50/50"
                    />
                  ) : (
                    <p className="text-sm text-purple-900 font-medium">{profile[field.key]}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {editing && (
            <button
              onClick={() => setEditing(false)}
              className="mt-4 w-full py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </OwnerLayout>
  );
}
