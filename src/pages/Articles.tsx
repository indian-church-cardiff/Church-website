import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import ScrollReveal from '../components/ScrollReveal';
import GlowCard from '../components/GlowCard';
import { BookOpen } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  category?: string;
  content: string;
  createdAt?: any;
}

export default function Articles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // Default fallback articles
  const defaultArticles: Article[] = [
    {
      id: 'def-art-1',
      title: 'Great Lent Prayer Malayalam',
      category: 'Prayers',
      content: 'The Great Lent is a sacred time of spiritual reflection, repentance, and renewal. In the Orthodox tradition, prayers are recited during this period to draw closer to God. These prayers, deeply rooted in apostolic traditions, guide us on our journey towards Resurrection Sunday. Lent involves fasting, charity, and intense prayers to discipline the flesh and focus our spirits on heavenly values.'
    }
  ];

  useEffect(() => {
    const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dbArticles = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Article[];
      setArticles(dbArticles);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching articles:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const displayArticles = articles.length > 0 ? articles : defaultArticles;

  return (
    <div className="min-h-screen mesh-bg pt-32 pb-24 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <ScrollReveal animation="fade-up" className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-accent font-semibold tracking-widest text-xs uppercase bg-accent/5 px-3 py-1.5 rounded-md border border-accent/20">Spiritual Readings</span>
          <h1 className="text-4xl sm:text-5xl font-serif text-slate-900 mt-4 font-bold leading-tight">Parish Articles</h1>
          <div className="h-1 w-16 bg-gradient-to-r from-accent to-accent-light mx-auto mt-4 mb-6"></div>
          <p className="text-slate-600 font-light leading-relaxed">
            Read spiritual guidelines, lent prayers, and study materials provided by our parish clergy.
          </p>
        </ScrollReveal>

        {loading && articles.length === 0 ? (
          <div className="flex justify-center py-10">
            <div className="h-8 w-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {displayArticles.map((article, idx) => (
              <ScrollReveal key={article.id} animation="fade-up" delay={idx * 100}>
                <GlowCard className="p-8 bg-white border border-slate-100 h-full flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-accent font-bold bg-accent/10 border border-accent/30 px-3 py-1 rounded-full uppercase tracking-widest font-sans">
                      {article.category || 'Spiritual'}
                    </span>
                    <h2 className="text-2xl font-serif font-bold text-slate-900 mt-4 mb-4">{article.title}</h2>
                    <p className="text-slate-600 leading-relaxed font-sans font-light whitespace-pre-line">
                      {article.content}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-8 text-xs text-accent font-bold cursor-pointer hover:underline">
                    <BookOpen className="h-4 w-4" />
                    <span>Read Full Content</span>
                  </div>
                </GlowCard>
              </ScrollReveal>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
