import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { getCurrentUser } from '../lib/authStore';
import { localStore, Review } from '../lib/localStore';
import CustomerLayout from '../components/CustomerLayout';
import { Star, Send } from 'lucide-react';
import { toast } from 'sonner';

export default function CustomerReviews() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [reviews, setReviews] = useState<Review[]>(localStore.getReviews());
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) navigate({ to: '/login' });
  }, [user, navigate]);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a star rating');
      return;
    }
    if (!reviewText.trim()) {
      toast.error('Please write a review');
      return;
    }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 500));
    const newReview: Review = {
      id: Date.now().toString(),
      customerName: user?.name || 'Customer',
      rating,
      text: reviewText.trim(),
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
    };
    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStore.setReviews(updated);
    setRating(0);
    setReviewText('');
    setSubmitting(false);
    toast.success('Review submitted! Thank you for your feedback.');
  };

  const myReviews = reviews.filter(r => r.customerName === user?.name);
  const otherReviews = reviews.filter(r => r.customerName !== user?.name);

  const renderStars = (value: number, interactive = false) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && setRating(i)}
          onMouseEnter={() => interactive && setHoverRating(i)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          className={interactive ? 'cursor-pointer transition-transform hover:scale-110' : 'cursor-default'}
        >
          <Star
            className={`w-6 h-6 transition-colors ${
              i <= (interactive ? (hoverRating || rating) : value)
                ? 'fill-amber-400 text-amber-400'
                : 'text-gray-200'
            }`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <CustomerLayout title="Reviews" showFloatingButton={true}>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <h2 className="text-xl font-bold text-purple-900 font-playfair">Reviews</h2>

        {/* Submit Review */}
        <div className="bg-white rounded-3xl p-5 shadow-md border border-purple-100">
          <h3 className="font-bold text-purple-900 font-playfair mb-4">Share Your Experience</h3>
          <div className="mb-4">
            <p className="text-sm text-purple-600 mb-2 font-medium">Your Rating</p>
            {renderStars(rating, true)}
          </div>
          <textarea
            value={reviewText}
            onChange={e => setReviewText(e.target.value)}
            placeholder="Tell us about your experience at Enrich Beauty Parlour..."
            rows={4}
            className="w-full border border-purple-200 rounded-2xl px-4 py-3 text-sm text-purple-900 placeholder:text-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-300 bg-purple-50/50 resize-none mb-3"
          />
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:from-purple-700 hover:to-purple-900 transition-all duration-300 disabled:opacity-60"
          >
            {submitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>

        {/* My Reviews */}
        {myReviews.length > 0 && (
          <div>
            <h3 className="font-bold text-purple-900 font-playfair mb-3">My Reviews</h3>
            <div className="space-y-3">
              {myReviews.map(review => (
                <div key={review.id} className="bg-white rounded-3xl p-5 shadow-md border border-purple-100">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-purple-900 text-sm">{review.customerName}</p>
                      <p className="text-purple-400 text-xs">{review.date}</p>
                    </div>
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-purple-700 text-sm">{review.text}</p>
                  {review.ownerReply && (
                    <div className="mt-3 bg-purple-50 rounded-2xl p-3 border border-purple-100">
                      <p className="text-xs font-semibold text-purple-600 mb-1">Owner's Reply:</p>
                      <p className="text-sm text-purple-800">{review.ownerReply}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Reviews */}
        {otherReviews.length > 0 && (
          <div>
            <h3 className="font-bold text-purple-900 font-playfair mb-3">Customer Reviews</h3>
            <div className="space-y-3">
              {otherReviews.map(review => (
                <div key={review.id} className="bg-white rounded-3xl p-5 shadow-md border border-purple-100">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-purple-900 text-sm">{review.customerName}</p>
                      <p className="text-purple-400 text-xs">{review.date}</p>
                    </div>
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-purple-700 text-sm">{review.text}</p>
                  {review.ownerReply && (
                    <div className="mt-3 bg-purple-50 rounded-2xl p-3 border border-purple-100">
                      <p className="text-xs font-semibold text-purple-600 mb-1">Owner's Reply:</p>
                      <p className="text-sm text-purple-800">{review.ownerReply}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {reviews.length === 0 && (
          <div className="text-center py-12">
            <Star className="w-16 h-16 text-purple-200 mx-auto mb-4" />
            <p className="text-purple-400 font-medium">No reviews yet</p>
            <p className="text-purple-300 text-sm mt-1">Be the first to share your experience!</p>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
