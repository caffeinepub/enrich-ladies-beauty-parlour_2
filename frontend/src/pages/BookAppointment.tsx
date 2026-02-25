import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { getCurrentUser } from '../lib/authStore';
import { localStore } from '../lib/localStore';
import { useCreateAppointment } from '../hooks/useQueries';
import { AppointmentStatus } from '../backend';
import CustomerLayout from '../components/CustomerLayout';
import { ChevronRight, ChevronLeft, Check, Calendar, Clock, Phone, FileText } from 'lucide-react';
import { toast } from 'sonner';

const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
  '06:00 PM', '06:30 PM', '07:00 PM',
];

export default function BookAppointment() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const createAppointment = useCreateAppointment();
  const services = localStore.getServices();
  const holidays = localStore.getHolidays();

  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: '',
    email: user?.email || '',
    description: '',
  });

  useEffect(() => {
    if (!user) navigate({ to: '/login' });
  }, [user, navigate]);

  const isHoliday = (dateStr: string) => holidays.includes(dateStr);

  const getTodayStr = () => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }
    try {
      const dateMs = new Date(selectedDate).getTime();
      const dateNs = BigInt(dateMs) * BigInt(1_000_000);
      const appointment = {
        id: BigInt(Date.now()),
        customerName: formData.name,
        service: selectedService,
        date: dateNs,
        time: selectedTime,
        phoneNumber: formData.phone,
        description: formData.description,
        status: AppointmentStatus.pending,
        chatHistory: [],
      };
      await createAppointment.mutateAsync(appointment);
      localStore.setBookingDetails({
        customerName: formData.name,
        service: selectedService,
        date: selectedDate,
        time: selectedTime,
        phone: formData.phone,
        email: formData.email,
        description: formData.description,
      });
      navigate({ to: '/booking-confirmation' });
    } catch {
      toast.error('Failed to book appointment. Please try again.');
    }
  };

  const calcDiscount = (normal: number, discounted: number) =>
    normal > 0 ? Math.round(((normal - discounted) / normal) * 100) : 0;

  const stepTitles = ['Select Service', 'Date & Time', 'Your Details'];

  return (
    <CustomerLayout title="Book Appointment">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                s < step ? 'bg-green-500 text-white' :
                s === step ? 'bg-purple-700 text-white shadow-lg shadow-purple-300' :
                'bg-purple-100 text-purple-400'
              }`}>
                {s < step ? <Check className="w-4 h-4" /> : s}
              </div>
              {s < 3 && (
                <div className={`w-12 h-0.5 transition-all duration-300 ${s < step ? 'bg-green-500' : 'bg-purple-100'}`} />
              )}
            </div>
          ))}
        </div>
        <h2 className="text-center text-lg font-bold text-purple-900 font-playfair mb-6">{stepTitles[step - 1]}</h2>

        {/* Step 1: Service Selection */}
        {step === 1 && (
          <div className="space-y-3">
            {services.map(service => {
              const discount = calcDiscount(service.normalPrice, service.discountedPrice);
              return (
                <button
                  key={service.id}
                  onClick={() => setSelectedService(service.name)}
                  className={`w-full text-left rounded-2xl p-4 border-2 transition-all duration-200 hover:scale-[1.01] ${
                    selectedService === service.name
                      ? 'border-purple-600 bg-purple-50 shadow-md'
                      : 'border-purple-100 bg-white hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-purple-900 text-sm">{service.name}</p>
                      <p className="text-purple-500 text-xs">{service.category}</p>
                    </div>
                    <div className="text-right mr-3">
                      <p className="text-purple-700 font-bold">₹{service.discountedPrice}</p>
                      <p className="text-gray-400 text-xs line-through">₹{service.normalPrice}</p>
                      {discount > 0 && (
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                          {discount}% OFF
                        </span>
                      )}
                    </div>
                    {selectedService === service.name && (
                      <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
            <button
              onClick={() => selectedService ? setStep(2) : toast.error('Please select a service')}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:from-purple-700 hover:to-purple-900 transition-all duration-300 shadow-lg shadow-purple-300/50 mt-4"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Date & Time */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="bg-white rounded-3xl p-5 shadow-md border border-purple-100">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-purple-900">Select Date</h3>
              </div>
              <input
                type="date"
                min={getTodayStr()}
                value={selectedDate}
                onChange={e => {
                  if (isHoliday(e.target.value)) {
                    toast.error('This date is marked as a holiday. Please select another date.');
                    return;
                  }
                  setSelectedDate(e.target.value);
                }}
                className="w-full border border-purple-200 rounded-xl px-4 py-3 text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-300 bg-purple-50/50"
              />
              {selectedDate && isHoliday(selectedDate) && (
                <p className="text-red-500 text-xs mt-2">⚠️ This date is a holiday. Please choose another date.</p>
              )}
              {holidays.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-purple-400 font-medium mb-1">Unavailable dates (holidays):</p>
                  <div className="flex flex-wrap gap-1">
                    {holidays.map(h => (
                      <span key={h} className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{h}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-3xl p-5 shadow-md border border-purple-100">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-purple-900">Select Time</h3>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {TIME_SLOTS.map(slot => (
                  <button
                    key={slot}
                    onClick={() => setSelectedTime(slot)}
                    className={`py-2 px-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                      selectedTime === slot
                        ? 'bg-purple-700 text-white shadow-md'
                        : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-100'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-4 bg-purple-100 text-purple-700 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-purple-200 transition-all duration-300"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => {
                  if (!selectedDate) { toast.error('Please select a date'); return; }
                  if (!selectedTime) { toast.error('Please select a time slot'); return; }
                  if (isHoliday(selectedDate)) { toast.error('Selected date is a holiday'); return; }
                  setStep(3);
                }}
                className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:from-purple-700 hover:to-purple-900 transition-all duration-300 shadow-lg shadow-purple-300/50"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Customer Details */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-5 shadow-md border border-purple-100">
              {/* Summary */}
              <div className="bg-purple-50 rounded-2xl p-4 mb-5 border border-purple-100">
                <p className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-2">Booking Summary</p>
                <p className="text-sm text-purple-900 font-semibold">{selectedService}</p>
                <p className="text-xs text-purple-600 mt-1">📅 {selectedDate} &nbsp; ⏰ {selectedTime}</p>
              </div>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="text-xs font-semibold text-purple-700 uppercase tracking-wider mb-1.5 block">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your full name"
                    className="w-full border border-purple-200 rounded-xl px-4 py-3 text-sm text-purple-900 placeholder:text-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-300 bg-purple-50/50"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="text-xs font-semibold text-purple-700 uppercase tracking-wider mb-1.5 block">
                    <Phone className="w-3.5 h-3.5 inline mr-1" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Your phone number"
                    className="w-full border border-purple-200 rounded-xl px-4 py-3 text-sm text-purple-900 placeholder:text-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-300 bg-purple-50/50"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="text-xs font-semibold text-purple-700 uppercase tracking-wider mb-1.5 block">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    readOnly
                    className="w-full border border-purple-100 rounded-xl px-4 py-3 text-sm text-purple-500 bg-purple-50 cursor-not-allowed"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-semibold text-purple-700 uppercase tracking-wider mb-1.5 block">
                    <FileText className="w-3.5 h-3.5 inline mr-1" />
                    Request / Notes
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Any special requests or notes..."
                    rows={3}
                    className="w-full border border-purple-200 rounded-xl px-4 py-3 text-sm text-purple-900 placeholder:text-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-300 bg-purple-50/50 resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-4 bg-purple-100 text-purple-700 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-purple-200 transition-all duration-300"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={createAppointment.isPending}
                className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:from-purple-700 hover:to-purple-900 transition-all duration-300 shadow-lg shadow-purple-300/50 disabled:opacity-60"
              >
                {createAppointment.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Booking...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" /> Confirm Booking
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
