import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, Loader2, MessageSquare, User,  } from 'lucide-react';
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
        toast.success('Message sent successfully!');
      } else {
        toast.error('Failed to send message.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
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
      title: 'Headquarters',
      content: settings?.org_address || 'Solar Tower, Green Energy Road, Mumbai, MH',
      href: '#',
    },
    {
      icon: Clock,
      title: 'Working Hours',
      content: 'Mon - Sat: 9:00 AM - 6:00 PM',
      href: '#',
    },
  ];

  const inputClasses = "bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-orange-400 focus:ring-orange-400/20 shadow-sm rounded-xl py-6 font-medium";

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-white text-slate-800 selection:bg-amber-200">
      <Header />

      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">Touch</span>
            </h1>
            <p className="text-lg text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
              Have questions about solar energy? We're here to help. Reach out to us and our team will get back to you within 24 hours.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Contact Info Column */}
            <div className="lg:col-span-1 space-y-4">
              {contactInfo.map((item, index) => {
                const Icon = item.icon;
                return (
                  <a
                    key={index}
                    href={item.href}
                    className="flex items-center gap-5 p-6 rounded-[2rem] bg-white border border-amber-100 shadow-sm hover:shadow-xl hover:shadow-orange-500/5 hover:border-orange-200 transition-all group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500 transition-all duration-300">
                      <Icon className="w-6 h-6 text-orange-600 group-hover:text-white" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-800 text-base">{item.title}</h3>
                      <p className="text-slate-500 font-medium text-sm">{item.content}</p>
                    </div>
                  </a>
                );
              })}

             {/* Map Preview */}
<div className="rounded-[2rem] overflow-hidden border border-amber-100 h-64 bg-slate-100 shadow-sm">
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d124043.6826647915!2d79.91617488358482!3d14.4425987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a4cf12a06958771%3A0xd3036c2025161f55!2sNellore%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
    width="100%"
    height="100%"
    style={{ border: 0 }}
    allowFullScreen
    loading="lazy"
    title="Office Location in Nellore"
    referrerPolicy="no-referrer-when-downgrade"
  />
</div>
            </div>

            {/* Contact Form Column */}
            <div className="lg:col-span-2">
              {isSubmitted ? (
                <div className="bg-white rounded-[2.5rem] p-12 border border-amber-100 shadow-xl text-center h-full flex flex-col items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
                    <CheckCircle className="w-12 h-12 text-emerald-500" />
                  </div>
                  <h2 className="text-3xl font-extrabold text-slate-800 mb-4">Message Sent!</h2>
                  <p className="text-slate-500 font-medium mb-8 max-w-md mx-auto text-lg leading-relaxed">
                    Thank you for reaching out. Our solar experts will review your request and contact you within 24-48 hours.
                  </p>
                  <Button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: '', email: '', phone: '', message: '' });
                    }}
                    className="bg-slate-900 text-white hover:bg-slate-800 rounded-full px-10 py-6 font-bold transition-transform hover:-translate-y-1"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 border border-amber-100 shadow-xl shadow-orange-900/5">
                  <h2 className="text-2xl font-extrabold text-slate-800 mb-8">Send Us a Message</h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-slate-700 font-bold ml-1 flex items-center gap-2">
                        <User className="w-4 h-4 text-orange-500" /> Full Name
                      </Label>
                      <div className="relative">
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={handleChange}
                          className={inputClasses.replace("pl-12", "pl-6")}
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-slate-700 font-bold ml-1 flex items-center gap-2">
                          <Mail className="w-4 h-4 text-orange-500" /> Email
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          className={inputClasses.replace("pl-12", "pl-6")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-slate-700 font-bold ml-1 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-orange-500" /> Phone
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={handleChange}
                          className={inputClasses.replace("pl-12", "pl-6")}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-slate-700 font-bold ml-1 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-orange-500" /> Message
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="I'm interested in solar for my home..."
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        className="bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-orange-400 focus:ring-orange-400/20 shadow-sm rounded-2xl p-6 font-medium resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 py-8 text-lg font-extrabold rounded-2xl shadow-lg shadow-orange-500/20 border-0 transition-transform hover:-translate-y-0.5 mt-4"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-6 h-6 mr-2 animate-spin" /> Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" /> Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-24">
            <h2 className="text-3xl font-extrabold text-slate-900 text-center mb-12 tracking-tight">
              Frequently Asked <span className="text-orange-500">Questions</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {[
                {
                  q: 'How much does a solar installation cost?',
                  a: 'Costs depend on your energy needs and roof size. Use our savings calculator to get an instant estimate.',
                },
                {
                  q: 'How long does installation take?',
                  a: 'Residential projects usually take 2-4 weeks, while commercial systems may take 4-8 weeks depending on capacity.',
                },
                {
                  q: 'What government subsidies are available?',
                  a: 'The Indian government offers significant subsidies for residential installations. We handle all paperwork for you.',
                },
                {
                  q: 'How long do solar panels last?',
                  a: 'Quality solar panels are designed to last 25-30 years with very minimal maintenance required.',
                },
              ].map((faq, index) => (
                <div
                  key={index}
                  className="p-8 rounded-[2rem] bg-white border border-amber-100 shadow-sm hover:border-orange-200 transition-colors group"
                >
                  <h3 className="font-extrabold text-slate-800 mb-3 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                    {faq.q}
                  </h3>
                  <p className="text-slate-500 font-medium leading-relaxed pl-5">{faq.a}</p>
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