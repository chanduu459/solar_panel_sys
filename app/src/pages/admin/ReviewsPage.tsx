import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, 
  CheckCircle, 
  Trash2, 
  MessageSquare,
  Search,
  Loader2
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { toast } from 'sonner';

// Star Rating Display
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating
              ? 'fill-[#c4ff00] text-[#c4ff00]'
              : 'fill-gray-600 text-gray-600'
          }`}
        />
      ))}
    </div>
  );
}

export default function AdminReviewsPage() {
  const { signOut } = useAuth();
  const { reviews, fetchReviews, approveReview, deleteReview } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews(true);
  }, [fetchReviews]);

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.reviewer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.project?.title.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filter === 'all'
        ? true
        : filter === 'pending'
        ? !review.is_approved
        : review.is_approved;

    return matchesSearch && matchesFilter;
  });

  const handleApprove = async (id: string) => {
    setIsProcessing(id);
    const result = await approveReview(id, responseText || undefined);
    if (result) {
      toast.success('Review approved successfully');
      setRespondingTo(null);
      setResponseText('');
    } else {
      toast.error('Failed to approve review');
    }
    setIsProcessing(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    setIsProcessing(id);
    const success = await deleteReview(id);
    if (success) {
      toast.success('Review deleted successfully');
    } else {
      toast.error('Failed to delete review');
    }
    setIsProcessing(null);
  };

  const pendingCount = reviews.filter((r) => !r.is_approved).length;
  const approvedCount = reviews.filter((r) => r.is_approved).length;

  const sidebarLinks = [
    { href: '/admin', label: 'Dashboard', icon: Star },
    { href: '/admin/projects', label: 'Projects', icon: Star },
    { href: '/admin/reviews', label: 'Reviews', icon: Star },
    { href: '/admin/inquiries', label: 'Inquiries', icon: Star },
    { href: '/admin/settings', label: 'Settings', icon: Star },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-[#1a1a1a] border-r border-white/10 fixed left-0 top-0 z-50 hidden lg:block">
          <div className="p-6 border-b border-white/10">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c4ff00] to-[#8bc34a] flex items-center justify-center">
                <Star className="w-5 h-5 text-black" />
              </div>
              <div>
                <span className="font-bold text-white">Solar Systems</span>
                <span className="block text-xs text-gray-500">Admin Panel</span>
              </div>
            </Link>
          </div>
          <nav className="p-4 space-y-1">
            {sidebarLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  link.href === '/admin/reviews'
                    ? 'bg-[#c4ff00] text-black'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
            <button
              onClick={signOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
            >
              <Star className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64">
          <header className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10 px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-white">Reviews Management</h1>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-sm">
                  {pendingCount} pending
                </span>
                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">
                  {approvedCount} approved
                </span>
              </div>
            </div>
          </header>

          <div className="p-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search reviews..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="flex gap-2">
                {(['all', 'pending', 'approved'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === f
                        ? 'bg-[#c4ff00] text-black'
                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <div
                  key={review.id}
                  className={`p-6 rounded-2xl border ${
                    review.is_approved
                      ? 'bg-[#1a1a1a] border-white/10'
                      : 'bg-yellow-500/5 border-yellow-500/30'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    {/* Avatar & Info */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c4ff00] to-[#8bc34a] flex items-center justify-center text-black font-bold text-lg">
                        {review.reviewer_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{review.reviewer_name}</h3>
                        <StarRating rating={review.rating} />
                        {review.project && (
                          <p className="text-sm text-gray-500 mt-1">
                            Project: {review.project.title}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Review Content */}
                    <div className="flex-1 lg:px-4">
                      <p className="text-gray-300">&ldquo;{review.comment}&rdquo;</p>
                      <p className="text-sm text-gray-500 mt-2">
                        {new Date(review.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>

                      {/* Admin Response */}
                      {review.admin_response && (
                        <div className="mt-4 p-4 rounded-xl bg-[#c4ff00]/5 border border-[#c4ff00]/20">
                          <p className="text-sm text-[#c4ff00] font-medium mb-1">
                            Your Response:
                          </p>
                          <p className="text-gray-400 text-sm">{review.admin_response}</p>
                        </div>
                      )}

                      {/* Response Form */}
                      {respondingTo === review.id && !review.is_approved && (
                        <div className="mt-4">
                          <Textarea
                            placeholder="Write a response..."
                            value={responseText}
                            onChange={(e) => setResponseText(e.target.value)}
                            rows={3}
                            className="bg-white/5 border-white/10 text-white resize-none mb-2"
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleApprove(review.id)}
                              disabled={isProcessing === review.id}
                              className="bg-[#c4ff00] text-black hover:bg-[#d4ff33]"
                            >
                              {isProcessing === review.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Approve with Response
                                </>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setRespondingTo(null);
                                setResponseText('');
                              }}
                              className="border-white/30"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex lg:flex-col gap-2">
                      {!review.is_approved && respondingTo !== review.id && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(review.id)}
                            disabled={isProcessing === review.id}
                            className="bg-[#c4ff00] text-black hover:bg-[#d4ff33]"
                          >
                            {isProcessing === review.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setRespondingTo(review.id)}
                            className="border-white/30"
                          >
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Respond
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(review.id)}
                        disabled={isProcessing === review.id}
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                      >
                        {isProcessing === review.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredReviews.length === 0 && (
              <div className="text-center py-16">
                <Star className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No reviews found</h3>
                <p className="text-gray-400">
                  {filter === 'pending'
                    ? 'No pending reviews to approve'
                    : filter === 'approved'
                    ? 'No approved reviews yet'
                    : 'No reviews available'}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
