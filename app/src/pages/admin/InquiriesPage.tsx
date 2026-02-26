import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Search,
  Phone,
  MessageSquare,
  Loader2
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { toast } from 'sonner';
import type { Inquiry } from '../../types';

const statusColors = {
  new: 'bg-blue-500/20 text-blue-400',
  in_progress: 'bg-yellow-500/20 text-yellow-400',
  resolved: 'bg-green-500/20 text-green-400',
  archived: 'bg-gray-500/20 text-gray-400',
};

const statusLabels = {
  new: 'New',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  archived: 'Archived',
};

export default function AdminInquiriesPage() {
  const { signOut } = useAuth();
  const { inquiries, fetchInquiries, updateInquiry } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'new' | 'in_progress' | 'resolved' | 'archived'>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesSearch =
      inquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filter === 'all' ? true : inquiry.status === filter;

    return matchesSearch && matchesFilter;
  });

  const handleStatusChange = async (id: string, newStatus: Inquiry['status']) => {
    setIsProcessing(true);
    const result = await updateInquiry(id, { status: newStatus });
    if (result) {
      toast.success(`Status updated to ${statusLabels[newStatus]}`);
      if (selectedInquiry?.id === id) {
        setSelectedInquiry({ ...selectedInquiry, status: newStatus });
      }
    } else {
      toast.error('Failed to update status');
    }
    setIsProcessing(false);
  };

  const handleSaveNotes = async () => {
    if (!selectedInquiry) return;

    setIsProcessing(true);
    const result = await updateInquiry(selectedInquiry.id, { notes });
    if (result) {
      toast.success('Notes saved successfully');
      setSelectedInquiry({ ...selectedInquiry, notes });
    } else {
      toast.error('Failed to save notes');
    }
    setIsProcessing(false);
  };

  const openInquiryDetails = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setNotes(inquiry.notes || '');
  };

  const newCount = inquiries.filter((i) => i.status === 'new').length;
  const inProgressCount = inquiries.filter((i) => i.status === 'in_progress').length;

  const sidebarLinks = [
    { href: '/admin', label: 'Dashboard', icon: Mail },
    { href: '/admin/projects', label: 'Projects', icon: Mail },
    { href: '/admin/reviews', label: 'Reviews', icon: Mail },
    { href: '/admin/inquiries', label: 'Inquiries', icon: Mail },
    { href: '/admin/settings', label: 'Settings', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-[#1a1a1a] border-r border-white/10 fixed left-0 top-0 z-50 hidden lg:block">
          <div className="p-6 border-b border-white/10">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c4ff00] to-[#8bc34a] flex items-center justify-center">
                <Mail className="w-5 h-5 text-black" />
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
                  link.href === '/admin/inquiries'
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
              <Mail className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64">
          <header className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10 px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-white">Inquiries</h1>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm">
                  {newCount} new
                </span>
                <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-sm">
                  {inProgressCount} in progress
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
                  placeholder="Search inquiries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {(['all', 'new', 'in_progress', 'resolved', 'archived'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === f
                        ? 'bg-[#c4ff00] text-black'
                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {f === 'all' ? 'All' : statusLabels[f]}
                  </button>
                ))}
              </div>
            </div>

            {/* Inquiries List */}
            <div className="space-y-4">
              {filteredInquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  onClick={() => openInquiryDetails(inquiry)}
                  className="p-5 rounded-2xl bg-[#1a1a1a] border border-white/10 hover:border-[#c4ff00]/50 transition-all cursor-pointer"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Icon & Info */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c4ff00] to-[#8bc34a] flex items-center justify-center text-black font-bold text-lg">
                        {inquiry.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{inquiry.name}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {inquiry.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {inquiry.phone}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Message Preview */}
                    <div className="flex-1 lg:px-4">
                      <p className="text-gray-400 text-sm line-clamp-2">
                        &ldquo;{inquiry.message}&rdquo;
                      </p>
                      {inquiry.project && (
                        <p className="text-xs text-[#c4ff00] mt-1">
                          Re: {inquiry.project.title}
                        </p>
                      )}
                    </div>

                    {/* Status & Date */}
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[inquiry.status]}`}>
                        {statusLabels[inquiry.status]}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(inquiry.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredInquiries.length === 0 && (
              <div className="text-center py-16">
                <Mail className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No inquiries found</h3>
                <p className="text-gray-400">
                  {filter === 'new'
                    ? 'No new inquiries'
                    : filter === 'in_progress'
                    ? 'No inquiries in progress'
                    : 'No inquiries available'}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Inquiry Details Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#1a1a1a] rounded-3xl border border-white/10">
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-white/10 bg-[#1a1a1a]">
              <h2 className="text-xl font-bold text-white">Inquiry Details</h2>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <span className="sr-only">Close</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Contact Info */}
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#c4ff00] to-[#8bc34a] flex items-center justify-center text-black font-bold text-xl">
                  {selectedInquiry.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedInquiry.name}</h3>
                  <div className="space-y-1 mt-2">
                    <a
                      href={`mailto:${selectedInquiry.email}`}
                      className="flex items-center gap-2 text-gray-400 hover:text-[#c4ff00] transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      {selectedInquiry.email}
                    </a>
                    <a
                      href={`tel:${selectedInquiry.phone}`}
                      className="flex items-center gap-2 text-gray-400 hover:text-[#c4ff00] transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      {selectedInquiry.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="p-4 rounded-xl bg-white/5">
                <h4 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Message
                </h4>
                <p className="text-gray-300 whitespace-pre-wrap">{selectedInquiry.message}</p>
              </div>

              {/* Project Reference */}
              {selectedInquiry.project && (
                <div className="p-4 rounded-xl bg-[#c4ff00]/5 border border-[#c4ff00]/20">
                  <h4 className="text-sm font-medium text-[#c4ff00] mb-1">Related Project</h4>
                  <p className="text-white">{selectedInquiry.project.title}</p>
                </div>
              )}

              {/* Status */}
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Status</h4>
                <div className="flex gap-2 flex-wrap">
                  {(['new', 'in_progress', 'resolved', 'archived'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(selectedInquiry.id, status)}
                      disabled={isProcessing || selectedInquiry.status === status}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedInquiry.status === status
                          ? statusColors[status]
                          : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {statusLabels[status]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Internal Notes</h4>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about this inquiry..."
                  rows={4}
                  className="bg-white/5 border-white/10 text-white resize-none mb-2"
                />
                <Button
                  onClick={handleSaveNotes}
                  disabled={isProcessing}
                  variant="outline"
                  className="border-white/30"
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Notes'}
                </Button>
              </div>

              {/* Date */}
              <div className="text-sm text-gray-500">
                Received on{' '}
                {new Date(selectedInquiry.created_at).toLocaleDateString('en-IN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
