import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowUp } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="relative bg-[#050811] text-slate-400 overflow-hidden">
      {/* Golden gradient line at the top */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-accent to-transparent opacity-60" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Parish Brand */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-3 group">
              <img 
                src="/logo.jpg" 
                alt="HIIOPC Logo" 
                className="h-10 w-10 rounded-full border border-accent/60 object-cover group-hover:border-accent transition-colors duration-300" 
              />
              <span className="font-serif text-lg font-bold text-slate-100 tracking-wide group-hover:text-accent transition-colors duration-300">
                Holy Innocents Church
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              A first pilgrimage church in honor of the Holy Innocents in the United Kingdom for the Malankara Orthodox Syrian Church.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a 
                href="https://www.facebook.com/p/Holy-Innocents-Indian-Orthodox-Church-Wales-61560140757775/" 
                target="_blank" 
                rel="noreferrer"
                className="p-2.5 rounded-full bg-primary-light/40 text-slate-400 hover:text-accent hover:bg-primary-light hover:shadow-[0_0_15px_rgba(214,175,55,0.2)] transition-all duration-300"
                aria-label="Facebook"
              >
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </a>
              <a 
                href="https://www.instagram.com/holyinnocents.ocym/" 
                target="_blank" 
                rel="noreferrer"
                className="p-2.5 rounded-full bg-primary-light/40 text-slate-400 hover:text-accent hover:bg-primary-light hover:shadow-[0_0_15px_rgba(214,175,55,0.2)] transition-all duration-300"
                aria-label="Instagram"
              >
                <svg className="h-5 w-5 stroke-current fill-none stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-serif text-slate-100 font-semibold text-base uppercase tracking-wider">Quick Links</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Link to="/" className="hover:text-accent hover:translate-x-1 inline-block transition-all duration-300">Home</Link>
              <Link to="/about" className="hover:text-accent hover:translate-x-1 inline-block transition-all duration-300">About</Link>
              <Link to="/services" className="hover:text-accent hover:translate-x-1 inline-block transition-all duration-300">Services</Link>
              <Link to="/articles" className="hover:text-accent hover:translate-x-1 inline-block transition-all duration-300">Articles</Link>
              <Link to="/gallery" className="hover:text-accent hover:translate-x-1 inline-block transition-all duration-300">Gallery</Link>
              <Link to="/contact" className="hover:text-accent hover:translate-x-1 inline-block transition-all duration-300">Contact</Link>
            </div>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col gap-4">
            <h3 className="font-serif text-slate-100 font-semibold text-base uppercase tracking-wider">Contact Info</h3>
            <ul className="space-y-3.5 text-sm">
              <li className="flex gap-3">
                <MapPin className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <span>Graig road, Briton Ferry, Neath, Wales, UK, SA11 2YY</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-accent shrink-0" />
                <a href="tel:01639697330" className="hover:text-slate-100 transition-colors">01639 697330</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-accent shrink-0" />
                <a href="mailto:hiiocwales@gmail.com" className="hover:text-slate-100 transition-colors">hiiocwales@gmail.com</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Legal Credits */}
        <div className="mt-12 pt-8 border-t border-white/5 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {currentYear} Holy Innocents Indian Orthodox Pilgrimage Church. All rights reserved.</p>
          <p className="text-slate-450">Built with React & Cloudflare Pages</p>
        </div>
      </div>

      {/* Floating Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-50 p-3 rounded-full bg-gradient-to-r from-accent-dark to-accent text-primary-dark font-bold shadow-lg hover:shadow-accent/40 hover:-translate-y-1 transition-all duration-300 active:translate-y-0 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
        }`}
        aria-label="Back to Top"
      >
        <ArrowUp className="h-5 w-5" strokeWidth={2.5} />
      </button>
    </footer>
  );
}
