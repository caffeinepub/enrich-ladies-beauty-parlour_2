import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { getCurrentUser, logout } from '../lib/authStore';
import { localStore } from '../lib/localStore';
import CustomerLayout from '../components/CustomerLayout';
import { User, Mail, Phone, MapPin, LogOut, Calendar } from 'lucide-react';
import { useGetAppointments } from '../hooks/useQueries';
import { AppointmentStatus } from '../backend';
import { toast } from 'sonner';

export default function CustomerProfile() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const profile = localStore.getProfile();
  const { data: appointments = [] } = useGetAppointments();

  useEffect(() => {
    if (!user) navigate({ to: '/login' });
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate({ to: '/login' });
  };

  const myAppointments = appointments.filter(
    apt => apt.customerName.toLowerCase() === (user?.name || '').toLowerCase()
  );

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.confirmed: return 'bg-green-100 text-green-700';
      case AppointmentStatus.pending: return 'bg-yellow-100 text-yellow-700';
      case AppointmentStatus.completed: return 'bg-blue-100 text-blue-700';
      case AppointmentStatus.cancelled: return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <CustomerLayout title="My Profile" showFloatingButton={true}>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-purple-700 to-purple-900 rounded-3xl p-6 text-white shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/30 shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-playfair">{user?.name}</h2>
              <p className="text-purple-200 text-sm">{user?.email}</p>
              <span className="inline-block mt-1 bg-white/20 text-white text-xs px-3 py-0.5 rounded-full font-medium">
                Customer
              </span>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-3xl p-5 shadow-md border border-purple-100">
          <h3 className="font-bold text-purple-900 font-playfair mb-4">Account Information</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 py-2 border-b border-purple-50">
              <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center">
                <User className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-purple-400">Full Name</p>
                <p className="text-sm font-semibold text-purple-900">{user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 py-2">
              <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center">
                <Mail className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-purple-400">Email</p>
                <p className="text-sm font-semibold text-purple-900">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* My Appointments */}
        <div className="bg-white rounded-3xl p-5 shadow-md border border-purple-100">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-purple-900 font-playfair">My Appointments</h3>
            <span className="ml-auto bg-purple-100 text-purple-700 text-xs font-bold px-2.5 py-1 rounded-full">
              {myAppointments.length}
            </span>
          </div>
          {myAppointments.length === 0 ? (
            <div className="text-center py-6">
              <Calendar className="w-10 h-10 text-purple-200 mx-auto mb-2" />
              <p className="text-purple-400 text-sm">No appointments yet</p>
              <button
                onClick={() => navigate({ to: '/book-appointment' })}
                className="mt-3 text-purple-600 text-sm font-semibold hover:text-purple-800 transition-colors"
              >
                Book your first appointment →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {myAppointments.slice(0, 5).map(apt => (
                <div key={String(apt.id)} className="flex items-center justify-between py-2 border-b border-purple-50 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-purple-900">{apt.service}</p>
                    <p className="text-xs text-purple-500">
                      {new Date(Number(apt.date) / 1_000_000).toLocaleDateString()} · {apt.time}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusColor(apt.status)}`}>
                    {apt.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Salon Info */}
        <div className="bg-purple-50 rounded-3xl p-5 border border-purple-100">
          <h3 className="font-bold text-purple-900 font-playfair mb-3">Salon Information</h3>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-purple-700">{profile.address}</p>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-purple-500 flex-shrink-0" />
              <p className="text-sm text-purple-700">{profile.contact}</p>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-purple-500 flex-shrink-0" />
              <p className="text-sm text-purple-700">{profile.email}</p>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full py-4 bg-red-50 text-red-600 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-100 transition-all duration-300 border border-red-100"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </CustomerLayout>
  );
}
