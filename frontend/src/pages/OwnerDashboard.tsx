import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { getCurrentUser } from '../lib/authStore';
import { localStore } from '../lib/localStore';
import { useGetAppointments } from '../hooks/useQueries';
import OwnerLayout from '../components/OwnerLayout';
import { Calendar, Users, MessageSquare, Megaphone, Scissors, Star } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import AppointmentChatBox from '../components/AppointmentChatBox';
import { Appointment, AppointmentStatus } from '../backend';

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const { data: appointments = [] } = useGetAppointments();
  const [announcement, setAnnouncement] = useState(localStore.getAnnouncement());
  const [announcementInput, setAnnouncementInput] = useState(localStore.getAnnouncement());
  const [selectedHolidays, setSelectedHolidays] = useState<string[]>(localStore.getHolidays());
  const [holidayInput, setHolidayInput] = useState('');
  const [chatAppointment, setChatAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'owner') {
      navigate({ to: '/login' });
    }
  }, [user, navigate]);

  const today = new Date().toDateString();
  const todayAppointments = appointments.filter(apt => {
    const aptDate = new Date(Number(apt.date) / 1_000_000).toDateString();
    return aptDate === today;
  });

  const saveAnnouncement = () => {
    localStore.setAnnouncement(announcementInput);
    setAnnouncement(announcementInput);
    toast.success('Announcement posted!');
  };

  const addHoliday = () => {
    if (!holidayInput) return;
    const updated = [...new Set([...selectedHolidays, holidayInput])];
    setSelectedHolidays(updated);
    localStore.setHolidays(updated);
    setHolidayInput('');
    toast.success('Holiday date added!');
  };

  const removeHoliday = (date: string) => {
    const updated = selectedHolidays.filter(d => d !== date);
    setSelectedHolidays(updated);
    localStore.setHolidays(updated);
  };

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
    <OwnerLayout title="Owner Dashboard">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Welcome Banner */}
        <div className="luxury-card bg-gradient-to-r from-purple-700 to-purple-900 rounded-3xl p-6 text-white shadow-xl">
          <h2 className="text-xl font-bold font-playfair mb-1">Welcome, Savita M C 👑</h2>
          <p className="text-purple-200 text-sm">Manage your beauty parlour with ease</p>
          <div className="flex gap-4 mt-4">
            <div className="bg-white/10 rounded-2xl px-4 py-3 flex-1 text-center">
              <p className="text-2xl font-bold">{todayAppointments.length}</p>
              <p className="text-purple-200 text-xs mt-1">Today's Appointments</p>
            </div>
            <div className="bg-white/10 rounded-2xl px-4 py-3 flex-1 text-center">
              <p className="text-2xl font-bold">{appointments.length}</p>
              <p className="text-purple-200 text-xs mt-1">Total Bookings</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Scissors, label: 'Services', path: '/owner/manage-services' },
            { icon: Calendar, label: 'Appointments', path: '/owner/appointments' },
            { icon: Star, label: 'Reviews', path: '/owner/reviews' },
          ].map(item => (
            <button
              key={item.path}
              onClick={() => navigate({ to: item.path })}
              className="luxury-card bg-white rounded-2xl p-4 flex flex-col items-center gap-2 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 border border-purple-100"
            >
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <item.icon className="w-5 h-5 text-purple-700" />
              </div>
              <span className="text-xs font-medium text-purple-900">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Announcement */}
        <div className="luxury-card bg-white rounded-3xl p-5 shadow-md border border-purple-100">
          <div className="flex items-center gap-2 mb-3">
            <Megaphone className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-purple-900 font-playfair">Daily Announcement</h3>
          </div>
          {announcement && (
            <div className="bg-purple-50 rounded-2xl p-3 mb-3 text-sm text-purple-800 border border-purple-100">
              <p className="font-medium text-xs text-purple-500 mb-1">Current Announcement:</p>
              {announcement}
            </div>
          )}
          <textarea
            value={announcementInput}
            onChange={e => setAnnouncementInput(e.target.value)}
            placeholder="Write today's announcement or special offer..."
            className="w-full border border-purple-200 rounded-2xl p-3 text-sm text-purple-900 placeholder:text-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none bg-purple-50/50"
            rows={3}
          />
          <button
            onClick={saveAnnouncement}
            className="mt-2 w-full py-2.5 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl text-sm font-semibold hover:from-purple-700 hover:to-purple-900 transition-all duration-300"
          >
            Post Announcement
          </button>
        </div>

        {/* Holiday Management */}
        <div className="luxury-card bg-white rounded-3xl p-5 shadow-md border border-purple-100">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-purple-900 font-playfair">Holiday Management</h3>
          </div>
          <div className="flex gap-2 mb-3">
            <input
              type="date"
              value={holidayInput}
              onChange={e => setHolidayInput(e.target.value)}
              className="flex-1 border border-purple-200 rounded-xl px-3 py-2 text-sm text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-300 bg-purple-50/50"
            />
            <button
              onClick={addHoliday}
              className="px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 transition-colors"
            >
              Add
            </button>
          </div>
          {selectedHolidays.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedHolidays.map(date => (
                <div key={date} className="flex items-center gap-1 bg-purple-100 text-purple-800 rounded-full px-3 py-1 text-xs font-medium">
                  {date}
                  <button onClick={() => removeHoliday(date)} className="ml-1 text-purple-500 hover:text-red-500 transition-colors">×</button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-purple-400 text-sm text-center py-2">No holidays marked</p>
          )}
        </div>

        {/* Today's Appointments */}
        <div className="luxury-card bg-white rounded-3xl p-5 shadow-md border border-purple-100">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-purple-900 font-playfair">Today's Appointments</h3>
            <span className="ml-auto bg-purple-100 text-purple-700 text-xs font-bold px-2.5 py-1 rounded-full">
              {todayAppointments.length}
            </span>
          </div>
          {todayAppointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-purple-200 mx-auto mb-3" />
              <p className="text-purple-400 text-sm">No appointments today</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayAppointments.map(apt => (
                <div key={String(apt.id)} className="border border-purple-100 rounded-2xl p-4 bg-purple-50/50">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-purple-900 text-sm">{apt.customerName}</p>
                      <p className="text-purple-600 text-xs">{apt.service}</p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(apt.status)}`}>
                      {apt.status}
                    </span>
                  </div>
                  <p className="text-purple-500 text-xs mb-3">⏰ {apt.time}</p>
                  <button
                    onClick={() => setChatAppointment(apt)}
                    className="flex items-center gap-1.5 text-xs text-purple-600 hover:text-purple-800 font-medium transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Open Chat
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Modal */}
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
