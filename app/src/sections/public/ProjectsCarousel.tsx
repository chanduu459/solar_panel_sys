import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Zap, ArrowRight } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import type { Project } from '../../types';

// Project Card Component
function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      to={`/projects/${project.id}`}
      className="flex-shrink-0 w-[280px] sm:w-[320px] lg:w-[380px] group"
    >
      <div className="relative h-[400px] sm:h-[450px] rounded-2xl overflow-hidden bg-[#1a1a1a] border border-white/10 transition-all duration-300 group-hover:border-[#c4ff00]/50 group-hover:shadow-2xl group-hover:shadow-[#c4ff00]/15 group-hover:-translate-y-1">
        {/* Image */}
        <div className="absolute inset-0">
          <img
            src={project.images[0] || '/placeholder-project.jpg'}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
          {/* Tags */}
          {project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {project.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs rounded-full bg-[#c4ff00]/20 text-[#c4ff00] border border-[#c4ff00]/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-[#c4ff00] transition-colors">
            {project.title}
          </h3>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {project.city}
            </span>
            <span className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              {project.capacity_kw} kW
            </span>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-2 text-[#c4ff00] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
            View Project
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        <div className="absolute inset-x-4 bottom-4 h-16 rounded-xl bg-gradient-to-r from-[#c4ff00]/0 via-[#c4ff00]/5 to-[#c4ff00]/0 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
            project.status === 'active'
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : project.status === 'completed'
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
          }`}>
            {project.status}
          </span>
        </div>
      </div>
    </Link>
  );
}

// Infinite Carousel Component
export default function ProjectsCarousel() {
  const { projects, settings, fetchProjects, fetchSettings } = useData();
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const scrollPositionRef = useRef(0);

  useEffect(() => {
    fetchProjects();
    fetchSettings();
  }, [fetchProjects, fetchSettings]);

  // Filter active projects for carousel
  const activeProjects = projects.filter(p => p.status === 'active');
  
  // Duplicate projects for seamless loop
  const duplicatedProjects = [...activeProjects, ...activeProjects, ...activeProjects];

  // Carousel speed from settings (default 30 seconds for full cycle)
  const carouselSpeed = settings?.carousel_speed || 30;

  useEffect(() => {
    if (activeProjects.length === 0 || !containerRef.current) return;

    const container = containerRef.current;
    const cardWidth = window.innerWidth < 640 ? 280 : window.innerWidth < 1024 ? 320 : 380;
    const gap = 24;
    const singleSetWidth = (cardWidth + gap) * activeProjects.length;

    let lastTime = performance.now();
    
    const animate = (currentTime: number) => {
      if (!isPaused) {
        const deltaTime = currentTime - lastTime;
        // Calculate pixels to move per frame for smooth continuous motion
        const pixelsPerMs = singleSetWidth / (carouselSpeed * 1000);
        scrollPositionRef.current += deltaTime * pixelsPerMs;

        // Reset position for seamless loop
        if (scrollPositionRef.current >= singleSetWidth) {
          scrollPositionRef.current = scrollPositionRef.current % singleSetWidth;
        }

        container.style.transform = `translateX(-${scrollPositionRef.current}px)`;
      }
      lastTime = currentTime;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [activeProjects.length, carouselSpeed, isPaused]);

  if (activeProjects.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-24 bg-[#0a0a0a] overflow-hidden">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 tracking-tight">
              Featured Projects
            </h2>
            <p className="text-gray-400 max-w-xl">
              Explore our portfolio of successful solar installations across India
            </p>
          </div>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-[#c4ff00] hover:text-[#d4ff33] font-medium transition-colors"
          >
            View All Projects
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Carousel Container */}
      <div
        className="relative py-2"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-40 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-40 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

        {/* Scrolling Container */}
        <div
          ref={containerRef}
          className="flex gap-6 pl-4 sm:pl-8"
          style={{ willChange: 'transform' }}
        >
          {duplicatedProjects.map((project, index) => (
            <ProjectCard key={`${project.id}-${index}`} project={project} />
          ))}
        </div>

        {/* Pause Indicator */}
        {isPaused && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-xs text-gray-400 z-20">
            Paused
          </div>
        )}
      </div>

      {/* Stats Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Active Projects', value: activeProjects.length },
            { label: 'Total Capacity', value: `${activeProjects.reduce((sum, p) => sum + p.capacity_kw, 0)} kW` },
            { label: 'Cities Covered', value: new Set(activeProjects.map(p => p.city)).size },
            { label: 'States', value: new Set(activeProjects.map(p => p.state)).size },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              <div className="text-xl sm:text-2xl font-bold text-[#c4ff00]">{stat.value}</div>
              <div className="text-xs sm:text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
