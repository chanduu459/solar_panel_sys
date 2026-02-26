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
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24"
      style={{
        background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #0a0a0a 100%)',
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #c4ff00 0%, transparent 70%)',
            transform: 'translate(var(--mouse-x, 0), var(--mouse-y, 0))',
            transition: 'transform 0.3s ease-out',
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #8bc34a 0%, transparent 70%)',
            transform: 'translate(calc(var(--mouse-x, 0) * -1), calc(var(--mouse-y, 0) * -1))',
            transition: 'transform 0.3s ease-out',
          }}
        />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(196, 255, 0, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(196, 255, 0, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />

        {/* Floating Solar Panels */}
        <div className="absolute top-20 right-10 w-32 h-32 opacity-10 animate-pulse">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            <rect x="10" y="10" width="80" height="80" stroke="#c4ff00" strokeWidth="2" />
            <line x1="10" y1="30" x2="90" y2="30" stroke="#c4ff00" strokeWidth="1" />
            <line x1="10" y1="50" x2="90" y2="50" stroke="#c4ff00" strokeWidth="1" />
            <line x1="10" y1="70" x2="90" y2="70" stroke="#c4ff00" strokeWidth="1" />
            <line x1="30" y1="10" x2="30" y2="90" stroke="#c4ff00" strokeWidth="1" />
            <line x1="50" y1="10" x2="50" y2="90" stroke="#c4ff00" strokeWidth="1" />
            <line x1="70" y1="10" x2="70" y2="90" stroke="#c4ff00" strokeWidth="1" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#c4ff00]/10 border border-[#c4ff00]/30 mb-8 shadow-[0_0_0_4px_rgba(196,255,0,0.08)]">
          <span className="w-2 h-2 rounded-full bg-[#c4ff00] animate-pulse" />
          <span className="text-sm text-[#c4ff00] font-semibold tracking-wide">
            Leading Solar Solutions in India
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
          Power Your Future with{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c4ff00] to-[#8bc34a]">
            Solar Energy
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-gray-300/90 max-w-3xl mx-auto mb-10 leading-relaxed">
          Transform your energy consumption with our cutting-edge solar installations. 
          Save money, reduce your carbon footprint, and join India&apos;s green revolution.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link to="/projects">
            <Button 
              size="lg" 
              className="bg-[#c4ff00] text-black hover:bg-[#d4ff33] rounded-full px-8 py-6 text-lg font-semibold group shadow-xl shadow-[#c4ff00]/20"
            >
              Explore Projects
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/calculator">
            <Button 
              size="lg" 
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 rounded-full px-8 py-6 text-lg font-semibold"
            >
              Calculate Savings
            </Button>
          </Link>
        </div>

        <div className="mb-16 flex flex-wrap items-center justify-center gap-3 text-sm text-gray-300">
          <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10">End-to-end EPC execution</span>
          <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10">Real-time performance tracking</span>
          <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10">Trusted by homes & enterprises</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index} 
                className="text-center p-4 sm:p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 transition-transform duration-300 hover:-translate-y-1"
              >
                <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-[#c4ff00] mx-auto mb-2" />
                <div className="text-xl sm:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-xs sm:text-sm text-gray-400">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
    </section>
  );
}
