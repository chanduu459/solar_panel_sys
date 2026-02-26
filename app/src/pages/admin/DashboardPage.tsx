import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Mail, 
  Settings, 
  LogOut,
  Sun,
  TrendingUp,
  Users,
  Star,
  Zap
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { toast } from 'sonner';

const sidebarLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/projects', label: 'Projects', icon: FolderOpen },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
  { href: '/admin/inquiries', label: 'Inquiries', icon: Mail },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

// Stat Card Component
function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  href 
}: { 
  title: string; 
  value: string | number; 
  subtitle?: string;
  icon: React.ElementType;
  trend?: string;
  href: string;
}) {
  return (
    <Link to={href} className="block">
      <div className="p-6 rounded-2xl bg-gradient-to-b from-[#1f1f1f] to-[#171717] border border-white/10 hover:border-[#c4ff00]/50 transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-[#c4ff00]/20 border border-[#c4ff00]/25 flex items-center justify-center">
            <Icon className="w-6 h-6 text-[#c4ff00]" />
          </div>
          {trend && (
            <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
              {trend}
            </span>
          )}
        </div>
        <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
        <div className="text-3xl font-bold text-white mb-1">{value}</div>
        {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
      </div>
    </Link>
  );
}

export default function AdminDashboardPage() {
  const { user, signOut, isAdmin } = useAuth();
  const { stats, fetchStats } = useData();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-[#141414] border-r border-white/10 fixed left-0 top-0 z-50 hidden lg:block">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c4ff00] to-[#8bc34a] flex items-center justify-center">
                <Sun className="w-5 h-5 text-black" />
              </div>
              <div>
                <span className="font-bold text-white">Solar Systems</span>
                <span className="block text-xs text-gray-500">Admin Panel</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = link.href === '/admin';
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-[#c4ff00] text-black shadow-md shadow-[#c4ff00]/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* User & Logout */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
            <div className="flex items-center gap-3 mb-4 px-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c4ff00] to-[#8bc34a] flex items-center justify-center text-black font-bold">
                {user?.email?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.email}</p>
                <p className="text-xs text-gray-500">{isAdmin ? 'Administrator' : 'User'}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#141414] border-t border-white/10 z-50">
          <nav className="flex justify-around p-2">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-[#c4ff00]"
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 pb-20 lg:pb-0">
          {/* Header */}
          <header className="sticky top-0 z-40 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/10 px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-white">Dashboard</h1>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400 hidden sm:inline">
                  {new Date().toLocaleDateString('en-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="p-6">
            {/* Welcome */}
            <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome back, {user?.email?.split('@')[0] || 'Admin'}!
              </h2>
              <p className="text-gray-400">
                Here&apos;s what&apos;s happening with your solar projects today.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <StatCard
                title="Total Projects"
                value={stats?.totalProjects || 0}
                subtitle={`${stats?.totalCapacity ? (stats.totalCapacity / 1000).toFixed(1) : 0} MW total capacity`}
                icon={FolderOpen}
                href="/admin/projects"
              />
              <StatCard
                title="Pending Inquiries"
                value={stats?.pendingInquiries || 0}
                subtitle={`${stats?.totalInquiries || 0} total inquiries`}
                icon={Mail}
                href="/admin/inquiries"
              />
              <StatCard
                title="Pending Reviews"
                value={stats?.pendingReviews || 0}
                subtitle={`${stats?.approvedReviews || 0} approved reviews`}
                icon={Star}
                href="/admin/reviews"
              />
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
              <div className="flex flex-wrap gap-4">
                <Link to="/admin/projects">
                  <Button className="bg-[#c4ff00] text-black hover:bg-[#d4ff33]">
                    <FolderOpen className="w-4 h-4 mr-2" />
                    Add New Project
                  </Button>
                </Link>
                <Link to="/admin/inquiries">
                  <Button variant="outline" className="border-white/30">
                    <Mail className="w-4 h-4 mr-2" />
                    View Inquiries
                  </Button>
                </Link>
                <Link to="/admin/settings">
                  <Button variant="outline" className="border-white/30">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* System Status */}
              <div className="p-6 rounded-2xl bg-gradient-to-b from-[#1f1f1f] to-[#171717] border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4">System Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <Zap className="w-4 h-4 text-green-400" />
                      </div>
                      <span className="text-gray-300">Database Connection</span>
                    </div>
                    <span className="text-green-400 text-sm">Connected</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <Users className="w-4 h-4 text-green-400" />
                      </div>
                      <span className="text-gray-300">Authentication</span>
                    </div>
                    <span className="text-green-400 text-sm">Active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                      </div>
                      <span className="text-gray-300">Public Website</span>
                    </div>
                    <span className="text-green-400 text-sm">Online</span>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#c4ff00]/12 to-[#8bc34a]/8 border border-[#c4ff00]/30">
                <h3 className="text-lg font-bold text-white mb-4">Admin Tips</h3>
                <ul className="space-y-3 text-gray-300 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-[#c4ff00]">•</span>
                    Regularly check and respond to customer inquiries
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#c4ff00]">•</span>
                    Approve genuine reviews to build trust
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#c4ff00]">•</span>
                    Keep project information up to date
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#c4ff00]">•</span>
                    Update calculator settings as market rates change
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
