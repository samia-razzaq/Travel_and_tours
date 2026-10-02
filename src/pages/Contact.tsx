import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useContactInquiry } from "@/hooks/useContactForm";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const { mutate: sendInquiry, isPending } = useContactInquiry();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    sendInquiry(formData, {
      onSuccess: (data) => {
        if (data.success) {
          toast.success(data.success);
        }
        setFormData({ name: "", email: "", subject: "", message: "" });
      },
      onError: (error: any) => {
        const errorData = error?.response?.data;
        if (errorData?.message) {
          toast.error(errorData.message);
        } else if (errorData?.error) {
          toast.error(errorData.error);
        } else {
          toast.error("Something went wrong. Please try again.");
        }
      },
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "neurooceantours@gmail.com",
      href: "mailto:neurooceantours@gmail.com",
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+971 50 727 8147",
      href: "tel:+971507278147",
    },
    {
      icon: MapPin,
      title: "Address",
      value: "ALRAJHI-BLDG, Hor Al Anz, Dubai, UAE",
      href: "https://maps.google.com/?q=Hor+Al+Anz+Dubai",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in text-white">
            Get in <span className="text-white">Touch</span>
          </h1>
          <p className="text-lg text-gray-100 max-w-2xl mx-auto animate-fade-in">
            Have questions about our tours? We're here to help you plan your
            perfect Dubai adventure.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto mb-12">
            {/* Contact Information */}
            <div className="space-y-8 p-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
                <p className="text-muted-foreground">
                  Reach out to us through any of these channels. Our team is
                  available 24/7 to assist you.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((item) => (
                  <a
                    key={item.title}
                    href={item.href}
                    target={item.title === "Address" ? "_blank" : undefined}
                    rel={
                      item.title === "Address"
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="flex items-start gap-4 glass rounded-xl p-6 transition-all hover:shadow-lg group"
                  >
                    <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-muted-foreground">{item.value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="glass p-8 rounded-2xl">
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium mb-2"
                    >
                      Your Name
                    </label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="John Doe"
                      required
                      disabled={isPending}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium mb-2"
                    >
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="john@example.com"
                      required
                      disabled={isPending}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium mb-2"
                  >
                    Subject
                  </label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    placeholder="How can we help?"
                    required
                    disabled={isPending}
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium mb-2"
                  >
                    Message
                  </label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Tell us about your inquiry..."
                    rows={5}
                    required
                    disabled={isPending}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Map Embed */}
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-left">Our Location</h2>
            <div className="w-full mx-auto rounded-xl overflow-hidden border border-border shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3607.810425027785!2d55.3306038!3d25.2769619!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5d25b5dc75bb%3A0x12938b11975f717e!2sNeuro%20Oceans%20Travel%20and%20Tourism!5e0!3m2!1sen!2s!4v1704884812015!5m2!1sen!2s"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Neuro Oceans Travel and Tourism Location"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
