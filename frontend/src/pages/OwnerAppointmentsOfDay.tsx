import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { getCurrentUser } from '../lib/authStore';
import { useGetAppointments, useUpdateAppointment } from '../hooks/useQueries';
import OwnerLayout from '../components/OwnerLayout';
import AppointmentChatBox from '../components/AppointmentChatBox';
import { Appointment, AppointmentStatus } from '../backend';
import { Calendar, Phone, MessageSquare, Clock, User } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

export default function OwnerAppointmentsOfDay() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const { data: appointments = [], isLoading } = useGetAppointments();
  const updateAppointment = useUpdateAppointment();
  const [chatAppointment, setChatAppointment] = useState<Appointment | null>(null);
  const [filter, setFilter] = useState<'today' | 'all'>('today');

  useEffect(() => {
    if (!user || user.role !== 'owner') navigate({ to: '/login' });
  }, [user, navigate]);

  const today = new Date().toDateString();
  const displayedAppointments = filter === 'today'
    ? appointments.filter(apt => {
        const aptDate = new Date(Number(apt.date) / 1_000_000).toDateString();
        return aptDate === today;
      })
    : appointments;

  const handleStatusChange = async (apt: Appointment, newStatus: string) => {
    const statusMap: Record<string, AppointmentStatus> = {
      confirmed: AppointmentStatus.confirmed,
      pending: AppointmentStatus.pending,
      completed: AppointmentStatus.completed,
      cancelled: AppointmentStatus.cancelled,
    };
    try {
      await updateAppointment.mutateAsync({ ...apt, status: statusMap[newStatus] });
      toast.success('Status updated!');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.confirmed: return 'text-green-700 bg-green-100';
      case AppointmentStatus.pending: return 'text-yellow-700 bg-yellow-100';
      case AppointmentStatus.completed: return 'text-blue-700 bg-blue-100';
      case AppointmentStatus.cancelled: return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <OwnerLayout title="Appointments of the Day">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-purple-900 font-playfair">Appointments</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('today')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                filter === 'today' ? 'bg-purple-700 text-white' : 'bg-purple-100 text-purple-700'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                filter === 'all' ? 'bg-purple-700 text-white' : 'bg-purple-100 text-purple-700'
              }`}
            >
              All
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          </div>
        ) : displayedAppointments.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-purple-200 mx-auto mb-4" />
            <p className="text-purple-400 font-medium">No appointments found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedAppointments.map(apt => (
              <div key={String(apt.id)} className="luxury-card bg-white rounded-3xl p-5 shadow-md border border-purple-100">
                {/* Customer Info */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <User className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-purple-900">{apt.customerName}</p>
                      <p className="text-purple-500 text-xs">{apt.service}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusColor(apt.status)}`}>
                    {apt.status}
                  </span>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="flex items-center gap-1.5 text-xs text-purple-600">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(Number(apt.date) / 1_000_000).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-purple-600">
                    <Clock className="w-3.5 h-3.5" />
                    {apt.time}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-purple-600">
                    <Phone className="w-3.5 h-3.5" />
                    {apt.phoneNumber}
                  </div>
                </div>

                {apt.description && (
                  <div className="bg-purple-50 rounded-xl p-3 mb-3 text-xs text-purple-700">
                    <span className="font-medium">Note: </span>{apt.description}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Select
                    value={apt.status}
                    onValueChange={val => handleStatusChange(apt, val)}
                  >
                    <SelectTrigger className="flex-1 h-9 text-xs rounded-xl border-purple-200 bg-purple-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <button
                    onClick={() => setChatAppointment(apt)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-purple-100 text-purple-700 rounded-xl text-xs font-semibold hover:bg-purple-200 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Chat
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {chatAppointment && (
        <AppointmentChatBox
          appointment={chatAppointment}
          onClose={() => setChatAppointment(null)}
          isOwner={true}
        />
      )}
    </OwnerLayout>
  );
}
