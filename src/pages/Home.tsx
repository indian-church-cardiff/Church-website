import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, ArrowDown, Video } from 'lucide-react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import ScrollReveal from '../components/ScrollReveal';
import ParticleBackground from '../components/ParticleBackground';
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

export default function Home() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback default choir video details
  const defaultVideos: VideoItem[] = [
    {
      id: 'default-vid-1',
      title: 'St Gregorios Choir Song',
      description: 'Lyrics & Music: Kochumon Karichal | Vocal: St Gregorios Choir Cardiff | Production: MMVS Wales | Videography & Editing: Jibin John & Leo | Singers: Kochumon Karichal, Roshan Vadakel, Jino Francis, Beena Jacob, Jissa Joyson, Bency Lancy Samuel, Jeena Jessy Kunjumon, Anna Selin Jolly',
      youtubeUrl: '' // Empty signifies fallback description box
    }
  ];

  // Retrieve current monthly programs from Firestore in real-time
  useEffect(() => {
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
      setLoading(false);
    }, (error) => {
      console.error("Error fetching programs:", error);
      setLoading(false);
    });

    const qVid = query(
      collection(db, 'videos'),
      orderBy('createdAt', 'desc'),
      limit(2)
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
      unsubscribeVid();
    };
  }, []);

  const displayVideos = videos.length > 0 ? videos : defaultVideos;

  return (
    <div className="flex flex-col min-h-screen mesh-bg relative text-slate-800">
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center text-white pt-20 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(10, 15, 29, 0.65), rgba(3, 5, 10, 0.85)), url('/church-image.jpg')`
        }}
      >
        <ParticleBackground />
        
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent opacity-40"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <ScrollReveal animation="scale-in" duration={1000}>
            <div className="mb-8 hover:scale-105 transition-transform duration-500 relative group">
              <div className="absolute -inset-1.5 rounded-full bg-accent/30 blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
              <img 
                src="/logo.jpg" 
                alt="St Gregorios Logo" 
                className="relative h-28 w-28 md:h-36 md:w-36 rounded-full border-2 border-accent object-cover shadow-2xl" 
              />
            </div>
          </ScrollReveal>
          
          <ScrollReveal animation="fade-up" delay={200} duration={800}>
            <span className="text-accent font-sans font-bold tracking-widest text-[10px] sm:text-xs uppercase mb-4 bg-accent/10 px-5 py-2 rounded-full border border-accent/30 shadow-[0_0_15px_rgba(214,175,55,0.1)]">
              United Kingdom
            </span>
          </ScrollReveal>
          
          <ScrollReveal animation="fade-up" delay={400} duration={1000}>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold font-serif mb-6 tracking-wide leading-tight text-white">
              St Gregorios <span className="shimmer-text">Indian Orthodox</span> Church
            </h1>
          </ScrollReveal>
          
          <ScrollReveal animation="fade-up" delay={600} duration={800}>
            <p className="text-base sm:text-lg md:text-2xl text-slate-200 font-light max-w-2xl font-sans tracking-widest mb-10 uppercase">
              Cardiff, Wales, UK
            </p>
          </ScrollReveal>
          
          <ScrollReveal animation="fade-up" delay={800} duration={800}>
            <div className="flex flex-col sm:flex-row gap-5 justify-center w-full max-w-md">
              <Link 
                to="/about" 
                className="bg-gradient-to-r from-accent-dark to-accent hover:from-accent hover:to-accent-light text-primary-dark font-bold px-8 py-4 rounded-full uppercase tracking-wider transition-all duration-300 shadow-[0_4px_20px_rgba(214,175,55,0.3)] hover:shadow-[0_4px_30px_rgba(214,175,55,0.5)] flex items-center justify-center gap-2 transform hover:-translate-y-0.5 text-slate-900"
              >
                Our History & Mission
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link 
                to="/contact" 
                className="border-2 border-white/20 hover:border-accent bg-white/5 hover:bg-accent/10 hover:text-accent text-white font-bold px-8 py-4 rounded-full uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2"
              >
                Connect With Us
              </Link>
            </div>
          </ScrollReveal>
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-300 animate-bounce">
          <span className="text-[10px] uppercase tracking-widest font-sans font-semibold">Scroll Down</span>
          <ArrowDown className="h-4 w-4 text-accent" />
        </div>
      </section>

      {/* About Summary Section */}
      <section id="about" className="py-24 relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Text side */}
            <ScrollReveal animation="slide-right" className="space-y-6">
              <span className="text-accent font-semibold tracking-widest text-xs uppercase bg-accent/5 px-3 py-1.5 rounded-md border border-accent/20">About Our Church</span>
              <h2 className="text-3xl sm:text-5xl font-bold font-serif leading-tight text-slate-900 mt-4">
                Discover the Heart of Our Faith Community
              </h2>
              <div className="h-1 w-20 bg-gradient-to-r from-accent to-accent-light rounded"></div>
              <p className="text-slate-650 text-base sm:text-lg leading-relaxed font-sans font-light">
                St. Gregorios Indian Orthodox Church Cardiff is a newly forming parish under the Diocese of UK, Europe, and Africa of the Malankara Orthodox Syrian Church in Cardiff, Wales.
              </p>
              <p className="text-slate-700 text-base sm:text-lg leading-relaxed font-sans font-light">
                We are a Parish in the Diocese of United Kingdom – Europe and Africa under the pastoral authority of Metropolitan Abraham Mar Stéphanos. Let us give thanks to God!
              </p>
              <Link 
                to="/about"
                className="inline-flex items-center gap-2 text-accent hover:text-accent-dark font-bold font-sans uppercase text-xs tracking-wider transition-colors"
              >
                Read Parish History &rarr;
              </Link>
            </ScrollReveal>

            {/* Image side */}
            <ScrollReveal animation="slide-left" className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-br from-accent/20 to-slate-100 rounded-2xl -rotate-2 -z-10 group-hover:rotate-0 transition-transform duration-500"></div>
              <img 
                src="/church-image.jpg" 
                alt="Church Gathering" 
                className="rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] w-full object-cover aspect-[4/3] border border-slate-200 group-hover:scale-[1.01] transition-transform duration-500" 
              />
              <div className="absolute inset-0 border-2 border-accent/20 rounded-2xl pointer-events-none group-hover:border-accent/40 transition-colors duration-500 m-2" />
            </ScrollReveal>

          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Liturgical Services Schedule */}
      <section className="py-24 relative overflow-hidden bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up" className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-accent font-semibold tracking-widest text-xs uppercase bg-accent/5 px-3 py-1.5 rounded-md border border-accent/20">Worship & Ministry</span>
            <h2 className="text-3xl sm:text-5xl font-bold font-serif mt-4 text-slate-900">Holy Services Timing</h2>
            <div className="h-1 w-16 bg-gradient-to-r from-accent to-accent-light mx-auto mt-4 mb-6"></div>
            <p className="text-slate-600 font-light">
              We gather for liturgical timings, holy worship, and community education on Sunday mornings.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <ScrollReveal animation="slide-right">
              <GlowCard className="p-8 bg-white border border-slate-100 text-center h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-serif font-bold text-slate-900 mb-3">Holy Qurbana</h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-sans font-light mb-6">
                    Our principal Eucharistic service celebrated with devotion, songs, and liturgy in the traditional Malankara Orthodox Syrian rite.
                  </p>
                </div>
                <div className="py-3 px-4 bg-slate-50 border border-slate-150 rounded-xl font-serif font-bold text-accent">
                  Sunday: 8:30 am – 11:30 am
                </div>
              </GlowCard>
            </ScrollReveal>

            <ScrollReveal animation="slide-left">
              <GlowCard className="p-8 bg-white border border-slate-100 text-center h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-serif font-bold text-slate-900 mb-3">Sunday School</h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-sans font-light mb-6">
                    Nurturing our children in spiritual knowledge, biblical foundations, and church catechism books.
                  </p>
                </div>
                <div className="py-3 px-4 bg-slate-50 border border-slate-150 rounded-xl font-serif font-bold text-accent">
                  Sunday: 11:30 am – 12:30 pm
                </div>
              </GlowCard>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Program Schedule Form Firestore */}
      <section className="py-24 relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up" className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-accent font-semibold tracking-widest text-xs uppercase bg-accent/5 px-3 py-1.5 rounded-md border border-accent/20">Liturgical Calendar</span>
            <h2 className="text-3xl sm:text-5xl font-bold font-serif mt-4 text-slate-900">Programs of the Month</h2>
            <div className="h-1 w-16 bg-gradient-to-r from-accent to-accent-light mx-auto mt-4 mb-6"></div>
          </ScrollReveal>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="h-10 w-10 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : programs.length === 0 ? (
            <ScrollReveal animation="scale-in">
              <div className="text-center py-12 bg-slate-50 border border-dashed border-accent/20 rounded-3xl max-w-xl mx-auto glass">
                <Calendar className="h-10 w-10 text-accent/60 mx-auto mb-3" />
                <p className="text-slate-650 text-sm px-6 font-light">Timings are being updated by the parish office. Please contact us directly.</p>
              </div>
            </ScrollReveal>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {programs.map((prog, index) => (
                <ScrollReveal key={prog.id} animation="fade-up" delay={index * 150}>
                  <GlowCard className="p-8 h-full flex flex-col justify-between bg-white border border-slate-100">
                    <div>
                      <div className="flex justify-between items-center gap-4">
                        <span className="text-[10px] text-accent font-bold bg-accent/10 border border-accent/30 px-3 py-1 rounded-full uppercase tracking-widest font-sans">
                          {new Date(prog.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </span>
                        <span className="text-[10px] text-slate-600 font-semibold bg-slate-100 border border-slate-200 px-3 py-1 rounded-full font-sans tracking-wider">
                          {prog.time}
                        </span>
                      </div>
                      <h3 className="text-xl font-serif font-bold text-slate-900 mt-6 mb-3 group-hover:text-accent transition-colors duration-300">{prog.title}</h3>
                      {prog.description && (
                        <p className="text-sm text-slate-600 leading-relaxed font-sans font-light">{prog.description}</p>
                      )}
                    </div>
                  </GlowCard>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <SectionDivider />

      {/* Videos & Choir Songs Section */}
      <section className="py-24 relative overflow-hidden bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up" className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-accent font-semibold tracking-widest text-xs uppercase bg-accent/5 px-3 py-1.5 rounded-md border border-accent/20">Media Ministry</span>
            <h2 className="text-3xl sm:text-5xl font-bold font-serif mt-4 text-slate-900">Parish Choir & Videos</h2>
            <div className="h-1 w-16 bg-gradient-to-r from-accent to-accent-light mx-auto mt-4 mb-6"></div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {displayVideos.map((video, idx) => (
              <ScrollReveal key={video.id} animation="fade-up" delay={idx * 150} className="h-full">
                <GlowCard className="p-8 bg-white border border-slate-100 h-full flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="p-3 bg-accent/5 rounded-xl border border-accent/20 inline-block text-accent">
                      <Video className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-slate-900">{video.title}</h3>
                    {video.description && (
                      <p className="text-sm text-slate-600 font-sans font-light leading-relaxed whitespace-pre-line">
                        {video.description}
                      </p>
                    )}
                  </div>
                  {video.youtubeUrl && (
                    <div className="mt-6 aspect-video rounded-xl overflow-hidden shadow-md border border-slate-200">
                      <iframe
                        src={video.youtubeUrl.replace('watch?v=', 'embed/')}
                        title={video.title}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  )}
                </GlowCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Connect Card section */}
      <section className="py-24 relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="scale-in">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-white">
              <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 rounded-full filter blur-[100px] pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-slate-100 rounded-full filter blur-[100px] pointer-events-none"></div>
              
              <div className="relative z-10 px-6 py-16 md:p-20 text-center max-w-3xl mx-auto flex flex-col items-center">
                <span className="text-accent font-semibold tracking-widest text-xs uppercase bg-accent/5 px-3 py-1.5 rounded-md border border-accent/20">Get In Touch</span>
                <h2 className="text-3xl sm:text-5xl font-bold font-serif text-slate-900 mt-4 leading-tight">
                  Connect With Our Congregation
                </h2>
                <div className="h-[2px] w-12 bg-accent/50 my-4" />
                <p className="text-slate-600 mt-2 mb-8 text-sm sm:text-base md:text-lg font-light leading-relaxed">
                  Have questions about our schedule, service timings, or want to participate in our holy worship? We welcome all visitors and seekers.
                </p>
                <Link 
                  to="/contact" 
                  className="inline-block bg-gradient-to-r from-accent-dark to-accent hover:from-accent hover:to-accent-light text-primary-dark font-bold px-10 py-4 rounded-full uppercase tracking-widest text-xs transition-all duration-300 shadow-xl shadow-accent/20 text-slate-900"
                >
                  Connect Now
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
