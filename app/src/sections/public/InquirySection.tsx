import { useState } from 'react';
import { Send, User, Mail, Phone, MessageSquare, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { useData } from '../../contexts/DataContext';
import { toast } from 'sonner';

export default function InquirySection() {
  const { createInquiry } = useData();
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

    // Validation
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
        toast.success('Inquiry submitted successfully! We will contact you soon.');
      } else {
        toast.error('Failed to submit inquiry. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section className="py-16 sm:py-24 bg-[#0a0a0a]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-[#1a1a1a] rounded-3xl p-8 sm:p-12 border border-white/10">
            <div className="w-20 h-20 rounded-full bg-[#c4ff00]/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-[#c4ff00]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Thank You!
            </h2>
            <p className="text-gray-400 mb-6">
              Your inquiry has been submitted successfully. Our team will review your 
              request and get back to you within 24-48 hours.
            </p>
            <Button
              onClick={() => {
                setIsSubmitted(false);
                setFormData({ name: '', email: '', phone: '', message: '' });
              }}
              className="bg-[#c4ff00] text-black hover:bg-[#d4ff33] rounded-full px-8"
            >
              Submit Another Inquiry
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-24 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Info */}
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to Go Solar?
            </h2>
            <p className="text-gray-400 mb-8">
              Get a free consultation and quote for your solar installation. 
              Our experts will help you find the perfect solution for your energy needs.
            </p>

            <div className="space-y-6">
              {[
                {
                  icon: CheckCircle,
                  title: 'Free Site Assessment',
                  description: 'We evaluate your location for optimal solar potential',
                },
                {
                  icon: CheckCircle,
                  title: 'Customized Solutions',
                  description: 'Tailored solar systems designed for your specific needs',
                },
                {
                  icon: CheckCircle,
                  title: 'End-to-End Support',
                  description: 'From installation to maintenance, we handle everything',
                },
                {
                  icon: CheckCircle,
                  title: 'Government Subsidies',
                  description: 'We help you avail all applicable subsidies and incentives',
                },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#c4ff00]/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-[#c4ff00]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{item.title}</h3>
                      <p className="text-sm text-gray-400">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="bg-[#1a1a1a] rounded-3xl p-6 sm:p-8 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-6">Send Us a Message</h3>
            
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
                  rows={4}
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
                    Send Inquiry
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                By submitting, you agree to our privacy policy. We respect your privacy.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
