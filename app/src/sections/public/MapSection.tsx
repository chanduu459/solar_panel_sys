import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Zap, Navigation } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

export default function MapSection() {
  const { projects, settings, fetchProjects, fetchSettings } = useData();
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    fetchProjects();
    fetchSettings();
  }, [fetchProjects, fetchSettings]);

  // Filter projects with valid coordinates
  const mapProjects = projects.filter(
    (p) => p.latitude && p.longitude && p.status === 'active'
  );

  const mapCenterLat = settings?.map_center_lat || 21.0;
  const mapCenterLng = settings?.map_center_lng || 78.0;

  // Build map URL with markers
  const buildMapUrl = () => {
    const baseUrl = 'https://www.openstreetmap.org/export/embed.html';
    const bbox = getBoundingBox();
    const markerParams = mapProjects
      .map((p) => `mlat=${p.latitude}&mlon=${p.longitude}`)
      .join('&');
    return `${baseUrl}?bbox=${bbox}&layer=mapnik${markerParams ? '&' + markerParams : ''}`;
  };

  const getBoundingBox = () => {
    if (mapProjects.length === 0) {
      return `${mapCenterLng - 5}%2C${mapCenterLat + 5}%2C${mapCenterLng + 5}%2C${mapCenterLat - 5}`;
    }
    const lats = mapProjects.map((p) => p.latitude);
    const lngs = mapProjects.map((p) => p.longitude);
    const minLat = Math.min(...lats) - 2;
    const maxLat = Math.max(...lats) + 2;
    const minLng = Math.min(...lngs) - 2;
    const maxLng = Math.max(...lngs) + 2;
    return `${minLng}%2C${maxLat}%2C${maxLng}%2C${minLat}`;
  };

  if (mapProjects.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-24 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">
            Our Projects Across India
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            From Mumbai to Delhi, Bangalore to Kolkata - explore our solar installations 
            powering businesses and communities nationwide
          </p>
        </div>

        {/* Map Container */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
          {/* Map Stats Overlay */}
          <div className="absolute top-4 left-4 z-10 bg-[#0a0a0a]/90 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#c4ff00]/20 flex items-center justify-center">
                <Navigation className="w-5 h-5 text-[#c4ff00]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{mapProjects.length}</div>
                <div className="text-xs text-gray-400">Active Projects</div>
              </div>
            </div>
          </div>

          {/* Embedded Map */}
          <div className="h-[400px] sm:h-[500px] lg:h-[600px]">
            <iframe
              src={buildMapUrl()}
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'grayscale(100%) invert(92%)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Solar Projects Map"
              onLoad={() => setIsMapLoaded(true)}
            />
          </div>

          {/* Loading State */}
          {!isMapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a1a]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#c4ff00]" />
            </div>
          )}
        </div>

        {/* City List */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {[...new Set(mapProjects.map((p) => p.city))]
            .slice(0, 10)
            .map((city) => (
              <Link
                key={city}
                to={`/projects?city=${encodeURIComponent(city)}`}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors text-sm"
              >
                <MapPin className="w-3 h-3" />
                {city}
              </Link>
            ))}
        </div>

        {/* Project List Below Map */}
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mapProjects.slice(0, 6).map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="group flex items-center gap-4 p-4 rounded-xl bg-[#1a1a1a] border border-white/10 hover:border-[#c4ff00]/50 transition-all"
            >
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={project.images[0] || '/placeholder-project.jpg'}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-white truncate group-hover:text-[#c4ff00] transition-colors">
                  {project.title}
                </h3>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {project.city}
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {project.capacity_kw} kW
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
