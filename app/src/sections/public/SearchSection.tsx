import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Zap, X } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { useData } from '../../contexts/DataContext';
import type { Project } from '../../types';

export default function SearchSection() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Project[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { projects, fetchProjects } = useData();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Filter suggestions based on query
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const filtered = projects
      .filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.city.toLowerCase().includes(query.toLowerCase()) ||
          p.capacity_kw.toString().includes(query)
      )
      .slice(0, 5);
    setSuggestions(filtered);
  }, [query, projects]);

  const handleSearch = useCallback(() => {
    setShowSuggestions(false);
    navigate(`/projects?search=${encodeURIComponent(query)}`);
  }, [query, navigate]);

  const handleSuggestionClick = useCallback((project: Project) => {
    setShowSuggestions(false);
    navigate(`/projects/${project.id}`);
  }, [navigate]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Get unique cities for quick filters
  const uniqueCities = [...new Set(projects.map((p) => p.city))].slice(0, 5);

  return (
    <section className="py-16 sm:py-24 bg-[#0a0a0a]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 tracking-tight">
            Find Your Solar Solution
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Search by project name, city, or capacity
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-3 backdrop-blur-md shadow-2xl shadow-black/30">
          <div className="flex items-center gap-2 p-2 rounded-2xl bg-[#111111]/80 border border-white/10 focus-within:border-[#c4ff00]/50 focus-within:ring-2 focus-within:ring-[#c4ff00]/20 transition-all">
            <Search className="w-5 h-5 text-gray-400 ml-3" />
            <Input
              type="text"
              placeholder="Search projects..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowSuggestions(true)}
              className="flex-1 bg-transparent border-0 text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
            />
            {query && (
              <button
                onClick={clearSearch}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <Button
              onClick={handleSearch}
              className="bg-[#c4ff00] text-black hover:bg-[#d4ff33] rounded-xl px-7 font-semibold shadow-lg shadow-[#c4ff00]/20"
            >
              Search
            </Button>
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#171717] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50">
              {suggestions.map((project) => (
                <button
                  key={project.id}
                  onClick={() => handleSuggestionClick(project)}
                  className="w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-colors text-left"
                >
                  <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-[#c4ff00]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white truncate">
                      {project.title}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {project.city}
                      </span>
                      <span>•</span>
                      <span>{project.capacity_kw} kW</span>
                    </div>
                  </div>
                </button>
              ))}
              <button
                onClick={handleSearch}
                className="w-full p-4 text-center text-[#c4ff00] hover:bg-white/5 transition-colors border-t border-white/10"
              >
                View all results
              </button>
            </div>
          )}
        </div>

        {/* Quick City Filters */}
        {uniqueCities.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm text-gray-500">Popular cities:</span>
            {uniqueCities.map((city) => (
              <button
                key={city}
                onClick={() => {
                  setQuery(city);
                  navigate(`/projects?city=${encodeURIComponent(city)}`);
                }}
                className="px-3 py-1 rounded-full text-sm bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
              >
                {city}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
