import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Articles', path: '/articles' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact Us', path: '/contact' },
  ];

  // Navbar is transparent ONLY at the top of the Home page
  const isTransparent = location.pathname === '/' && !scrolled;

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isTransparent 
          ? 'bg-transparent py-5' 
          : 'bg-slate-950/95 backdrop-blur-xl shadow-lg border-b border-accent/20 py-3'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Mobile Layout: Hamburger Left, Logo Right */}
            <div className="flex lg:hidden items-center justify-between w-full">
              {/* Hamburger Button (Left) */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-slate-300 hover:text-white p-2 rounded-md hover:bg-white/5 transition-colors duration-300"
                aria-label="Toggle menu"
              >
                <Menu className="h-6 w-6" />
              </button>

              {/* Logo / Brand (Right) */}
              <Link to="/" className="flex items-center gap-2.5">
                <img 
                  src="/logo.jpg" 
                  alt="St Gregorios Logo" 
                  className="h-10 w-10 rounded-full border border-accent/60 object-cover" 
                />
                <div className="text-right">
                  <span className="block font-serif text-sm font-bold text-slate-100 leading-tight">
                    St Gregorios
                  </span>
                  <span className="block text-[8px] text-accent/80 font-sans tracking-widest uppercase">
                    Cardiff Wales
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Layout: Logo Left, Links Right */}
            <div className="hidden lg:flex items-center justify-between w-full">
              {/* Logo Section */}
              <Link to="/" className="flex items-center gap-3 group">
                <img 
                  src="/logo.jpg" 
                  alt="St Gregorios Logo" 
                  className="h-12 w-12 rounded-full border-2 border-accent/70 object-cover shadow-[0_0_15px_rgba(214,175,55,0.2)] group-hover:scale-105 group-hover:border-accent transition-all duration-300" 
                />
                <div>
                  <span className="block font-serif text-base md:text-lg font-bold text-slate-100 tracking-wide leading-tight group-hover:text-accent transition-colors duration-300">
                    St Gregorios Church
                  </span>
                  <span className="block text-[10px] text-accent/80 font-sans tracking-widest uppercase mt-0.5">
                    Cardiff Wales
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation Links */}
              <div className="flex items-center gap-6">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`relative font-sans text-[10px] font-semibold tracking-widest uppercase transition-colors duration-300 ${
                        isActive 
                          ? 'text-accent' 
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      {link.name}
                      {isActive ? (
                        <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-gradient-to-r from-accent-dark via-accent to-accent-light rounded-full" />
                      ) : (
                        <span className="absolute -bottom-2 left-1/2 w-0 h-[1.5px] bg-accent/70 rounded-full transition-all duration-300 group-hover:left-0 group-hover:w-full" />
                      )}
                    </Link>
                  );
                })}
                <Link 
                  to="/contact" 
                  className="relative overflow-hidden group bg-gradient-to-r from-accent-dark to-accent hover:from-accent hover:to-accent-light text-primary-dark font-bold px-5 py-2 rounded-full text-[10px] uppercase tracking-widest transition-all duration-300 shadow-[0_4px_15px_rgba(214,175,55,0.25)] hover:shadow-[0_4px_25px_rgba(214,175,55,0.45)] hover:-translate-y-0.5 animate-pulse text-slate-900"
                >
                  Connect
                </Link>
              </div>
            </div>

          </div>
        </div>
      </nav>

      {/* standard slide-in drawer from the left */}
      <div className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        {/* Overlay Backdrop */}
        <div 
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />

        {/* Drawer Panel */}
        <div className={`absolute top-0 bottom-0 left-0 w-4/5 max-w-sm bg-slate-950 border-r border-accent/20 p-6 flex flex-col transition-transform duration-300 ease-out shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          {/* Header of drawer */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="/logo.jpg" 
                alt="St Gregorios Logo" 
                className="h-9 w-9 rounded-full border border-accent/60 object-cover" 
              />
              <span className="font-serif text-sm font-bold text-slate-100">St Gregorios</span>
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-2"
              aria-label="Close menu"
            >
              <X className="h-5 w-5 text-accent" />
            </button>
          </div>

          {/* Links list */}
          <div className="flex flex-col gap-5">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`font-serif text-lg tracking-wider transition-colors duration-300 py-1 ${
                    isActive ? 'text-accent font-bold scale-[1.02]' : 'text-slate-350 hover:text-accent'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <Link
              to="/contact"
              className="mt-6 bg-gradient-to-r from-accent-dark to-accent text-primary-dark font-bold px-6 py-3 rounded-full text-center text-xs uppercase tracking-widest shadow-lg shadow-accent/20 hover:shadow-accent/40 transition-all duration-300 text-slate-900"
            >
              Connect With Us
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
