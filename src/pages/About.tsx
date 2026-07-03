import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import ScrollReveal from '../components/ScrollReveal';
import GlowCard from '../components/GlowCard';
import SectionDivider from '../components/SectionDivider';

interface CommitteeMember {
  id: string;
  name: string;
  role: string;
  imageUrl?: string;
  displayOrder?: number;
}

export default function About() {
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'committee'), orderBy('displayOrder', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dbMembers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CommitteeMember[];
      setMembers(dbMembers);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching committee members:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen mesh-bg pt-32 pb-24 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <ScrollReveal animation="fade-up" className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-accent font-semibold tracking-widest text-xs uppercase bg-accent/5 px-3 py-1.5 rounded-md border border-accent/20">About Our Church</span>
          <h1 className="text-4xl sm:text-5xl font-serif text-slate-900 mt-4 font-bold leading-tight">History & Mission</h1>
          <div className="h-1 w-16 bg-gradient-to-r from-accent to-accent-light mx-auto mt-4 mb-6"></div>
          <p className="text-slate-600 font-light leading-relaxed">
            Discover the heart of our faith community and our heritage within the Malankara Orthodox Syrian Church.
          </p>
        </ScrollReveal>

        {/* History Text Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          <ScrollReveal animation="slide-right" className="space-y-6">
            <h2 className="text-3xl font-serif font-bold text-slate-900">Our Heritage</h2>
            <p className="text-slate-650 leading-relaxed font-light">
              The <strong>Malankara Orthodox Syrian Church</strong> traces its origins to <strong>St. Thomas the Apostle</strong>, one of the twelve disciples of Jesus Christ, who brought the Gospel to India in <strong>A.D. 52</strong>. As one of the world's oldest Christian communities, the Church has faithfully preserved the apostolic faith through centuries of worship, prayer, and service.
            </p>
            <p className="text-slate-650 leading-relaxed font-light">
              From the fourth century onwards, the Indian Church developed a close relationship with the Persian (East Syrian) Church, from which it inherited the Syriac liturgical tradition and many aspects of its ancient worship. This rich spiritual heritage continues to shape the life and worship of the Malankara Orthodox Syrian Church today.
            </p>
          </ScrollReveal>
          <ScrollReveal animation="slide-left" className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-br from-accent/20 to-slate-100 rounded-2xl -rotate-2 -z-10"></div>
            <img 
              src="/church-image.jpg" 
              alt="Holy Liturgical Worship" 
              className="rounded-2xl shadow-xl w-full object-cover aspect-[4/3] border border-slate-200" 
            />
          </ScrollReveal>
        </div>

        <SectionDivider />

        {/* Pilgrimage details */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-200 mb-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 rounded-full filter blur-[100px] pointer-events-none"></div>
          <ScrollReveal animation="fade-up" className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-6">Our Congregation in Cardiff</h2>
            <p className="text-slate-750 text-base sm:text-lg leading-relaxed font-sans font-light">
              <strong>St. Gregorios Indian Orthodox Congregation, Cardiff</strong> is a part of the <strong>Malankara Orthodox Syrian Church</strong> under the <strong>Diocese of UK, Europe and Africa</strong>. Established to serve the growing Orthodox Christian community in South Wales, our congregation continues this unbroken apostolic tradition by celebrating the Holy Qurbana, nurturing faith, and serving the local community with love and compassion.
            </p>
          </ScrollReveal>
        </div>

        {/* Committee Section */}
        <ScrollReveal animation="fade-up" className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-accent font-semibold tracking-widest text-xs uppercase bg-accent/5 px-3 py-1.5 rounded-md border border-accent/20">Parish Leadership</span>
          <h2 className="text-3xl sm:text-4xl font-serif text-slate-900 mt-4 font-bold">Committee Members</h2>
          <div className="h-1 w-16 bg-gradient-to-r from-accent to-accent-light mx-auto mt-4 mb-6"></div>
          <p className="text-slate-650 font-light">
            Our team is committed to serving the congregation with care and compassion, promoting spiritual enrichment and community engagement.
          </p>
        </ScrollReveal>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="h-8 w-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : members.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {members.map((member, idx) => (
              <ScrollReveal key={member.id} animation="fade-up" delay={idx * 50}>
                <GlowCard className="p-6 text-center bg-white border border-slate-100 h-full flex flex-col items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center text-accent text-3xl font-bold font-serif mb-4 shadow-inner overflow-hidden">
                    {member.imageUrl ? (
                      <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      member.name.charAt(0)
                    )}
                  </div>
                  <h3 className="text-base font-serif font-bold text-slate-900 leading-tight">{member.name}</h3>
                  <p className="text-xs text-accent font-semibold tracking-wider uppercase mt-1">{member.role}</p>
                </GlowCard>
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500 font-light">
            No committee members currently listed. Leadership information will be updated soon.
          </div>
        )}

      </div>
    </div>
  );
}
