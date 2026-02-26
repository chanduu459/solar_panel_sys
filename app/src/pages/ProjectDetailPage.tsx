import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Zap, Calendar, ArrowLeft, ArrowRight, CheckCircle, Mail, Phone } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useData } from '../contexts/DataContext';
import Header from '../sections/public/Header';
import Footer from '../sections/public/Footer';
import type { Project } from '../types';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getProjectById, projects } = useData();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const loadProject = async () => {
      if (!id) return;
      setIsLoading(true);
      const data = await getProjectById(id);
      if (data) {
        setProject(data);
      }
      setIsLoading(false);
    };

    loadProject();
  }, [id, getProjectById]);

  // Get related projects
  const relatedProjects = projects
    .filter((p) => p.id !== id && p.city === project?.city)
    .slice(0, 3);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <Header />
        <main className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-8 w-32 bg-white/10 rounded mb-8" />
              <div className="h-96 bg-white/10 rounded-2xl mb-8" />
              <div className="h-8 w-2/3 bg-white/10 rounded mb-4" />
              <div className="h-4 w-full bg-white/10 rounded mb-2" />
              <div className="h-4 w-3/4 bg-white/10 rounded" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <Header />
        <main className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-10 h-10 text-gray-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Project Not Found</h1>
            <p className="text-gray-400 mb-8">The project you are looking for does not exist.</p>
            <Link to="/projects">
              <Button className="bg-[#c4ff00] text-black hover:bg-[#d4ff33]">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Projects
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === project.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? project.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Header />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-[#c4ff00] transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>

          {/* Image Gallery */}
          <div className="relative rounded-2xl overflow-hidden mb-8 bg-[#1a1a1a]">
            <div className="aspect-video relative">
              <img
                src={project.images[currentImageIndex] || '/placeholder-project.jpg'}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              
              {/* Image Navigation */}
              {project.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                    aria-label="Previous image"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                    aria-label="Next image"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  
                  {/* Image Indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {project.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImageIndex ? 'bg-[#c4ff00]' : 'bg-white/50'
                        }`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Project Info */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Title & Tags */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-sm rounded-full bg-[#c4ff00]/20 text-[#c4ff00] border border-[#c4ff00]/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  {project.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {project.address}, {project.city}, {project.state}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/10 mb-6">
                <h2 className="text-xl font-bold text-white mb-4">About This Project</h2>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {project.description}
                </p>
              </div>

              {/* Key Highlights */}
              <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/10">
                <h2 className="text-xl font-bold text-white mb-4">Key Highlights</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    'High-efficiency solar panels',
                    'Smart monitoring system',
                    '25-year performance warranty',
                    'Professional maintenance support',
                    'Significant cost savings',
                    'Reduced carbon footprint',
                  ].map((highlight, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-[#c4ff00] flex-shrink-0" />
                      <span className="text-gray-300">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4">Project Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Capacity
                    </span>
                    <span className="text-white font-medium">{project.capacity_kw} kW</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Installed
                    </span>
                    <span className="text-white font-medium">
                      {project.installation_date
                        ? new Date(project.installation_date).toLocaleDateString('en-IN', {
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Status</span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        project.status === 'active'
                          ? 'bg-green-500/20 text-green-400'
                          : project.status === 'completed'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-[#c4ff00]/20 to-[#8bc34a]/20 rounded-2xl p-6 border border-[#c4ff00]/30">
                <h3 className="text-lg font-bold text-white mb-2">
                  Interested in a Similar Setup?
                </h3>
                <p className="text-gray-300 text-sm mb-4">
                  Get a free consultation and quote for your solar installation.
                </p>
                <Link to={`/contact?project=${project.id}`}>
                  <Button className="w-full bg-[#c4ff00] text-black hover:bg-[#d4ff33]">
                    <Mail className="w-4 h-4 mr-2" />
                    Get Quote
                  </Button>
                </Link>
              </div>

              {/* Contact */}
              <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4">Contact Us</h3>
                <div className="space-y-3">
                  <a
                    href="tel:+9118001234567"
                    className="flex items-center gap-3 text-gray-400 hover:text-[#c4ff00] transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    +91 1800 123 4567
                  </a>
                  <a
                    href="mailto:info@solarsystems.in"
                    className="flex items-center gap-3 text-gray-400 hover:text-[#c4ff00] transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    info@solarsystems.in
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Related Projects */}
          {relatedProjects.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-white mb-6">Related Projects</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProjects.map((relatedProject) => (
                  <Link
                    key={relatedProject.id}
                    to={`/projects/${relatedProject.id}`}
                    className="group block rounded-2xl overflow-hidden bg-[#1a1a1a] border border-white/10 hover:border-[#c4ff00]/50 transition-all"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={relatedProject.images[0] || '/placeholder-project.jpg'}
                        alt={relatedProject.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent" />
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#c4ff00] transition-colors">
                        {relatedProject.title}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {relatedProject.city}
                        </span>
                        <span className="flex items-center gap-1">
                          <Zap className="w-4 h-4" />
                          {relatedProject.capacity_kw} kW
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
