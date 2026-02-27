import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {  Zap } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
// Double check the spelling: indiamap.png (one 'i')
import indiaMapImg from './indiamap.png';
import isoImg from './iso.jpeg';
import iesImg from './iec.jpeg';
import bisImg from './bis.jpeg';
import AllmImg from './Allm.jpeg';

export default function MapSection() {
  const { projects, fetchProjects } = useData();
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Filter projects with valid coordinates
  const mapProjects = projects.filter(
    (p) => p.latitude && p.longitude && p.status === 'active'
  );

  // Get unique cities for navigation
  const cities = [...new Set(mapProjects.map((p) => p.city))].slice(0, 8);

  /**
   * CALIBRATED COORDINATE PROJECTION for indiamap.png
   * This handles the specific padding in your local image.
   */
  const getPinPosition = (lat: number, lng: number) => {
    // Calibration for the local PNG file padding
    const IMG_MIN_LAT = 5.0;   
    const IMG_MAX_LAT = 38.5;  
    const IMG_MIN_LNG = 65.0;  
    const IMG_MAX_LNG = 98.5;  

    let x = ((lng - IMG_MIN_LNG) / (IMG_MAX_LNG - IMG_MIN_LNG)) * 100;
    let y = ((IMG_MAX_LAT - lat) / (IMG_MAX_LAT - IMG_MIN_LAT)) * 100;

    // Manual fine-tune nudges
    const X_OFFSET = 1.5; 
    const Y_OFFSET = -0.5; 

    return { left: `${x + X_OFFSET}%`, top: `${y + Y_OFFSET}%` };
  };

  if (mapProjects.length === 0) return null;

  return (
    <section className="relative py-20 sm:py-32 bg-white overflow-hidden font-sans">
      {/* Background Decor */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Content */}
          <div className="max-w-2xl">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
              Our Projects <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">Across India</span>
            </h2>
            <p className="text-lg text-slate-600 font-medium mb-10 leading-relaxed">
              Find our verified solar installations in {cities.length}+ cities. 
              Click on a city to view specific projects.
            </p>

            <div className="flex flex-wrap gap-3 mb-12">
              {cities.map((city) => (
                <button
                  key={city}
                  onMouseEnter={() => setActiveCity(city)}
                  onMouseLeave={() => setActiveCity(null)}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border ${
                    activeCity === city
                      ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-orange-300 hover:text-orange-600'
                  }`}
                >
                  {city}
                </button>
              ))}
              <Link to="/projects" className="px-5 py-2.5 rounded-full text-sm font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 transition-colors">
                View All →
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {mapProjects.slice(0, 4).map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-orange-200 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-slate-800 truncate text-sm">{project.title}</h3>
                    <p className="text-xs font-medium text-slate-500">{project.city} • {project.capacity_kw}kW</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Right: The Local India Map */}
          <div className="relative flex items-center justify-center min-h-[500px]">
            <div className="relative w-full max-w-[550px] aspect-[4/5]">
              {/* IMAGE SOURCE UPDATED TO LOCAL IMPORT */}
              <img 
                src={indiaMapImg} 
                alt="Map of India" 
                onLoad={() => setIsMapLoaded(true)}
                className={`w-full h-full object-contain transition-opacity duration-700 ${isMapLoaded ? 'opacity-100' : 'opacity-20'}`}
              />

              {/* Loader - Shows if image or data hasn't finished */}
              {!isMapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
                </div>
              )}

              {/* Pins Layer - Only visible when map is loaded */}
              {isMapLoaded && mapProjects.map((project) => {
                const position = getPinPosition(project.latitude, project.longitude);
                const isHovered = activeCity === project.city;

                return (
                  <div
                    key={project.id}
                    className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2 group transition-all duration-500"
                    style={position}
                  >
                    <Link to={`/projects/${project.id}`} className="relative block">
                      <div className={`relative flex items-center justify-center transition-all duration-300 ${isHovered ? 'scale-125 z-50' : 'scale-100'}`}>
                        {/* Pulse Ring */}
                        <div className={`absolute inset-0 rounded-full animate-ping ${isHovered ? 'bg-orange-400 opacity-40' : 'bg-blue-400 opacity-20'}`} />
                        
                        {/* Pin Dot */}
                        <div className="w-4 h-4 bg-white rounded-full shadow-lg flex items-center justify-center border border-slate-100 relative z-10">
                          <div className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${isHovered ? 'bg-orange-500' : 'bg-blue-600'}`} />
                        </div>

                        {/* Label Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 bg-slate-900 text-white text-[10px] font-bold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          {project.title}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Certifications Strip */}
        <div className="mt-20 pt-12 border-t border-slate-100">
          <p className="text-center text-sm font-bold text-slate-500 uppercase tracking-wider mb-8">
            Certified & Compliant
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            <div className="h-16 w-24 sm:h-20 sm:w-28 flex items-center justify-center p-2 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <img
                src={iesImg}
                alt="IEC Certification"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="h-16 w-24 sm:h-20 sm:w-28 flex items-center justify-center p-2 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <img
                src={isoImg}
                alt="ISO/IEC Certification"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="h-16 w-24 sm:h-20 sm:w-28 flex items-center justify-center p-2 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <img
                src={AllmImg}
                alt="ALMM Certification"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="h-16 w-24 sm:h-20 sm:w-28 flex items-center justify-center p-2 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <img
                src={bisImg}
                alt="Bureau of Indian Standards"
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}