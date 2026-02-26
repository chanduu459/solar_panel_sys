import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Calculator, Phone, MapPin, Home } from 'lucide-react';
import { Button } from '../../components/ui/button';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/projects', label: 'Projects', icon: MapPin },
  { href: '/calculator', label: 'Calculator', icon: Calculator },
  { href: '/contact', label: 'Contact', icon: Phone },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-xl border-b border-amber-100 shadow-lg shadow-amber-900/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-shadow">
              <Sun className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-extrabold text-slate-800 group-hover:text-orange-600 transition-colors tracking-tight">
                Solar Systems
              </span>
              <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">India</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 rounded-full border border-amber-100/50 bg-white/50 backdrop-blur-md px-2 py-2 shadow-sm">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                    active
                      ? 'bg-gradient-to-r from-amber-100 to-orange-50 text-orange-700 shadow-sm'
                      : 'text-slate-600 hover:text-orange-600 hover:bg-orange-50/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-orange-600' : 'text-slate-400'}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Link to="/admin/login">
              <Button className="bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 rounded-full px-7 font-bold shadow-md shadow-orange-500/20 border-0 transition-all hover:-translate-y-0.5">
                Owner Login
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-slate-600 hover:text-orange-600 transition-colors rounded-xl hover:bg-orange-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-amber-100 shadow-xl transition-all duration-300 origin-top ${
          isMobileMenuOpen
            ? 'opacity-100 visible scale-y-100'
            : 'opacity-0 invisible scale-y-95'
        }`}
      >
        <nav className="flex flex-col p-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-base font-bold transition-all ${
                  active
                    ? 'bg-gradient-to-r from-amber-100 to-orange-50 text-orange-700 shadow-sm'
                    : 'text-slate-600 hover:text-orange-600 hover:bg-orange-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-orange-600' : 'text-slate-400'}`} />
                {link.label}
              </Link>
            );
          })}
          <Link
            to="/admin/login"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-4 pt-4 border-t border-slate-100 block"
          >
            <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 rounded-xl py-6 font-bold shadow-md shadow-orange-500/20 border-0">
              Owner Login
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}