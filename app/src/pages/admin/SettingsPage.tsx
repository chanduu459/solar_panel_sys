import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Settings, 
  Save, 
  Building2, 
  MapPin,
  Calculator,
  Sun,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const { signOut } = useAuth();
  const { settings, fetchSettings, updateSettings } = useData();
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [formData, setFormData] = useState({
    org_name: '',
    contact_email: '',
    contact_phone: '',
    org_address: '',
    kwh_per_kw_per_month: 130,
    tariff_per_kwh: 8.5,
    system_cost_per_kw: 45000,
    subsidy_percentage: 30,
    maintenance_cost_per_kw_year: 500,
    carousel_speed: 30,
    map_center_lat: 21.0,
    map_center_lng: 78.0,
    map_zoom: 5,
  });

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    if (settings) {
      setFormData({
        org_name: settings.org_name,
        contact_email: settings.contact_email,
        contact_phone: settings.contact_phone,
        org_address: settings.org_address,
        kwh_per_kw_per_month: settings.kwh_per_kw_per_month,
        tariff_per_kwh: settings.tariff_per_kwh,
        system_cost_per_kw: settings.system_cost_per_kw,
        subsidy_percentage: settings.subsidy_percentage,
        maintenance_cost_per_kw_year: settings.maintenance_cost_per_kw_year,
        carousel_speed: settings.carousel_speed,
        map_center_lat: settings.map_center_lat,
        map_center_lng: settings.map_center_lng,
        map_zoom: settings.map_zoom,
      });
    }
  }, [settings]);

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const result = await updateSettings({
      org_name: formData.org_name,
      contact_email: formData.contact_email,
      contact_phone: formData.contact_phone,
      org_address: formData.org_address,
      kwh_per_kw_per_month: formData.kwh_per_kw_per_month,
      tariff_per_kwh: formData.tariff_per_kwh,
      system_cost_per_kw: formData.system_cost_per_kw,
      subsidy_percentage: formData.subsidy_percentage,
      maintenance_cost_per_kw_year: formData.maintenance_cost_per_kw_year,
      carousel_speed: formData.carousel_speed,
      map_center_lat: formData.map_center_lat,
      map_center_lng: formData.map_center_lng,
      map_zoom: formData.map_zoom,
    });

    if (result) {
      toast.success('Settings saved successfully');
      setIsSaved(true);
    } else {
      toast.error('Failed to save settings');
    }
    setIsSaving(false);
  };

  const sidebarLinks = [
    { href: '/admin', label: 'Dashboard', icon: Settings },
    { href: '/admin/projects', label: 'Projects', icon: Settings },
    { href: '/admin/reviews', label: 'Reviews', icon: Settings },
    { href: '/admin/inquiries', label: 'Inquiries', icon: Settings },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-[#1a1a1a] border-r border-white/10 fixed left-0 top-0 z-50 hidden lg:block">
          <div className="p-6 border-b border-white/10">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c4ff00] to-[#8bc34a] flex items-center justify-center">
                <Settings className="w-5 h-5 text-black" />
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
                  link.href === '/admin/settings'
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
              <Settings className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64">
          <header className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10 px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-white">Settings</h1>
              <Button
                onClick={handleSave}
                disabled={isSaving || isSaved}
                className={`${
                  isSaved
                    ? 'bg-green-500 text-white'
                    : 'bg-[#c4ff00] text-black hover:bg-[#d4ff33]'
                }`}
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : isSaved ? (
                  <CheckCircle className="w-4 h-4 mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isSaved ? 'Saved' : 'Save Changes'}
              </Button>
            </div>
          </header>

          <div className="p-6 max-w-4xl">
            {/* Organization Settings */}
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#c4ff00]/20 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-[#c4ff00]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Organization</h2>
                  <p className="text-sm text-gray-400">Company information and contact details</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 p-6 rounded-2xl bg-[#1a1a1a] border border-white/10">
                <div className="space-y-2">
                  <Label className="text-gray-300">Organization Name</Label>
                  <Input
                    value={formData.org_name}
                    onChange={(e) => handleChange('org_name', e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Contact Email</Label>
                  <Input
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => handleChange('contact_email', e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Contact Phone</Label>
                  <Input
                    value={formData.contact_phone}
                    onChange={(e) => handleChange('contact_phone', e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <Label className="text-gray-300">Address</Label>
                  <Input
                    value={formData.org_address}
                    onChange={(e) => handleChange('org_address', e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
            </section>

            {/* Calculator Settings */}
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#c4ff00]/20 flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-[#c4ff00]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Calculator Settings</h2>
                  <p className="text-sm text-gray-400">Parameters used for savings calculations</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 p-6 rounded-2xl bg-[#1a1a1a] border border-white/10">
                <div className="space-y-2">
                  <Label className="text-gray-300">kWh per kW per Month</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.kwh_per_kw_per_month}
                    onChange={(e) => handleChange('kwh_per_kw_per_month', parseFloat(e.target.value))}
                    className="bg-white/5 border-white/10 text-white"
                  />
                  <p className="text-xs text-gray-500">Average solar generation per kW capacity</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Tariff per kWh (₹)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.tariff_per_kwh}
                    onChange={(e) => handleChange('tariff_per_kwh', parseFloat(e.target.value))}
                    className="bg-white/5 border-white/10 text-white"
                  />
                  <p className="text-xs text-gray-500">Average electricity rate</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">System Cost per kW (₹)</Label>
                  <Input
                    type="number"
                    value={formData.system_cost_per_kw}
                    onChange={(e) => handleChange('system_cost_per_kw', parseFloat(e.target.value))}
                    className="bg-white/5 border-white/10 text-white"
                  />
                  <p className="text-xs text-gray-500">Average installation cost</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Subsidy Percentage (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.subsidy_percentage}
                    onChange={(e) => handleChange('subsidy_percentage', parseFloat(e.target.value))}
                    className="bg-white/5 border-white/10 text-white"
                  />
                  <p className="text-xs text-gray-500">Government subsidy rate</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Maintenance Cost per kW/Year (₹)</Label>
                  <Input
                    type="number"
                    value={formData.maintenance_cost_per_kw_year}
                    onChange={(e) => handleChange('maintenance_cost_per_kw_year', parseFloat(e.target.value))}
                    className="bg-white/5 border-white/10 text-white"
                  />
                  <p className="text-xs text-gray-500">Annual maintenance estimate</p>
                </div>
              </div>
            </section>

            {/* Carousel Settings */}
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#c4ff00]/20 flex items-center justify-center">
                  <Sun className="w-5 h-5 text-[#c4ff00]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Carousel Settings</h2>
                  <p className="text-sm text-gray-400">Homepage project carousel configuration</p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#1a1a1a] border border-white/10">
                <div className="space-y-2 max-w-xs">
                  <Label className="text-gray-300">Scroll Speed (seconds)</Label>
                  <Input
                    type="number"
                    value={formData.carousel_speed}
                    onChange={(e) => handleChange('carousel_speed', parseInt(e.target.value))}
                    className="bg-white/5 border-white/10 text-white"
                  />
                  <p className="text-xs text-gray-500">Time for one complete cycle</p>
                </div>
              </div>
            </section>

            {/* Map Settings */}
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#c4ff00]/20 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[#c4ff00]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Map Settings</h2>
                  <p className="text-sm text-gray-400">Default map center and zoom level</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-6 p-6 rounded-2xl bg-[#1a1a1a] border border-white/10">
                <div className="space-y-2">
                  <Label className="text-gray-300">Center Latitude</Label>
                  <Input
                    type="number"
                    step="any"
                    value={formData.map_center_lat}
                    onChange={(e) => handleChange('map_center_lat', parseFloat(e.target.value))}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Center Longitude</Label>
                  <Input
                    type="number"
                    step="any"
                    value={formData.map_center_lng}
                    onChange={(e) => handleChange('map_center_lng', parseFloat(e.target.value))}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Zoom Level</Label>
                  <Input
                    type="number"
                    min="1"
                    max="20"
                    value={formData.map_zoom}
                    onChange={(e) => handleChange('map_zoom', parseInt(e.target.value))}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
