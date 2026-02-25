import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { getCurrentUser } from '../lib/authStore';
import { localStore, Review } from '../lib/localStore';
import OwnerLayout from '../components/OwnerLayout';
import { Star, MessageSquare, Send } from 'lucide-react';
import { toast } from 'sonner';

export default function OwnerReviews() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [reviews, setReviews] = useState<Review[]>(localStore.getReviews());
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user || user.role !== 'owner') navigate({ to: '/login' });
  }, [user, navigate]);

  const submitReply = (reviewId: string) => {
    const reply = replyInputs[reviewId]?.trim();
    if (!reply) return;
    const updated = reviews.map(r => r.id === reviewId ? { ...r, ownerReply: reply } : r);
    setReviews(updated);
    localStore.setReviews(updated);
    setReplyInputs(prev => ({ ...prev, [reviewId]: '' }));
    toast.success('Reply posted!');
  };

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={`w-4 h-4 ${i <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
        />
      ))}
    </div>
  );

  return (
    <OwnerLayout title="Reviews">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h2 className="text-xl font-bold text-purple-900 font-playfair mb-6">Customer Reviews</h2>

        {reviews.length === 0 ? (
          <div className="text-center py-16">
            <Star className="w-16 h-16 text-purple-200 mx-auto mb-4" />
            <p className="text-purple-400 font-medium">No reviews yet</p>
            <p className="text-purple-300 text-sm mt-1">Customer reviews will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map(review => (
              <div key={review.id} className="luxury-card bg-white rounded-3xl p-5 shadow-md border border-purple-100">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-purple-900">{review.customerName}</p>
                    <p className="text-purple-400 text-xs">{review.date}</p>
                  </div>
                  {renderStars(review.rating)}
                </div>
                <p className="text-purple-700 text-sm mb-3">{review.text}</p>

                {review.ownerReply && (
                  <div className="bg-purple-50 rounded-2xl p-3 mb-3 border border-purple-100">
                    <p className="text-xs font-semibold text-purple-600 mb-1">Your Reply:</p>
                    <p className="text-sm text-purple-800">{review.ownerReply}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={replyInputs[review.id] || ''}
                    onChange={e => setReplyInputs(prev => ({ ...prev, [review.id]: e.target.value }))}
                    placeholder={review.ownerReply ? 'Update reply...' : 'Write a reply...'}
                    className="flex-1 border border-purple-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 bg-purple-50/50"
                    onKeyDown={e => e.key === 'Enter' && submitReply(review.id)}
                  />
                  <button
                    onClick={() => submitReply(review.id)}
                    className="w-9 h-9 flex items-center justify-center bg-purple-700 text-white rounded-xl hover:bg-purple-800 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </OwnerLayout>
  );
}
