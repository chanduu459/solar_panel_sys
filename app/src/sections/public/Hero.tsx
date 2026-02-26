import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Leaf, TrendingUp } from 'lucide-react';
import { Button } from '../../components/ui/button';

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const x = (clientX / innerWidth - 0.5) * 20;
      const y = (clientY / innerHeight - 0.5) * 20;
      
      heroRef.current.style.setProperty('--mouse-x', `${x}px`);
      heroRef.current.style.setProperty('--mouse-y', `${y}px`);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const stats = [
    { icon: Zap, value: '500+', label: 'Installations' },
    { icon: Leaf, value: '50MW+', label: 'Solar Capacity' },
    { icon: TrendingUp, value: '₹50Cr+', label: 'Client Savings' },
  ];

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 bg-gradient-to-br from-amber-50 via-orange-50/50 to-white selection:bg-amber-200 font-sans"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs (Warm Sun Colors) */}
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-30 blur-3xl mix-blend-multiply"
          style={{
            background: 'radial-gradient(circle, #fbbf24 0%, #f97316 40%, transparent 70%)',
            transform: 'translate(var(--mouse-x, 0), var(--mouse-y, 0))',
            transition: 'transform 0.3s ease-out',
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-20 blur-3xl mix-blend-multiply"
          style={{
            background: 'radial-gradient(circle, #fde047 0%, #f59e0b 50%, transparent 70%)',
            transform: 'translate(calc(var(--mouse-x, 0) * -1), calc(var(--mouse-y, 0) * -1))',
            transition: 'transform 0.3s ease-out',
          }}
        />
        
        {/* Subtle Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              linear-gradient(rgba(245, 158, 11, 0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(245, 158, 11, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />

        {/* Floating Solar Panels / Abstract Shapes */}
        <div className="absolute top-32 right-12 w-32 h-32 opacity-20 animate-pulse">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            <rect x="10" y="10" width="80" height="80" stroke="#f97316" strokeWidth="2" rx="4" />
            <line x1="10" y1="36" x2="90" y2="36" stroke="#f97316" strokeWidth="1.5" />
            <line x1="10" y1="63" x2="90" y2="63" stroke="#f97316" strokeWidth="1.5" />
            <line x1="36" y1="10" x2="36" y2="90" stroke="#f97316" strokeWidth="1.5" />
            <line x1="63" y1="10" x2="63" y2="90" stroke="#f97316" strokeWidth="1.5" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-8 lg:mt-0">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-orange-100/80 border border-orange-200 mb-8 shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
          <span className="text-sm text-orange-700 font-bold tracking-wide uppercase">
            Leading Solar Solutions in India
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight drop-shadow-sm">
          Power Your Future with{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500 drop-shadow-none">
            Solar Energy
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-slate-600 font-medium max-w-3xl mx-auto mb-10 leading-relaxed">
          Transform your energy consumption with our cutting-edge solar installations. 
          Save money, reduce your carbon footprint, and join India&apos;s green revolution.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link to="/projects">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 rounded-full px-8 py-6 text-lg font-bold group shadow-lg shadow-orange-500/25 border-0 transition-all hover:-translate-y-0.5"
            >
              Explore Projects
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/calculator">
            <Button 
              size="lg" 
              variant="outline"
              className="bg-white/80 backdrop-blur-sm border-slate-200 text-slate-700 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 rounded-full px-8 py-6 text-lg font-bold shadow-sm transition-all"
            >
              Calculate Savings
            </Button>
          </Link>
        </div>

        {/* Feature Tags */}
        <div className="mb-16 flex flex-wrap items-center justify-center gap-3 text-sm font-bold text-slate-500">
          <span className="px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-amber-100 shadow-sm">End-to-end EPC execution</span>
          <span className="px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-amber-100 shadow-sm">Real-time performance tracking</span>
          <span className="px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-amber-100 shadow-sm">Trusted by homes & enterprises</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 max-w-3xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index} 
                className="text-center p-6 rounded-3xl bg-white/80 backdrop-blur-md border border-amber-100 shadow-xl shadow-orange-500/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-500/10 hover:border-orange-200 group"
              >
                <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7 text-orange-500" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-1">{stat.value}</div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
}