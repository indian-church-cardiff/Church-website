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

  // Default fallback committee members
  const defaultMembers: CommitteeMember[] = [
    { id: 'def-1', name: 'Fr. Ranju Skaria', role: 'Vicar' },
    { id: 'def-2', name: 'Mr. Jiby Varghese', role: 'Trustee' },
    { id: 'def-3', name: 'Mr. Josemon', role: 'Secretary' },
    { id: 'def-4', name: 'Alex Mamman', role: 'MC Member' },
    { id: 'def-5', name: 'Jimson George', role: 'MC Member' },
    { id: 'def-6', name: 'Manoj Kurien', role: 'MC Member' },
    { id: 'def-7', name: 'Santhosh Matthew', role: 'MC Member' },
    { id: 'def-8', name: 'Mammen Kadavil', role: 'MC Member' },
    { id: 'def-9', name: 'Saiju Joy', role: 'MC Member' },
    { id: 'def-10', name: 'Cherian Thomas', role: 'MC Member' },
    { id: 'def-11', name: 'Ajesh Karikuzhiyil', role: 'Auditor' },
    { id: 'def-12', name: 'Jiju M Kunjachan', role: 'Auditor' },
  ];

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

  const displayMembers = members.length > 0 ? members : defaultMembers;

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
            <p className="text-slate-600 leading-relaxed font-light">
              The Malankara Orthodox Syrian Church was founded by St. Thomas, one of the twelve apostles of Jesus Christ, who came to India in A.D. 52. At least from the fourth century, the Indian Church entered into a close relationship with the Persian or East Syrian Church.
            </p>
            <p className="text-slate-600 leading-relaxed font-light">
              From the Persians, the Indians inherited the East Syrian language and liturgies, and gradually came to be known as Syrian Christians. Today, we carry forward this rich apostolic tradition in South Wales.
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
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-6">A First in the United Kingdom</h2>
            <p className="text-slate-750 text-base sm:text-lg leading-relaxed font-sans font-light">
              We are honored to be the first pilgrimage church established in honor of the Holy Innocents in the United Kingdom for the Malankara Orthodox Syrian Church (Indian Orthodox Church) in South Wales.
            </p>
            <p className="text-slate-750 text-base sm:text-lg leading-relaxed font-sans font-light mt-4">
              We are a Parish in the Diocese of United Kingdom, Europe, and Africa under the pastoral authority of Metropolitan Abraham Mar Stéphanos. Let us give thanks to God!
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

        {loading && members.length === 0 ? (
          <div className="flex justify-center py-10">
            <div className="h-8 w-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayMembers.map((member, idx) => (
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
        )}

      </div>
    </div>
  );
}
