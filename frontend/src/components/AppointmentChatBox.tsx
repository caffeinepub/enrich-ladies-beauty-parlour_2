import { useState } from 'react';
import { X, Send, MessageSquare } from 'lucide-react';
import { Appointment } from '../backend';
import { useUpdateAppointment } from '../hooks/useQueries';
import { getCurrentUser } from '../lib/authStore';
import { toast } from 'sonner';

interface AppointmentChatBoxProps {
  appointment: Appointment;
  onClose: () => void;
  isOwner: boolean;
}

export default function AppointmentChatBox({ appointment, onClose, isOwner }: AppointmentChatBoxProps) {
  const [message, setMessage] = useState('');
  const updateAppointment = useUpdateAppointment();
  const user = getCurrentUser();

  const sendMessage = async () => {
    if (!message.trim()) return;
    const newMsg = {
      from: isOwner ? 'Owner' : (user?.name || 'Customer'),
      message: message.trim(),
      timestamp: BigInt(Date.now()) * BigInt(1_000_000),
    };
    const updatedApt = {
      ...appointment,
      chatHistory: [...appointment.chatHistory, newMsg],
    };
    try {
      await updateAppointment.mutateAsync(updatedApt);
      setMessage('');
      toast.success('Message sent!');
    } catch {
      toast.error('Failed to send message');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-700 to-purple-900 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-white" />
            <div>
              <p className="text-white font-semibold text-sm">{appointment.customerName}</p>
              <p className="text-purple-200 text-xs">{appointment.service}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Messages */}
        <div className="h-64 overflow-y-auto p-4 space-y-3 bg-purple-50/50">
          {appointment.chatHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-purple-300">
              <MessageSquare className="w-10 h-10 mb-2" />
              <p className="text-sm">No messages yet</p>
            </div>
          ) : (
            appointment.chatHistory.map((msg, i) => {
              const isFromOwner = msg.from === 'Owner';
              const isMyMessage = (isOwner && isFromOwner) || (!isOwner && !isFromOwner);
              return (
                <div key={i} className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                    isMyMessage
                      ? 'bg-purple-700 text-white rounded-br-sm'
                      : 'bg-white text-purple-900 shadow-sm rounded-bl-sm border border-purple-100'
                  }`}>
                    <p className={`text-xs font-semibold mb-0.5 ${isMyMessage ? 'text-purple-200' : 'text-purple-500'}`}>
                      {msg.from}
                    </p>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-purple-100 flex gap-2">
          <input
            type="text"
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 border border-purple-200 rounded-xl px-4 py-2.5 text-sm text-purple-900 placeholder:text-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-300 bg-purple-50/50"
          />
          <button
            onClick={sendMessage}
            disabled={updateAppointment.isPending}
            className="w-10 h-10 flex items-center justify-center bg-purple-700 text-white rounded-xl hover:bg-purple-800 transition-colors disabled:opacity-50"
          >
            {updateAppointment.isPending ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
