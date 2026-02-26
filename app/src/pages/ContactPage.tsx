import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, Loader2, MessageSquare, User } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { useData } from '../contexts/DataContext';
import Header from '../sections/public/Header';
import Footer from '../sections/public/Footer';
import { toast } from 'sonner';

export default function ContactPage() {
  const { settings, createInquiry } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }
    if (!formData.message.trim()) {
      toast.error('Please enter your message');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createInquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        project_id: null,
      });

      if (result) {
        setIsSubmitted(true);
        toast.success('Message sent successfully! We will contact you soon.');
      } else {
        toast.error('Failed to send message. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      content: settings?.contact_phone || '+91 1800 123 4567',
      href: `tel:${settings?.contact_phone || '+9118001234567'}`,
    },
    {
      icon: Mail,
      title: 'Email',
      content: settings?.contact_email || 'info@solarsystems.in',
      href: `mailto:${settings?.contact_email || 'info@solarsystems.in'}`,
    },
    {
      icon: MapPin,
      title: 'Address',
      content:
        settings?.org_address ||
        'Solar Tower, 101 Green Energy Road, Mumbai, Maharashtra 400001',
      href: '#',
    },
    {
      icon: Clock,
      title: 'Working Hours',
      content: 'Mon - Sat: 9:00 AM - 6:00 PM',
      href: '#',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Header />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Get in Touch
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Have questions about solar energy? We&apos;re here to help. 
              Reach out to us and our team will get back to you within 24 hours.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              {contactInfo.map((item, index) => {
                const Icon = item.icon;
                return (
                  <a
                    key={index}
                    href={item.href}
                    className="flex items-start gap-4 p-5 rounded-2xl bg-[#1a1a1a] border border-white/10 hover:border-[#c4ff00]/50 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#c4ff00]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#c4ff00]/30 transition-colors">
                      <Icon className="w-5 h-5 text-[#c4ff00]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white mb-1">{item.title}</h3>
                      <p className="text-gray-400 text-sm">{item.content}</p>
                    </div>
                  </a>
                );
              })}

              {/* Map Preview */}
              <div className="rounded-2xl overflow-hidden border border-white/10 h-48 bg-[#1a1a1a]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.1160992995!2d72.7410995431222!3d19.082197839405396!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1704067200000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'grayscale(100%) invert(92%)' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Office Location"
                />
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              {isSubmitted ? (
                <div className="bg-[#1a1a1a] rounded-3xl p-8 sm:p-12 border border-white/10 text-center">
                  <div className="w-20 h-20 rounded-full bg-[#c4ff00]/20 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-[#c4ff00]" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                    Thank You!
                  </h2>
                  <p className="text-gray-400 mb-6 max-w-md mx-auto">
                    Your message has been sent successfully. Our team will review your 
                    request and get back to you within 24-48 hours.
                  </p>
                  <Button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: '', email: '', phone: '', message: '' });
                    }}
                    className="bg-[#c4ff00] text-black hover:bg-[#d4ff33] rounded-full px-8"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <div className="bg-[#1a1a1a] rounded-3xl p-6 sm:p-8 border border-white/10">
                  <h2 className="text-xl font-bold text-white mb-6">Send Us a Message</h2>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-300 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#c4ff00] focus:ring-[#c4ff00]/20"
                      />
                    </div>

                    {/* Email & Phone */}
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-300 flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={handleChange}
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#c4ff00] focus:ring-[#c4ff00]/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-gray-300 flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Phone
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={handleChange}
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#c4ff00] focus:ring-[#c4ff00]/20"
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-gray-300 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Message
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tell us about your requirements..."
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#c4ff00] focus:ring-[#c4ff00]/20 resize-none"
                      />
                    </div>

                    {/* Submit */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#c4ff00] text-black hover:bg-[#d4ff33] rounded-xl py-6 font-semibold text-base"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      By submitting, you agree to our privacy policy. We respect your privacy.
                    </p>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[
                {
                  q: 'How much does a solar installation cost?',
                  a: 'The cost depends on your energy needs and roof size. Use our calculator to get an estimate, or contact us for a free site assessment.',
                },
                {
                  q: 'How long does installation take?',
                  a: 'Most residential installations are completed within 2-4 weeks. Commercial projects may take 4-8 weeks depending on size.',
                },
                {
                  q: 'What government subsidies are available?',
                  a: 'The Indian government offers subsidies up to 30% for residential solar installations. We help you avail all applicable benefits.',
                },
                {
                  q: 'How long do solar panels last?',
                  a: 'Solar panels typically last 25-30 years with minimal maintenance. We offer warranties and annual maintenance contracts.',
                },
              ].map((faq, index) => (
                <div
                  key={index}
                  className="p-6 rounded-2xl bg-[#1a1a1a] border border-white/10"
                >
                  <h3 className="font-medium text-white mb-2">{faq.q}</h3>
                  <p className="text-gray-400 text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
