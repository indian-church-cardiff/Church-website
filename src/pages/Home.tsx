import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Calendar, 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  Users, 
  BookOpen, 
  Music, 
  Heart, 
  ExternalLink, 
  ChevronRight,
  Smile,
  Video
} from 'lucide-react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import ScrollReveal from '../components/ScrollReveal';
import GlowCard from '../components/GlowCard';
import SectionDivider from '../components/SectionDivider';

interface Program {
  id: string;
  title: string;
  date: string;
  time: string;
  description?: string;
}

interface VideoItem {
  id: string;
  title: string;
  description?: string;
  youtubeUrl: string;
}

interface GalleryItem {
  id: string;
  title: string;
  url: string;
  category: string;
}

export default function Home() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loadingProgs, setLoadingProgs] = useState(true);
  const [loadingGallery, setLoadingGallery] = useState(true);

  // Fallback default choir video details
  const defaultVideos: VideoItem[] = [
    {
      id: 'default-vid-1',
      title: 'St Gregorios Choir Song',
      description: 'Lyrics & Music: Kochumon Karichal | Vocal: St Gregorios Choir Cardiff | Production: MMVS Wales | Videography & Editing: Jibin John & Leo | Singers: Kochumon Karichal, Roshan Vadakel, Jino Francis, Beena Jacob, Jissa Joyson, Bency Lancy Samuel, Jeena Jessy Kunjumon, Anna Selin Jolly',
      youtubeUrl: '' // Empty signifies fallback description box
    }
  ];

  // Retrieve data in real-time from Firestore
  useEffect(() => {
    // 1. Fetch top 3 upcoming programs (monthly events)
    const qProg = query(
      collection(db, 'programs'),
      orderBy('date', 'asc'),
      limit(3)
    );
    const unsubscribeProg = onSnapshot(qProg, (snapshot) => {
      const progs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Program[];
      setPrograms(progs);
      setLoadingProgs(false);
    }, (error) => {
      console.error("Error fetching programs:", error);
      setLoadingProgs(false);
    });

    // 2. Fetch top 6 recent gallery uploads
    const qGallery = query(
      collection(db, 'gallery'),
      orderBy('createdAt', 'desc'),
      limit(6)
    );
    const unsubscribeGallery = onSnapshot(qGallery, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GalleryItem[];
      setGalleryItems(items);
      setLoadingGallery(false);
    }, (error) => {
      console.error("Error fetching gallery items:", error);
      setLoadingGallery(false);
    });

    // 3. Fetch parish videos
    const qVid = query(
      collection(db, 'videos'),
      orderBy('createdAt', 'desc')
    );
    const unsubscribeVid = onSnapshot(qVid, (snapshot) => {
      const vids = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as VideoItem[];
      setVideos(vids);
    }, (error) => {
      console.error("Error fetching videos:", error);
    });

    return () => {
      unsubscribeProg();
      unsubscribeGallery();
      unsubscribeVid();
    };
  }, []);

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    try {
      const trimmedUrl = url.trim();
      if (trimmedUrl.includes('facebook.com') || trimmedUrl.includes('fb.watch')) {
        return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(trimmedUrl)}&show_text=0`;
      }
      if (trimmedUrl.includes('youtu.be/')) {
        const id = trimmedUrl.split('youtu.be/')[1]?.split(/[?#]/)[0];
        return `https://www.youtube.com/embed/${id}`;
      }
      if (trimmedUrl.includes('watch?v=')) {
        const id = trimmedUrl.split('watch?v=')[1]?.split('&')[0];
        return `https://www.youtube.com/embed/${id}`;
      }
      if (trimmedUrl.includes('embed/')) {
        return trimmedUrl;
      }
      return trimmedUrl;
    } catch (e) {
      console.error(e);
      return url;
    }
  };

  const displayVideos = videos.length > 0 ? videos : defaultVideos;

  // Handler to scroll to timings smoothly
  const scrollToSchedule = () => {
    document.getElementById('weekly-schedule')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handler to scroll to map smoothly
  const scrollToMap = () => {
    document.getElementById('location-map')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Determine next service display
  const nextServiceInfo = programs.length > 0 ? {
    title: programs[0].title,
    date: new Date(programs[0].date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
    time: programs[0].time
  } : {
    title: 'Holy Qurbana Service',
    date: 'Every Sunday',
    time: '8:30 AM'
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#faf6ee] text-slate-800 font-sans">
      
      {/* 1. Hero Section with Parallax Background */}
      <section 
        className="relative min-h-[92vh] flex items-center justify-center bg-fixed bg-cover bg-center text-white pt-24 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(5, 8, 17, 0.70), rgba(5, 8, 17, 0.85)), url('/church-image.jpg')`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#faf6ee]/10 to-[#faf6ee] opacity-100"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <ScrollReveal animation="scale-in" duration={1000}>
            <div className="mb-6 hover:scale-105 transition-transform duration-500 relative group">
              <div className="absolute -inset-1.5 rounded-full bg-accent/30 blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <img 
                src="/logo.jpg" 
                alt="St Gregorios Logo" 
                className="relative h-24 w-24 md:h-28 md:w-28 rounded-full border-2 border-accent object-cover shadow-2xl" 
              />
            </div>
          </ScrollReveal>
          
          <ScrollReveal animation="fade-up" delay={200} duration={850}>
            <span className="text-accent font-bold tracking-widest text-[10px] sm:text-xs uppercase mb-3 bg-accent/10 px-5 py-2 rounded-full border border-accent/20">
              Malankara Orthodox Syrian Church
            </span>
          </ScrollReveal>
          
          <ScrollReveal animation="fade-up" delay={400} duration={1000}>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold font-serif mb-5 tracking-wide leading-tight text-white max-w-4xl">
              St. Gregorios Indian Orthodox Congregation, Cardiff
            </h1>
          </ScrollReveal>
          
          <ScrollReveal animation="fade-up" delay={600} duration={850}>
            <p className="text-sm sm:text-base md:text-lg text-slate-200 font-light max-w-3xl leading-relaxed mb-8">
              A parish of the Malankara Orthodox Syrian Church serving the Orthodox faithful in Cardiff, South Wales, and surrounding regions.
            </p>
          </ScrollReveal>
          
          <ScrollReveal animation="fade-up" delay={800} duration={850}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md">
              <button 
                onClick={scrollToSchedule}
                className="bg-[#C8A34D] hover:bg-[#b08b3c] text-white font-bold px-8 py-4 rounded-full uppercase tracking-wider text-xs transition-all duration-300 shadow-lg hover:shadow-[#C8A34D]/30 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 cursor-pointer"
              >
                Join Us This Sunday
                <ArrowRight className="h-4 w-4" />
              </button>
              <Link 
                to="/contact" 
                className="border-2 border-white/30 hover:border-[#C8A34D] bg-white/5 hover:bg-white/10 text-white hover:text-white font-bold px-8 py-4 rounded-full uppercase tracking-wider text-xs transition-all duration-300 flex items-center justify-center gap-2"
              >
                Contact Us
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 2. This Week Highlight Banner */}
      <section className="relative z-20 -mt-10 max-w-6xl mx-auto w-full px-4 sm:px-6">
        <ScrollReveal animation="scale-in" duration={800}>
          <div className="bg-white border-t-4 border-[#C8A34D] rounded-3xl p-5 md:p-6 shadow-xl flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="bg-[#C8A34D]/10 text-[#C8A34D] text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded border border-[#C8A34D]/20 shrink-0">
                This Week
              </span>
              <p className="text-slate-800 text-xs sm:text-sm font-semibold">
                Join our liturgical gatherings, family prayers, and fellowship sessions.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-[10px] sm:text-xs font-bold text-slate-500">
              <span className="bg-slate-50 border border-slate-100 px-2.5 py-1 rounded">Sunday Holy Qurbana (8:30 AM)</span>
              <span className="bg-slate-50 border border-slate-100 px-2.5 py-1 rounded">Sunday School (11:30 AM)</span>
              <span className="bg-slate-50 border border-slate-100 px-2.5 py-1 rounded">Wednesday Evening Prayer (6:30 PM)</span>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 3. Quick Information Cards */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <ScrollReveal animation="fade-up" delay={50}>
            <div className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-md hover:border-[#C8A34D]/50 hover:shadow-lg transition-all duration-300 group h-full flex flex-col justify-between">
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-[#C8A34D]/10 rounded-xl text-[#C8A34D] shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#C8A34D]">📍 Location</h3>
                  <p className="text-slate-750 text-xs mt-2 font-medium leading-relaxed">
                    Graig Road, Briton Ferry, Neath, SA11 2YY
                  </p>
                </div>
              </div>
              <button 
                onClick={scrollToMap} 
                className="mt-4 text-[10px] uppercase font-bold tracking-wider text-slate-400 group-hover:text-[#C8A34D] transition-colors flex items-center gap-1 cursor-pointer align-bottom"
              >
                View Map &rarr;
              </button>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={150}>
            <div className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-md hover:border-[#C8A34D]/50 hover:shadow-lg transition-all duration-300 group h-full flex flex-col justify-between">
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-[#C8A34D]/10 rounded-xl text-[#C8A34D] shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#C8A34D]">🕒 Holy Qurbana</h3>
                  <p className="text-slate-750 text-xs mt-2 font-medium leading-relaxed">
                    Every Sunday: Morning Prayer at 8:30 AM followed by Holy Liturgy
                  </p>
                </div>
              </div>
              <button 
                onClick={scrollToSchedule}
                className="mt-4 text-[10px] uppercase font-bold tracking-wider text-slate-400 group-hover:text-[#C8A34D] transition-colors flex items-center gap-1 cursor-pointer"
              >
                Full Timetable &rarr;
              </button>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={250}>
            <div className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-md hover:border-[#C8A34D]/50 hover:shadow-lg transition-all duration-300 group h-full flex flex-col justify-between">
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-[#C8A34D]/10 rounded-xl text-[#C8A34D] shrink-0">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#C8A34D]">📅 Next Service</h3>
                  <p className="text-slate-900 text-xs mt-2 font-bold leading-tight">
                    {nextServiceInfo.title}
                  </p>
                  <p className="text-slate-500 text-[10px] mt-1 font-medium">
                    {nextServiceInfo.date} • {nextServiceInfo.time}
                  </p>
                </div>
              </div>
              <span className="mt-4 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Live Calendar
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={350}>
            <div className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-md hover:border-[#C8A34D]/50 hover:shadow-lg transition-all duration-300 group h-full flex flex-col justify-between">
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-[#C8A34D]/10 rounded-xl text-[#C8A34D] shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#C8A34D]">📞 Contact Vicar</h3>
                  <p className="text-slate-750 text-xs mt-2 font-medium leading-relaxed">
                    Fr. Ranju Skaria
                  </p>
                  <p className="text-slate-500 text-[10px] mt-0.5">
                    Phone: 01639 697330
                  </p>
                </div>
              </div>
              <a 
                href="mailto:hiiocwales@gmail.com"
                className="mt-4 text-[10px] uppercase font-bold tracking-wider text-slate-400 group-hover:text-[#C8A34D] transition-colors flex items-center gap-1"
              >
                Send Email &rarr;
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <SectionDivider />

      {/* 4. Welcome Message & Congregation Photo */}
      <section className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Text details */}
            <ScrollReveal animation="slide-right" className="lg:col-span-6 space-y-6">
              <span className="text-[#C8A34D] font-bold tracking-widest text-xs uppercase bg-[#C8A34D]/5 px-3.5 py-2 rounded-md border border-[#C8A34D]/20">
                Welcome To Our Congregation
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold font-serif text-slate-900 leading-tight">
                worship with us & join our spiritual family
              </h2>
              <div className="h-1 w-20 bg-[#C8A34D] rounded"></div>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-light">
                Whether you are a parish member, newly arrived in Cardiff, or visiting South Wales, we warmly welcome you to worship with us and become part of our church family.
              </p>
              <p className="text-slate-655 text-sm sm:text-base leading-relaxed font-light">
                As a family-centered congregation, we gather weekly to celebrate the holy sacraments, support each other, and grow together in the apostolic faith and Orthodox tradition.
              </p>
              <div className="pt-2">
                <Link 
                  to="/about"
                  className="inline-flex items-center gap-1.5 text-white bg-[#C8A34D] hover:bg-[#b08b3c] font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-full transition-all duration-300"
                >
                  Learn More About Us
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </ScrollReveal>

            {/* Congregation photo */}
            <ScrollReveal animation="slide-left" className="lg:col-span-6 relative group">
              <div className="absolute -inset-4 bg-gradient-to-br from-[#C8A34D]/20 to-slate-100 rounded-2xl -rotate-2 -z-10 group-hover:rotate-0 transition-transform duration-500"></div>
              <img 
                src="/congregation.jpg" 
                alt="St Gregorios Parish Congregation" 
                className="rounded-2xl shadow-xl w-full object-cover aspect-[4/3] border border-slate-200 group-hover:scale-[1.01] transition-all duration-500" 
              />
              <div className="absolute inset-0 border-2 border-[#C8A34D]/25 rounded-2xl pointer-events-none group-hover:border-[#C8A34D]/50 transition-colors duration-500 m-2" />
            </ScrollReveal>

          </div>
        </div>
      </section>

      <SectionDivider />

      {/* 5. Dynamic Upcoming Events */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up" className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#C8A34D] font-bold tracking-widest text-xs uppercase bg-[#C8A34D]/5 px-3.5 py-2 rounded-md border border-[#C8A34D]/20">
              Liturgical Calendar
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold font-serif mt-4 text-slate-900">Upcoming Events</h2>
            <div className="h-1 w-16 bg-[#C8A34D] mx-auto mt-4 mb-6"></div>
            <p className="text-slate-500 font-light text-sm sm:text-base leading-relaxed">
              Plan your month and participate in our upcoming programs, holy feast celebrations, and community prayer days.
            </p>
          </ScrollReveal>

          {loadingProgs ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 border-2 border-[#C8A34D] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : programs.length === 0 ? (
            <ScrollReveal animation="scale-in">
              <div className="text-center py-12 bg-slate-50 border border-dashed border-slate-200 rounded-3xl max-w-xl mx-auto">
                <Calendar className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-550 text-sm font-light">Service calendar details are currently being updated. Please call us for details.</p>
              </div>
            </ScrollReveal>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {programs.map((prog, index) => (
                <ScrollReveal key={prog.id} animation="fade-up" delay={index * 150}>
                  <GlowCard className="p-8 h-full flex flex-col justify-between bg-white border border-slate-150 rounded-2xl shadow-sm hover:shadow-md hover:border-[#C8A34D]/30 transition-all duration-300">
                    <div>
                      <div className="flex justify-between items-center gap-4">
                        <span className="text-[10px] text-[#C8A34D] font-bold bg-[#C8A34D]/10 border border-[#C8A34D]/20 px-3 py-1 rounded-full uppercase tracking-widest">
                          {new Date(prog.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <span className="text-[10px] text-slate-500 font-semibold bg-slate-100 px-3 py-1 rounded-full tracking-wider">
                          {prog.time}
                        </span>
                      </div>
                      <h3 className="text-xl font-serif font-bold text-slate-900 mt-6 mb-3 hover:text-[#C8A34D] transition-colors duration-300">
                        {prog.title}
                      </h3>
                      {prog.description && (
                        <p className="text-slate-500 text-xs sm:text-sm font-light leading-relaxed font-sans line-clamp-4">
                          {prog.description}
                        </p>
                      )}
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-slate-400 text-xs">
                      <MapPin className="h-3.5 w-3.5 text-[#C8A34D] shrink-0" />
                      <span className="font-light">Cardiff/Neath Chapel</span>
                    </div>
                  </GlowCard>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <SectionDivider />

      {/* 6. Weekly Service Schedule */}
      <section id="weekly-schedule" className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up" className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#C8A34D] font-bold tracking-widest text-xs uppercase bg-[#C8A34D]/5 px-3.5 py-2 rounded-md border border-[#C8A34D]/20">
              Timetable
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold font-serif mt-4 text-slate-900">Weekly Services Schedule</h2>
            <div className="h-1 w-16 bg-[#C8A34D] mx-auto mt-4 mb-6"></div>
          </ScrollReveal>

          <div className="max-w-3xl mx-auto space-y-4">
            <ScrollReveal animation="fade-up" delay={50}>
              <div className="bg-white border border-slate-150 p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-[#C8A34D]/30 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-24 bg-[#C8A34D]/10 text-[#C8A34D] font-serif font-bold text-sm uppercase flex items-center justify-center rounded-lg border border-[#C8A34D]/20">
                    Sunday
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-slate-900 text-base">Holy Qurbana Service</h3>
                    <p className="text-slate-450 text-[10px] mt-0.5 uppercase tracking-wide">Liturgical rite of the Indian Syrian Orthodox Church</p>
                  </div>
                </div>
                <div className="text-slate-800 font-bold text-sm bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl text-right">
                  8:30 AM – 11:30 AM
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={150}>
              <div className="bg-white border border-slate-150 p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-[#C8A34D]/30 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-24 bg-[#C8A34D]/10 text-[#C8A34D] font-serif font-bold text-sm uppercase flex items-center justify-center rounded-lg border border-[#C8A34D]/20">
                    Sunday
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-slate-900 text-base">Sunday School & Catechism</h3>
                    <p className="text-slate-450 text-[10px] mt-0.5 uppercase tracking-wide">Catechesis books & spiritual scriptures</p>
                  </div>
                </div>
                <div className="text-slate-800 font-bold text-sm bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl text-right">
                  11:30 AM – 12:30 PM
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={250}>
              <div className="bg-white border border-slate-150 p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-[#C8A34D]/30 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-24 bg-slate-100 text-slate-600 font-serif font-bold text-sm uppercase flex items-center justify-center rounded-lg border border-slate-200">
                    Wednesday
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-slate-900 text-base">Evening Prayer (Sandhya Namaskaram)</h3>
                    <p className="text-slate-450 text-[10px] mt-0.5 uppercase tracking-wide">Family prayer and Syrian Orthodox devotions</p>
                  </div>
                </div>
                <div className="text-slate-800 font-bold text-sm bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl text-right">
                  6:30 PM – 7:30 PM
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* 7. Parish Life Division Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up" className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#C8A34D] font-bold tracking-widest text-xs uppercase bg-[#C8A34D]/5 px-3.5 py-2 rounded-md border border-[#C8A34D]/20">
              Parish Ministries
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold font-serif mt-4 text-slate-900">Parish Life</h2>
            <div className="h-1 w-16 bg-[#C8A34D] mx-auto mt-4 mb-6"></div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <ScrollReveal animation="fade-up" delay={50}>
              <div className="bg-slate-50 border border-slate-150 p-8 rounded-2xl hover:border-[#C8A34D]/30 hover:-translate-y-1 transition-all duration-300">
                <div className="p-3 bg-[#C8A34D]/10 rounded-xl text-[#C8A34D] w-fit mb-6">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-serif font-bold text-slate-900 mb-2">Sunday School</h3>
                <p className="text-slate-500 text-xs sm:text-sm font-light leading-relaxed">
                  Providing a sound Orthodox catechism, biblical foundation, and church liturgics classes to children from preschool up to senior levels.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={150}>
              <div className="bg-slate-50 border border-slate-150 p-8 rounded-2xl hover:border-[#C8A34D]/30 hover:-translate-y-1 transition-all duration-300">
                <div className="p-3 bg-[#C8A34D]/10 rounded-xl text-[#C8A34D] w-fit mb-6">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-serif font-bold text-slate-900 mb-2">MGOCSM</h3>
                <p className="text-slate-500 text-xs sm:text-sm font-light leading-relaxed">
                  Mar Gregorios Orthodox Christian Student Movement nurtures secondary and university students in spiritual growth, research, and outreach.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={250}>
              <div className="bg-slate-50 border border-slate-150 p-8 rounded-2xl hover:border-[#C8A34D]/30 hover:-translate-y-1 transition-all duration-300">
                <div className="p-3 bg-[#C8A34D]/10 rounded-xl text-[#C8A34D] w-fit mb-6">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-serif font-bold text-slate-900 mb-2">OCYM</h3>
                <p className="text-slate-500 text-xs sm:text-sm font-light leading-relaxed">
                  Orthodox Christian Youth Movement offers dynamic opportunities for spiritual discussions, leadership, community welfare, and charity work.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={350}>
              <div className="bg-slate-50 border border-slate-150 p-8 rounded-2xl hover:border-[#C8A34D]/30 hover:-translate-y-1 transition-all duration-300">
                <div className="p-3 bg-[#C8A34D]/10 rounded-xl text-[#C8A34D] w-fit mb-6">
                  <Heart className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-serif font-bold text-slate-900 mb-2">Family Fellowship</h3>
                <p className="text-slate-500 text-xs sm:text-sm font-light leading-relaxed">
                  Cultivating a supportive, warm environment for families to network, pray, share, and organize cultural activities in South Wales.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={450}>
              <div className="bg-slate-50 border border-slate-150 p-8 rounded-2xl hover:border-[#C8A34D]/30 hover:-translate-y-1 transition-all duration-300">
                <div className="p-3 bg-[#C8A34D]/10 rounded-xl text-[#C8A34D] w-fit mb-6">
                  <Music className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-serif font-bold text-slate-900 mb-2">Parish Choir</h3>
                <p className="text-slate-500 text-xs sm:text-sm font-light leading-relaxed">
                  Dedicating beautiful liturgic songs and ancient hymns in Malayalam and English, enriching our weekly Eucharistic celebrations.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={550}>
              <div className="bg-slate-50 border border-slate-150 p-8 rounded-2xl hover:border-[#C8A34D]/30 hover:-translate-y-1 transition-all duration-300">
                <div className="p-3 bg-[#C8A34D]/10 rounded-xl text-[#C8A34D] w-fit mb-6">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-serif font-bold text-slate-900 mb-2">Prayer Meetings</h3>
                <p className="text-slate-500 text-xs sm:text-sm font-light leading-relaxed">
                  Regular evening cell prayer gatherings hosted at parish member homes, encouraging community bonding and bible reflections.
                </p>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      <SectionDivider />

      {/* 8. Recent Photo Gallery Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
            <ScrollReveal animation="slide-right">
              <span className="text-[#C8A34D] font-bold tracking-widest text-xs uppercase bg-[#C8A34D]/5 px-3.5 py-2 rounded-md border border-[#C8A34D]/20">
                Parish Snapshots
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold font-serif text-slate-900 mt-4">Photo Gallery</h2>
              <div className="h-1 w-16 bg-[#C8A34D] mt-4"></div>
            </ScrollReveal>
            <ScrollReveal animation="slide-left">
              <Link
                to="/gallery"
                className="inline-flex items-center gap-1.5 border-2 border-[#C8A34D] hover:bg-[#C8A34D] text-[#C8A34D] hover:text-white font-bold text-xs uppercase tracking-widest px-6 py-3.5 rounded-full transition-all duration-300"
              >
                View Full Gallery
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </ScrollReveal>
          </div>

          {loadingGallery ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 border-2 border-[#C8A34D] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : galleryItems.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 border border-dashed border-slate-200 rounded-3xl max-w-xl mx-auto">
              <Smile className="h-10 w-10 text-slate-455 mx-auto mb-3" />
              <p className="text-slate-500 text-xs sm:text-sm font-light">No photos currently uploaded. View back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryItems.map((item, idx) => (
                <ScrollReveal key={item.id} animation="fade-up" delay={idx * 100}>
                  <div className="bg-slate-50 border border-slate-150 rounded-2xl overflow-hidden shadow-sm group hover:-translate-y-1 transition-all duration-300">
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                      <img 
                        src={item.url} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <span className="text-[10px] text-white font-bold uppercase tracking-widest bg-[#C8A34D] px-2.5 py-0.5 rounded border border-[#C8A34D]/30">
                          {item.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 bg-white">
                      <h4 className="text-sm font-serif font-bold text-slate-900 truncate leading-snug">{item.title}</h4>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <SectionDivider />

      {/* 9. Shortened Heritage Introduction */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Image section */}
            <ScrollReveal animation="slide-right" className="lg:col-span-5 relative group order-last lg:order-first">
              <div className="absolute -inset-4 bg-gradient-to-br from-[#C8A34D]/20 to-slate-100 rounded-2xl rotate-2 -z-10 group-hover:rotate-0 transition-transform duration-500"></div>
              <img 
                src="/church-image.jpg" 
                alt="Holy Liturgy Rituals" 
                className="rounded-2xl shadow-xl w-full object-cover aspect-[4/3] border border-slate-200" 
              />
            </ScrollReveal>

            {/* Content section */}
            <ScrollReveal animation="slide-left" className="lg:col-span-7 space-y-6">
              <span className="text-[#C8A34D] font-bold tracking-widest text-xs uppercase bg-[#C8A34D]/5 px-3.5 py-2 rounded-md border border-[#C8A34D]/20">
                Apostolic Origins
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold font-serif text-slate-900 leading-tight">
                Our Ancient Christian Heritage
              </h2>
              <div className="h-1 w-20 bg-[#C8A34D] rounded"></div>
              <p className="text-slate-655 text-sm sm:text-base leading-relaxed font-light">
                The **Malankara Orthodox Syrian Church** traces its origins to **St. Thomas the Apostle**, one of the twelve disciples of Jesus Christ, who brought the Gospel to India in **A.D. 52**. As one of the world's oldest Christian communities, the Church has faithfully preserved the apostolic faith through centuries of worship, prayer, and service.
              </p>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-light font-sans">
                Inherited from East Syrian and Persian liturgical relations, our traditional chants, Syriac prayer rites, and theological richness guide our weekly congregation worship here in Wales.
              </p>
              <div className="pt-2">
                <Link 
                  to="/about"
                  className="inline-flex items-center gap-1 text-[#C8A34D] hover:text-[#b08b3c] font-bold uppercase text-xs tracking-wider transition-colors"
                >
                  Read Full History &rarr;
                </Link>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      <SectionDivider />

      {/* 10. Priest Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-slate-150 p-8 md:p-12 rounded-3xl shadow-lg relative overflow-hidden max-w-5xl mx-auto">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C8A34D]/5 rounded-full filter blur-[100px] pointer-events-none"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center relative z-10">
              
              {/* Priest image */}
              <div className="md:col-span-4 flex justify-center">
                <ScrollReveal animation="scale-in" className="relative group w-48 h-48 md:w-56 md:h-56 shrink-0 rounded-full overflow-hidden border-4 border-[#C8A34D] shadow-xl">
                  <img 
                    src="/vicar.jpg" 
                    alt="Fr. Ranju Skaria" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </ScrollReveal>
              </div>

              {/* Priest details */}
              <div className="md:col-span-8 space-y-4 text-center md:text-left">
                <span className="text-[#C8A34D] font-bold tracking-widest text-xs uppercase">
                  Parish Vicar Message
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
                  Rev. Fr. Ranju Skaria
                </h2>
                <div className="h-[2px] w-12 bg-[#C8A34D]/50 mx-auto md:mx-0 my-2" />
                <p className="text-slate-655 text-sm sm:text-base leading-relaxed font-light italic">
                  "May the grace and peace of our Lord Jesus Christ be with you all. We extend our warmest blessings to everyone visiting Welsh lands and look forward to praying together in our Holy Services."
                </p>
                <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center md:justify-start text-xs font-semibold text-slate-500 font-sans">
                  <span className="flex items-center justify-center gap-2 bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-xl">
                    <Phone className="h-4 w-4 text-[#C8A34D]" />
                    <span>01639 697330</span>
                  </span>
                  <span className="flex items-center justify-center gap-2 bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-xl">
                    <Mail className="h-4 w-4 text-[#C8A34D]" />
                    <span>hiiocwales@gmail.com</span>
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Parish Videos Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up" className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#C8A34D] font-bold tracking-widest text-xs uppercase bg-[#C8A34D]/5 px-3.5 py-2 rounded-md border border-[#C8A34D]/20">
              Media Ministry
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold font-serif mt-4 text-slate-900">Parish Choir & Videos</h2>
            <div className="h-1 w-16 bg-[#C8A34D] mx-auto mt-4 mb-6"></div>
          </ScrollReveal>

          <div className="flex gap-8 overflow-x-auto pb-8 snap-x snap-mandatory scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0">
            {displayVideos.map((video, idx) => (
              <div key={video.id} className="min-w-[290px] sm:min-w-[480px] w-[85vw] sm:w-[480px] shrink-0 snap-start h-full pb-4">
                <ScrollReveal animation="fade-up" delay={idx * 100} className="h-full">
                  <GlowCard className="p-6 sm:p-8 bg-white border border-slate-150 rounded-2xl shadow-sm h-full flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="p-3 bg-[#C8A34D]/10 rounded-xl inline-block text-[#C8A34D]">
                        <Video className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-serif font-bold text-slate-900 line-clamp-2">{video.title}</h3>
                      {video.description && (
                        <p className="text-xs sm:text-sm text-slate-500 font-sans font-light leading-relaxed whitespace-pre-line line-clamp-3 hover:line-clamp-none transition-all duration-300">
                          {video.description}
                        </p>
                      )}
                    </div>
                    {video.youtubeUrl && (
                      <div className="mt-6 aspect-video rounded-xl overflow-hidden shadow-md border border-slate-200 bg-slate-100">
                        <iframe
                          src={getEmbedUrl(video.youtubeUrl)}
                          title={video.title}
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    )}
                  </GlowCard>
                </ScrollReveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* 11. Google Map Section */}
      <section id="location-map" className="w-full bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <ScrollReveal animation="fade-up" className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-[#C8A34D] font-bold tracking-widest text-xs uppercase bg-[#C8A34D]/5 px-3.5 py-2 rounded-md border border-[#C8A34D]/20">
              Find Us
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold font-serif mt-4 text-slate-900">Liturgical Chapel Location</h2>
            <div className="h-1 w-16 bg-[#C8A34D] mx-auto mt-4 mb-6"></div>
            <p className="text-slate-500 text-xs sm:text-sm font-light leading-relaxed">
              Our Welsh congregation worships at: **Graig Road, Briton Ferry, Neath, West Glamorgan, SA11 2YY, Wales, UK**. Use the map below to plan your navigation.
            </p>
          </ScrollReveal>

          <ScrollReveal animation="scale-in">
            <div className="w-full aspect-[21/9] min-h-[350px] md:min-h-[450px] rounded-3xl overflow-hidden shadow-xl border border-slate-200">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2480.052671509935!2d-3.8211977!3d51.622285199999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x486e5c544d6db875%3A0xe54e3b7b25ad7570!2sGraig%20Rd%2C%20Briton%20Ferry%2C%20Neath%20SA11%202YY!5e0!3m2!1sen!2suk!4v1700000000000!5m2!1sen!2suk" 
                title="St Gregorios Church Cardiff Location Map"
                className="w-full h-full border-0" 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </ScrollReveal>
        </div>
      </section>

    </div>
  );
}
