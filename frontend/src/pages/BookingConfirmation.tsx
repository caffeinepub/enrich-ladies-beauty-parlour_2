import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { getCurrentUser } from '../lib/authStore';
import { localStore } from '../lib/localStore';
import CustomerLayout from '../components/CustomerLayout';
import { CheckCircle, Calendar, Clock, Phone, Mail, Scissors, Home } from 'lucide-react';

export default function BookingConfirmation() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const rawBooking = localStore.getBookingDetails();

  useEffect(() => {
    if (!user) navigate({ to: '/login' });
    if (!rawBooking) navigate({ to: '/customer-dashboard' });
  }, [user, rawBooking, navigate]);

  if (!rawBooking) return null;

  // Cast all values to strings to avoid 'unknown' type issues in JSX
  const booking = {
    customerName: String(rawBooking.customerName ?? ''),
    service: String(rawBooking.service ?? ''),
    date: String(rawBooking.date ?? ''),
    time: String(rawBooking.time ?? ''),
    phone: String(rawBooking.phone ?? ''),
    email: String(rawBooking.email ?? ''),
    description: String(rawBooking.description ?? ''),
  };

  return (
    <CustomerLayout title="Booking Confirmed">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-4 shadow-lg">
            <CheckCircle className="w-14 h-14 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-purple-900 font-playfair">Booking Confirmed!</h2>
          <p className="text-purple-500 text-sm mt-2">Your appointment has been successfully booked.</p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-purple-100 overflow-hidden mb-6">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-purple-700 to-purple-900 px-6 py-5">
            <p className="text-purple-200 text-xs uppercase tracking-widest font-medium mb-1">Appointment Details</p>
            <h3 className="text-white text-xl font-bold font-playfair">{booking.service}</h3>
          </div>

          {/* Card Body */}
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-4 py-3 border-b border-purple-50">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Scissors className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-purple-400 font-medium">Customer Name</p>
                <p className="text-purple-900 font-semibold">{booking.customerName}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 py-3 border-b border-purple-50">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-purple-400 font-medium">Date</p>
                <p className="text-purple-900 font-semibold">{booking.date}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 py-3 border-b border-purple-50">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-purple-400 font-medium">Time</p>
                <p className="text-purple-900 font-semibold">{booking.time}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 py-3 border-b border-purple-50">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-purple-400 font-medium">Phone</p>
                <p className="text-purple-900 font-semibold">{booking.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 py-3 border-b border-purple-50">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-purple-400 font-medium">Email</p>
                <p className="text-purple-900 font-semibold">{booking.email}</p>
              </div>
            </div>

            {booking.description && (
              <div className="flex items-start gap-4 py-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-purple-600 text-sm font-bold">📝</span>
                </div>
                <div>
                  <p className="text-xs text-purple-400 font-medium">Notes</p>
                  <p className="text-purple-900 font-semibold">{booking.description}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status Badge */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <span className="text-2xl">⏳</span>
          <div>
            <p className="text-yellow-800 font-semibold text-sm">Status: Pending Confirmation</p>
            <p className="text-yellow-600 text-xs mt-0.5">The salon will confirm your appointment shortly.</p>
          </div>
        </div>

        {/* Salon Info */}
        <div className="bg-purple-50 rounded-2xl p-4 mb-6 border border-purple-100">
          <p className="text-purple-700 font-semibold text-sm mb-1">📍 Enrich Ladies Beauty Parlour</p>
          <p className="text-purple-500 text-xs">Opposite R Club Gym, Near Rajeev Nagar Circle, Hubli, Karnataka – 580021</p>
          <p className="text-purple-500 text-xs mt-1">📞 70906 43373</p>
        </div>

        {/* Back to Home */}
        <button
          onClick={() => navigate({ to: '/customer-dashboard' })}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:from-purple-700 hover:to-purple-900 transition-all duration-300 shadow-lg shadow-purple-300/50"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </button>
      </div>
    </CustomerLayout>
  );
}
