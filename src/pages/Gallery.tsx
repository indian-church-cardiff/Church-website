import { useState, useEffect } from 'react';
import { Camera, Eye, X } from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import ScrollReveal from '../components/ScrollReveal';

interface ImageItem {
  id: string;
  src: string;
  category: 'worship' | 'community' | 'ocym';
  title: string;
  description: string;
}

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'worship' | 'community' | 'ocym'>('all');
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [dbImages, setDbImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Core fallback images to ensure page is always visually full
  const defaultImages: ImageItem[] = [
    {
      id: 'default-1',
      src: '/church-image.jpg',
      category: 'community',
      title: 'Parish Gathering',
      description: 'St Gregorios congregation members together in fellowship'
    },
    {
      id: 'default-2',
      src: '/church-image.jpg',
      category: 'worship',
      title: 'Holy Qurbana Devotion',
      description: 'Moments of sacred worship and liturgy during holy service'
    },
    {
      id: 'default-3',
      src: '/logo.jpg',
      category: 'worship',
      title: 'Parish Emblem',
      description: 'Official emblem of St Gregorios Indian Orthodox Church'
    },
  ];

  // Fetch gallery items from Firestore in real-time
  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          src: data.url,
          category: data.category || 'worship',
          title: data.title || 'Parish Memory',
          description: data.description || ''
        };
      }) as ImageItem[];
      setDbImages(items);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching gallery:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Merge Firestore uploaded photos first, followed by default photos
  const allImages = [...dbImages, ...defaultImages];

  const filteredImages = activeFilter === 'all' 
    ? allImages 
    : allImages.filter(img => img.category === activeFilter);

  const filters = [
    { value: 'all', label: 'All Photos' },
    { value: 'worship', label: 'Worship' },
    { value: 'community', label: 'Community' },
    { value: 'ocym', label: 'OCYM' },
  ];

  return (
    <div className="min-h-screen mesh-bg pt-32 pb-24 text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <ScrollReveal animation="fade-up" className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-accent font-semibold tracking-widest text-xs uppercase bg-accent/5 px-3 py-1.5 rounded-md border border-accent/20">Parish Media</span>
          <h1 className="text-4xl sm:text-5xl font-serif text-white mt-4 font-bold leading-tight">Moments of Faith</h1>
          <div className="h-1 w-16 bg-gradient-to-r from-accent to-accent-light mx-auto mt-4 mb-6"></div>
          <p className="text-slate-400 font-light leading-relaxed">
            A visual documentation of our prayers, spiritual gatherings, feast days, and OCYM activities in Cardiff, Wales.
          </p>
        </ScrollReveal>

        {/* Filter Navigation */}
        <ScrollReveal animation="fade-in" className="flex flex-wrap justify-center gap-3 mb-16">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value as any)}
              className={`px-6 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 border ${
                activeFilter === filter.value
                  ? 'bg-gradient-to-r from-accent-dark to-accent border-accent text-primary-dark shadow-[0_4px_15px_rgba(214,175,55,0.25)]'
                  : 'bg-primary-light/20 border-white/5 text-slate-350 hover:border-accent/40'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </ScrollReveal>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-12 w-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 text-xs mt-4 uppercase tracking-widest">Loading gallery items...</p>
          </div>
        ) : (
          /* Gallery Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredImages.map((image, index) => (
              <ScrollReveal 
                key={image.id}
                animation="scale-in"
                delay={index * 100}
                className="group cursor-pointer flex flex-col h-full rounded-2xl overflow-hidden border border-white/5 bg-primary-light/10 backdrop-blur-sm hover:border-accent/20 transition-all duration-500 shadow-xl"
              >
                <div 
                  className="relative overflow-hidden aspect-[4/3] bg-primary-dark"
                  onClick={() => setSelectedImage(image)}
                >
                  <img 
                    src={image.src} 
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-primary-dark/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <div className="p-3 bg-accent/15 backdrop-blur-md rounded-full text-accent border border-accent/30 shadow-[0_0_15px_rgba(214,175,55,0.2)]">
                      <Eye className="h-5 w-5" />
                    </div>
                  </div>
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-bold text-accent uppercase tracking-widest bg-accent/10 border border-accent/30 px-2.5 py-1 rounded">
                      {image.category}
                    </span>
                    <h3 className="text-lg font-serif font-bold text-white mt-4 mb-2 group-hover:text-accent transition-colors duration-300">{image.title}</h3>
                  </div>
                  {image.description && (
                    <p className="text-sm text-slate-400 leading-relaxed font-sans font-light mt-2">{image.description}</p>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredImages.length === 0 && (
          <ScrollReveal animation="scale-in">
            <div className="text-center py-20 bg-primary-light/10 rounded-2xl border border-dashed border-accent/20 max-w-lg mx-auto glass">
              <Camera className="h-12 w-12 text-accent/60 mx-auto mb-4" />
              <h3 className="text-lg font-serif text-white font-semibold">No Photos Found</h3>
              <p className="text-sm text-slate-450 max-w-xs mx-auto mt-2 font-light">
                There are currently no photos in the "{activeFilter}" category. Please check back later.
              </p>
            </div>
          </ScrollReveal>
        )}

        {/* Lightbox Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 z-50 bg-[#03050a]/95 backdrop-blur-xl flex items-center justify-center p-4 transition-all duration-300"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 text-white/70 hover:text-accent p-2 hover:bg-white/5 rounded-full transition-colors"
            >
              <X className="h-8 w-8" />
            </button>
            <div 
              className="max-w-4xl w-full flex flex-col gap-6 animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border border-white/10 bg-primary-dark">
                <img 
                  src={selectedImage.src} 
                  alt={selectedImage.title}
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="px-2">
                <span className="text-[10px] font-bold text-accent uppercase tracking-widest bg-accent/10 border border-accent/30 px-3 py-1 rounded">
                  {selectedImage.category}
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-4">{selectedImage.title}</h3>
                {selectedImage.description && (
                  <p className="text-sm sm:text-base text-slate-400 mt-2 font-sans font-light leading-relaxed">{selectedImage.description}</p>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
