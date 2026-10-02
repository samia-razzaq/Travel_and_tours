import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold gradient-text">Neuro Ocean Tours</h3>
            <p className="text-sm text-muted-foreground">
              Your trusted partner for unforgettable Dubai adventures. Experience the magic of the UAE with our expertly crafted tours.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 glass rounded-lg hover:bg-primary/10 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 glass rounded-lg hover:bg-primary/10 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 glass rounded-lg hover:bg-primary/10 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/packages" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Tour Packages
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Tours */}
          <div>
            <h4 className="font-semibold mb-4">Popular Tours</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/booking/9" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Desert Safari
                </Link>
              </li>
              <li>
                <Link to="/booking/3" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Dhow Cruise
                </Link>
              </li>
              <li>
                <Link to="/booking/10" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  City Tours
                </Link>
              </li>
              <li>
                <Link to="/booking/25" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Theme Park
                </Link>
              </li>
              <li>
                <Link to="/packages" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Find Your Perfect Tour
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="mailto:neurooceantours@gmail.com" 
                  className="flex items-start gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  neurooceantours@gmail.com
                </a>
              </li>
              <li>
                <a 
                  href="tel:+971507278147" 
                  className="flex items-start gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  +971 50 727 8147
                </a>
              </li>
              <li>
                <a 
                  href="https://maps.google.com/?q=Hor+Al+Anz+Dubai" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  ALRAJHI-BLDG, Hor Al Anz, Dubai, UAE
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Neuro Ocean Tours. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
