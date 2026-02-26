import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MapPin, Zap, ArrowRight, Filter, X, Search, Grid3X3, List } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useData } from '../contexts/DataContext';
import Header from '../sections/public/Header';
import Footer from '../sections/public/Footer';
import type { Project } from '../types';

// Project Card Component
function ProjectCard({ project, viewMode }: { project: Project; viewMode: 'grid' | 'list' }) {
  if (viewMode === 'list') {
    return (
      <Link
        to={`/projects/${project.id}`}
        className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 rounded-2xl bg-[#1a1a1a] border border-white/10 hover:border-[#c4ff00]/50 transition-all group"
      >
        {/* Image */}
        <div className="w-full sm:w-48 h-48 sm:h-32 rounded-xl overflow-hidden flex-shrink-0">
          <img
            src={project.images[0] || '/placeholder-project.jpg'}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-2 mb-2">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs rounded-full bg-[#c4ff00]/20 text-[#c4ff00] border border-[#c4ff00]/30"
              >
                {tag}
              </span>
            ))}
          </div>
          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#c4ff00] transition-colors">
            {project.title}
          </h3>
          <p className="text-gray-400 text-sm line-clamp-2 mb-2">{project.description}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {project.city}, {project.state}
            </span>
            <span className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              {project.capacity_kw} kW
            </span>
          </div>
        </div>

        {/* Arrow */}
        <div className="hidden sm:flex items-center">
          <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-[#c4ff00] group-hover:translate-x-1 transition-all" />
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/projects/${project.id}`}
      className="group block rounded-2xl overflow-hidden bg-[#1a1a1a] border border-white/10 hover:border-[#c4ff00]/50 transition-all"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={project.images[0] || '/placeholder-project.jpg'}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent" />
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
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

      {/* Content */}
      <div className="p-5">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {project.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs rounded-full bg-[#c4ff00]/20 text-[#c4ff00] border border-[#c4ff00]/30"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#c4ff00] transition-colors line-clamp-2">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-gray-400 text-sm line-clamp-2 mb-4">{project.description}</p>

        {/* Meta */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {project.city}
          </span>
          <span className="flex items-center gap-1">
            <Zap className="w-4 h-4" />
            {project.capacity_kw} kW
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function ProjectsPage() {
  const { projects, fetchProjects } = useData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [minCapacity, setMinCapacity] = useState<string>('');
  const [maxCapacity, setMaxCapacity] = useState<string>('');

  // Get unique cities
  const cities = [...new Set(projects.map((p) => p.city))].sort();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Apply filters from URL on mount
  useEffect(() => {
    const search = searchParams.get('search');
    const city = searchParams.get('city');
    if (search) setSearchQuery(search);
    if (city) setSelectedCity(city);
  }, [searchParams]);

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      !searchQuery ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.capacity_kw.toString().includes(searchQuery);

    const matchesCity = !selectedCity || project.city === selectedCity;
    const matchesStatus = !selectedStatus || project.status === selectedStatus;
    const matchesMinCapacity = !minCapacity || project.capacity_kw >= parseFloat(minCapacity);
    const matchesMaxCapacity = !maxCapacity || project.capacity_kw <= parseFloat(maxCapacity);

    return matchesSearch && matchesCity && matchesStatus && matchesMinCapacity && matchesMaxCapacity;
  });

  const applyFilters = useCallback(() => {
    const params: Record<string, string> = {};
    if (searchQuery) params.search = searchQuery;
    if (selectedCity) params.city = selectedCity;
    if (selectedStatus) params.status = selectedStatus;
    if (minCapacity) params.minCapacity = minCapacity;
    if (maxCapacity) params.maxCapacity = maxCapacity;
    setSearchParams(params);
  }, [searchQuery, selectedCity, selectedStatus, minCapacity, maxCapacity, setSearchParams]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCity('');
    setSelectedStatus('');
    setMinCapacity('');
    setMaxCapacity('');
    setSearchParams({});
  };

  const hasActiveFilters = searchQuery || selectedCity || selectedStatus || minCapacity || maxCapacity;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Header />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Our Projects</h1>
            <p className="text-gray-400">
              Explore our portfolio of solar installations across India
            </p>
          </div>

          {/* Search & Filters Bar */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                />
              </div>

              {/* Filter Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={`border-white/30 ${showFilters ? 'bg-white/10' : ''}`}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <span className="ml-2 w-5 h-5 rounded-full bg-[#c4ff00] text-black text-xs flex items-center justify-center">
                    {[selectedCity, selectedStatus, minCapacity, maxCapacity].filter(Boolean).length +
                      (searchQuery ? 1 : 0)}
                  </span>
                )}
              </Button>

              {/* View Mode Toggle */}
              <div className="flex rounded-lg border border-white/10 overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-[#c4ff00] text-black' : 'text-gray-400 hover:text-white'}`}
                  aria-label="Grid view"
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-[#c4ff00] text-black' : 'text-gray-400 hover:text-white'}`}
                  aria-label="List view"
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="p-4 rounded-xl bg-[#1a1a1a] border border-white/10 space-y-4">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* City Filter */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">City</label>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-[#c4ff00] focus:outline-none"
                    >
                      <option value="">All Cities</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Status</label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-[#c4ff00] focus:outline-none"
                    >
                      <option value="">All Statuses</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>

                  {/* Min Capacity */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Min Capacity (kW)</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={minCapacity}
                      onChange={(e) => setMinCapacity(e.target.value)}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>

                  {/* Max Capacity */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Max Capacity (kW)</label>
                    <Input
                      type="number"
                      placeholder="Any"
                      value={maxCapacity}
                      onChange={(e) => setMaxCapacity(e.target.value)}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>

                {/* Filter Actions */}
                <div className="flex gap-3">
                  <Button onClick={applyFilters} className="bg-[#c4ff00] text-black hover:bg-[#d4ff33]">
                    Apply Filters
                  </Button>
                  {hasActiveFilters && (
                    <Button variant="outline" onClick={clearFilters} className="border-white/30">
                      <X className="w-4 h-4 mr-2" />
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-gray-400">
              Showing <span className="text-white font-medium">{filteredProjects.length}</span> projects
            </p>
          </div>

          {/* Projects Grid/List */}
          {filteredProjects.length > 0 ? (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }
            >
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} viewMode={viewMode} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No projects found</h3>
              <p className="text-gray-400 mb-4">Try adjusting your search or filters</p>
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters} className="border-white/30">
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
