import ScrollReveal from '../components/ScrollReveal';
import GlowCard from '../components/GlowCard';
import { Calendar, BookOpen, Users, Heart } from 'lucide-react';

export default function Services() {
  return (
    <div className="min-h-screen mesh-bg pt-32 pb-24 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <ScrollReveal animation="fade-up" className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-accent font-semibold tracking-widest text-xs uppercase bg-accent/5 px-3 py-1.5 rounded-md border border-accent/20">Worship & Ministry</span>
          <h1 className="text-4xl sm:text-5xl font-serif text-slate-900 mt-4 font-bold leading-tight">Parish Services</h1>
          <div className="h-1 w-16 bg-gradient-to-r from-accent to-accent-light mx-auto mt-4 mb-6"></div>
          <p className="text-slate-600 font-light leading-relaxed">
            The life of our parish is expressed through Holy Services, faith formation, cultural fellowship, and active ministries.
          </p>
        </ScrollReveal>

        {/* Liturgy & School Timings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <ScrollReveal animation="slide-right">
            <GlowCard className="p-8 bg-white border border-slate-100 h-full flex flex-col justify-between">
              <div>
                <div className="p-3 bg-accent/5 rounded-xl border border-accent/20 inline-block text-accent mb-6">
                  <Calendar className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4">Holy Services (Holy Qurbana)</h2>
                <p className="text-slate-600 leading-relaxed font-light mb-6">
                  The Holy Qurbana is celebrated with deep reverence and liturgical devotion. We welcome all faithful and visitors to join us in prayer.
                </p>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="block text-xs uppercase tracking-wider font-bold text-slate-550 mb-1">Service Timing</span>
                <span className="text-lg font-serif font-bold text-accent">Sunday: 8:30 am – 11:30 am</span>
              </div>
            </GlowCard>
          </ScrollReveal>

          <ScrollReveal animation="slide-left">
            <GlowCard className="p-8 bg-white border border-slate-100 h-full flex flex-col justify-between">
              <div>
                <div className="p-3 bg-accent/5 rounded-xl border border-accent/20 inline-block text-accent mb-6">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4">Sunday School</h2>
                <p className="text-slate-600 leading-relaxed font-light mb-6">
                  Our educational programs provide children with a firm platform for deepening their understanding of Orthodox Christianity.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="block text-xs uppercase tracking-wider font-bold text-slate-550 mb-1">Timing</span>
                  <span className="text-lg font-serif font-bold text-accent">Sunday: 11:30 am – 12:30 pm</span>
                </div>
                <div className="flex gap-4 text-xs">
                  <a 
                    href="https://talmido.org/index.php?title=Main_Page" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-accent hover:underline font-bold"
                  >
                    Visit Talmido Portal &rarr;
                  </a>
                  <a 
                    href="https://indianorthodoxuk.org/sunday-school-books" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-accent hover:underline font-bold"
                  >
                    Sunday School Books &rarr;
                  </a>
                </div>
              </div>
            </GlowCard>
          </ScrollReveal>
        </div>

        {/* Wings - MMVS & OCYM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ScrollReveal animation="fade-up">
            <GlowCard className="p-8 bg-white border border-slate-100 h-full">
              <div className="p-3 bg-accent/5 rounded-xl border border-accent/20 inline-block text-accent mb-6">
                <Heart className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4">Marth Mariam Vanitha Samajam (MMVS)</h2>
              <p className="text-slate-600 leading-relaxed font-light">
                Marth Mariam Vanitha Samajam (MMVS) is the women's wing of the Indian Orthodox Church, dedicated to the spiritual growth and fellowship of women. Founded in 1928 under the patronage of the Blessed Virgin Mary, the organization encourages faith, service, and active participation in the life of the Church.
              </p>
            </GlowCard>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={200}>
            <GlowCard className="p-8 bg-white border border-slate-100 h-full">
              <div className="p-3 bg-accent/5 rounded-xl border border-accent/20 inline-block text-accent mb-6">
                <Users className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4">Orthodox Christian Youth Movement (OCYM)</h2>
              <p className="text-slate-600 leading-relaxed font-light">
                OCYM is the youth wing of the Malankara Orthodox Syrian Church, guiding young people in faith, fellowship, and service. It nurtures youth through the threefold path of worship, study, and service, encouraging active participation in the Church and society. Through spiritual formation, OCYM helps shape responsible Christian leaders.
              </p>
            </GlowCard>
          </ScrollReveal>
        </div>

      </div>
    </div>
  );
}
