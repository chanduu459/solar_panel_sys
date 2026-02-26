import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FolderOpen, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  MapPin, 
  Zap,
  Upload,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { toast } from 'sonner';
import type { Project, ProjectInsert, ProjectUpdate } from '../../types';

// Project Form Modal
function ProjectModal({
  project,
  isOpen,
  onClose,
  onSave,
}: {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProjectInsert | ProjectUpdate) => void;
}) {
  const [formData, setFormData] = useState<Partial<Project> & { installation_date?: string }>({
    title: '',
    description: '',
    capacity_kw: 0,
    address: '',
    city: '',
    state: '',
    latitude: 0,
    longitude: 0,
    images: [],
    installation_date: '',
    status: 'active',
    tags: [],
  });
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (project) {
      setFormData({
        ...project,
        installation_date: project.installation_date
          ? new Date(project.installation_date).toISOString().split('T')[0]
          : '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        capacity_kw: 0,
        address: '',
        city: '',
        state: '',
        latitude: 0,
        longitude: 0,
        images: [],
        installation_date: '',
        status: 'active',
        tags: [],
      });
    }
  }, [project, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as ProjectInsert);
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), newImageUrl.trim()],
      }));
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || [],
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((t) => t !== tag) || [],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#1a1a1a] rounded-3xl border border-white/10">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-white/10 bg-[#1a1a1a]">
          <h2 className="text-xl font-bold text-white">
            {project ? 'Edit Project' : 'Add New Project'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label className="text-gray-300">Project Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Enter project title"
              className="bg-white/5 border-white/10 text-white"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-gray-300">Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Enter project description"
              rows={4}
              className="bg-white/5 border-white/10 text-white resize-none"
              required
            />
          </div>

          {/* Capacity & Status */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Capacity (kW)</Label>
              <Input
                type="number"
                value={formData.capacity_kw}
                onChange={(e) => setFormData((prev) => ({ ...prev, capacity_kw: parseFloat(e.target.value) }))}
                placeholder="e.g., 500"
                className="bg-white/5 border-white/10 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Status</Label>
              <select
                value={formData.status}
                onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as 'active' | 'completed' | 'pending' }))}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-[#c4ff00] focus:outline-none"
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Address</Label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                placeholder="Street address"
                className="bg-white/5 border-white/10 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">City</Label>
              <Input
                value={formData.city}
                onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                placeholder="City"
                className="bg-white/5 border-white/10 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">State</Label>
              <Input
                value={formData.state}
                onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
                placeholder="State"
                className="bg-white/5 border-white/10 text-white"
                required
              />
            </div>
          </div>

          {/* Coordinates */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Latitude</Label>
              <Input
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData((prev) => ({ ...prev, latitude: parseFloat(e.target.value) }))}
                placeholder="e.g., 19.0760"
                className="bg-white/5 border-white/10 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Longitude</Label>
              <Input
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData((prev) => ({ ...prev, longitude: parseFloat(e.target.value) }))}
                placeholder="e.g., 72.8777"
                className="bg-white/5 border-white/10 text-white"
                required
              />
            </div>
          </div>

          {/* Installation Date */}
          <div className="space-y-2">
            <Label className="text-gray-300">Installation Date</Label>
            <Input
              type="date"
              value={formData.installation_date}
              onChange={(e) => setFormData((prev) => ({ ...prev, installation_date: e.target.value }))}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>

          {/* Images */}
          <div className="space-y-2">
            <Label className="text-gray-300">Images</Label>
            <div className="flex gap-2">
              <Input
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Enter image URL"
                className="bg-white/5 border-white/10 text-white"
              />
              <Button type="button" onClick={addImage} variant="outline" className="border-white/30">
                <Upload className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.images?.map((img, index) => (
                <div key={index} className="relative group">
                  <img src={img} alt="" className="w-20 h-20 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className="text-gray-300">Tags</Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                className="bg-white/5 border-white/10 text-white"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} variant="outline" className="border-white/30">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags?.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-[#c4ff00]/20 text-[#c4ff00] text-sm flex items-center gap-2"
                >
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1 bg-[#c4ff00] text-black hover:bg-[#d4ff33]">
              {project ? 'Update Project' : 'Create Project'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="border-white/30">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminProjectsPage() {
  const { signOut } = useAuth();
  const { projects, fetchProjects, createProject, updateProject, deleteProject } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = async (data: ProjectInsert | ProjectUpdate) => {
    if (editingProject) {
      const result = await updateProject(editingProject.id, data as ProjectUpdate);
      if (result) {
        toast.success('Project updated successfully');
        setIsModalOpen(false);
        setEditingProject(null);
      } else {
        toast.error('Failed to update project');
      }
    } else {
      const result = await createProject(data as ProjectInsert);
      if (result) {
        toast.success('Project created successfully');
        setIsModalOpen(false);
      } else {
        toast.error('Failed to create project');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    setIsDeleting(id);
    const success = await deleteProject(id);
    if (success) {
      toast.success('Project deleted successfully');
    } else {
      toast.error('Failed to delete project');
    }
    setIsDeleting(null);
  };

  const sidebarLinks = [
    { href: '/admin', label: 'Dashboard', icon: FolderOpen },
    { href: '/admin/projects', label: 'Projects', icon: FolderOpen },
    { href: '/admin/reviews', label: 'Reviews', icon: FolderOpen },
    { href: '/admin/inquiries', label: 'Inquiries', icon: FolderOpen },
    { href: '/admin/settings', label: 'Settings', icon: FolderOpen },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-[#1a1a1a] border-r border-white/10 fixed left-0 top-0 z-50 hidden lg:block">
          <div className="p-6 border-b border-white/10">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c4ff00] to-[#8bc34a] flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-black" />
              </div>
              <div>
                <span className="font-bold text-white">Solar Systems</span>
                <span className="block text-xs text-gray-500">Admin Panel</span>
              </div>
            </Link>
          </div>
          <nav className="p-4 space-y-1">
            {sidebarLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  link.href === '/admin/projects'
                    ? 'bg-[#c4ff00] text-black'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
            <button
              onClick={signOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
            >
              <FolderOpen className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64">
          <header className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10 px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-white">Projects</h1>
              <Button
                onClick={() => {
                  setEditingProject(null);
                  setIsModalOpen(true);
                }}
                className="bg-[#c4ff00] text-black hover:bg-[#d4ff33]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </div>
          </header>

          <div className="p-6">
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-white/5 border-white/10 text-white"
              />
            </div>

            {/* Projects Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-white/10 group"
                >
                  {/* Image */}
                  <div className="relative h-48">
                    <img
                      src={project.images[0] || '/placeholder-project.jpg'}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent" />
                    <div className="absolute top-3 right-3">
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

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-white mb-2 line-clamp-1">{project.title}</h3>
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

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingProject(project);
                          setIsModalOpen(true);
                        }}
                        className="flex-1 border-white/30"
                      >
                        <Edit2 className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(project.id)}
                        disabled={isDeleting === project.id}
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                      >
                        {isDeleting === project.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProjects.length === 0 && (
              <div className="text-center py-16">
                <ImageIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No projects found</h3>
                <p className="text-gray-400 mb-4">Create your first project to get started</p>
                <Button
                  onClick={() => {
                    setEditingProject(null);
                    setIsModalOpen(true);
                  }}
                  className="bg-[#c4ff00] text-black hover:bg-[#d4ff33]"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Project
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal */}
      <ProjectModal
        project={editingProject}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProject(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
}
