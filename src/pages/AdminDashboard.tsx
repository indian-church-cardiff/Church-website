import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db, storage } from '../firebase/config';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { 
  LogOut, 
  Calendar, 
  Image as ImageIcon, 
  Inbox, 
  Plus, 
  Trash2, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  Users,
  BookOpen,
  Video
} from 'lucide-react';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt?: any;
}

interface Program {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
}

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  url: string;
}

interface CommitteeMember {
  id: string;
  name: string;
  role: string;
  imageUrl?: string;
  displayOrder?: number;
}

interface Article {
  id: string;
  title: string;
  category?: string;
  content: string;
}

interface VideoItem {
  id: string;
  title: string;
  description?: string;
  youtubeUrl: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'programs' | 'gallery' | 'inquiries' | 'committee' | 'articles' | 'videos'>('programs');

  // Programs State
  const [programs, setPrograms] = useState<Program[]>([]);
  const [progTitle, setProgTitle] = useState('');
  const [progDate, setProgDate] = useState('');
  const [progTime, setProgTime] = useState('');
  const [progDesc, setProgDesc] = useState('');
  const [progSubmitting, setProgSubmitting] = useState(false);

  // Gallery State
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState('');
  const [imgTitle, setImgTitle] = useState('');
  const [imgCategory, setImgCategory] = useState<'worship' | 'community' | 'ocym'>('worship');
  const [imgDesc, setImgDesc] = useState('');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // Inquiries State
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  // Committee State
  const [committee, setCommittee] = useState<CommitteeMember[]>([]);
  const [memberName, setMemberName] = useState('');
  const [memberRole, setMemberRole] = useState('');
  const [memberFile, setMemberFile] = useState<File | null>(null);
  const [memberUrl, setMemberUrl] = useState('');
  const [memberOrder, setMemberOrder] = useState('1');
  const [memberProgress, setMemberProgress] = useState<number | null>(null);

  // Articles State
  const [articles, setArticles] = useState<Article[]>([]);
  const [artTitle, setArtTitle] = useState('');
  const [artCategory, setArtCategory] = useState('Prayers');
  const [artContent, setArtContent] = useState('');
  const [artSubmitting, setArtSubmitting] = useState(false);

  // Videos State
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [vidTitle, setVidTitle] = useState('');
  const [vidDesc, setVidDesc] = useState('');
  const [vidUrl, setVidUrl] = useState('');
  const [vidSubmitting, setVidSubmitting] = useState(false);

  // Feedback notifications
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Real-time Firestore Listeners
  useEffect(() => {
    // 1. Programs Listener
    const qProg = query(collection(db, 'programs'), orderBy('date', 'asc'));
    const unsubProg = onSnapshot(qProg, (snapshot) => {
      const progs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Program[];
      setPrograms(progs);
    });

    // 2. Inquiries Listener
    const qInq = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
    const unsubInq = onSnapshot(qInq, (snapshot) => {
      const inqs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Inquiry[];
      setInquiries(inqs);
    });

    // 3. Gallery Items Listener
    const qGal = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    const unsubGal = onSnapshot(qGal, (snapshot) => {
      const gals = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GalleryItem[];
      setGalleryItems(gals);
    });

    // 4. Committee Members Listener
    const qComm = query(collection(db, 'committee'), orderBy('displayOrder', 'asc'));
    const unsubComm = onSnapshot(qComm, (snapshot) => {
      const comms = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CommitteeMember[];
      setCommittee(comms);
    });

    // 5. Articles Listener
    const qArt = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
    const unsubArt = onSnapshot(qArt, (snapshot) => {
      const arts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Article[];
      setArticles(arts);
    });

    // 6. Videos Listener
    const qVid = query(collection(db, 'videos'), orderBy('createdAt', 'desc'));
    const unsubVid = onSnapshot(qVid, (snapshot) => {
      const vids = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as VideoItem[];
      setVideos(vids);
    });

    return () => {
      unsubProg();
      unsubInq();
      unsubGal();
      unsubComm();
      unsubArt();
      unsubVid();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Add Monthly Program
  const handleAddProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!progTitle || !progDate || !progTime) return;
    setProgSubmitting(true);
    setFeedback(null);

    try {
      await addDoc(collection(db, 'programs'), {
        title: progTitle,
        date: progDate,
        time: progTime,
        description: progDesc,
        createdAt: serverTimestamp()
      });
      setProgTitle('');
      setProgDate('');
      setProgTime('');
      setProgDesc('');
      setFeedback({ type: 'success', message: 'Program event added successfully!' });
    } catch (err: any) {
      console.error(err);
      setFeedback({ type: 'error', message: 'Failed to add program event.' });
    } finally {
      setProgSubmitting(false);
    }
  };

  // Delete program
  const handleDeleteProgram = async (id: string) => {
    if (!window.confirm('Delete this monthly program?')) return;
    try {
      await deleteDoc(doc(db, 'programs', id));
      setFeedback({ type: 'success', message: 'Program deleted successfully.' });
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', message: 'Failed to delete program.' });
    }
  };

  // Handle Gallery Upload / URL Direct Save
  const handleUploadImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imgTitle) return;
    setFeedback(null);

    // If direct URL is entered, bypass Firebase Storage
    if (imgUrl.trim()) {
      try {
        await addDoc(collection(db, 'gallery'), {
          title: imgTitle,
          category: imgCategory,
          description: imgDesc,
          url: imgUrl.trim(),
          createdAt: serverTimestamp()
        });
        setImgFile(null);
        setImgTitle('');
        setImgDesc('');
        setImgUrl('');
        setFeedback({ type: 'success', message: 'Image published successfully via direct link!' });
      } catch (err) {
        console.error(err);
        setFeedback({ type: 'error', message: 'Database save failed.' });
      }
      return;
    }

    if (!imgFile) {
      setFeedback({ type: 'error', message: 'Please select an image file or provide a direct image URL.' });
      return;
    }

    setUploadProgress(0);

    try {
      // Create Storage Reference
      const storageRef = ref(storage, `gallery/${Date.now()}_${imgFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, imgFile);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(Math.round(progress));
        },
        (error) => {
          console.error('Upload state error:', error);
          setFeedback({ type: 'error', message: 'Storage upload failed. Please configure storage or use the direct image URL input.' });
          setUploadProgress(null);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          
          // Save metadata in Firestore
          await addDoc(collection(db, 'gallery'), {
            title: imgTitle,
            category: imgCategory,
            description: imgDesc,
            url: downloadUrl,
            createdAt: serverTimestamp()
          });

          setImgFile(null);
          setImgTitle('');
          setImgDesc('');
          setImgUrl('');
          setUploadProgress(null);
          setFeedback({ type: 'success', message: 'Image uploaded & published successfully!' });
        }
      );
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', message: 'Database save failed.' });
      setUploadProgress(null);
    }
  };

  // Delete Gallery Item
  const handleDeleteGallery = async (id: string) => {
    if (!window.confirm('Remove this photo from the gallery?')) return;
    try {
      await deleteDoc(doc(db, 'gallery', id));
      setFeedback({ type: 'success', message: 'Image removed from gallery.' });
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', message: 'Failed to remove gallery image.' });
    }
  };

  // Add Committee Member
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName || !memberRole) return;
    setFeedback(null);

    try {
      let downloadUrl = memberUrl.trim();

      // If no URL but file is chosen, upload to storage
      if (!downloadUrl && memberFile) {
        setMemberProgress(0);
        const storageRef = ref(storage, `committee/${Date.now()}_${memberFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, memberFile);

        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setMemberProgress(Math.round(progress));
            },
            (error) => {
              console.error(error);
              reject(error);
            },
            async () => {
              downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });
      }

      await addDoc(collection(db, 'committee'), {
        name: memberName,
        role: memberRole,
        imageUrl: downloadUrl || null,
        displayOrder: parseInt(memberOrder) || 1,
        createdAt: serverTimestamp(),
      });

      setMemberName('');
      setMemberRole('');
      setMemberFile(null);
      setMemberOrder('1');
      setMemberUrl('');
      setMemberProgress(null);
      setFeedback({ type: 'success', message: 'Committee member added successfully!' });
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', message: 'Failed to add committee member. Ensure rules are configured or use direct photo URL.' });
      setMemberProgress(null);
    }
  };

  // Delete Committee Member
  const handleDeleteMember = async (id: string) => {
    if (!window.confirm('Delete this committee member?')) return;
    try {
      await deleteDoc(doc(db, 'committee', id));
      setFeedback({ type: 'success', message: 'Committee member removed.' });
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', message: 'Failed to remove member.' });
    }
  };

  // Add Article
  const handleAddArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artTitle || !artContent) return;
    setArtSubmitting(true);
    setFeedback(null);

    try {
      await addDoc(collection(db, 'articles'), {
        title: artTitle,
        category: artCategory,
        content: artContent,
        createdAt: serverTimestamp()
      });

      setArtTitle('');
      setArtCategory('Prayers');
      setArtContent('');
      setFeedback({ type: 'success', message: 'Article posted successfully!' });
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', message: 'Failed to add article.' });
    } finally {
      setArtSubmitting(false);
    }
  };

  // Delete Article
  const handleDeleteArticle = async (id: string) => {
    if (!window.confirm('Delete this article?')) return;
    try {
      await deleteDoc(doc(db, 'articles', id));
      setFeedback({ type: 'success', message: 'Article deleted.' });
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', message: 'Failed to delete article.' });
    }
  };

  // Add Video
  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vidTitle || !vidUrl) return;
    setVidSubmitting(true);
    setFeedback(null);

    try {
      await addDoc(collection(db, 'videos'), {
        title: vidTitle,
        description: vidDesc,
        youtubeUrl: vidUrl,
        createdAt: serverTimestamp()
      });

      setVidTitle('');
      setVidDesc('');
      setVidUrl('');
      setFeedback({ type: 'success', message: 'Video added successfully!' });
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', message: 'Failed to add video.' });
    } finally {
      setVidSubmitting(false);
    }
  };

  // Delete Video
  const handleDeleteVideo = async (id: string) => {
    if (!window.confirm('Remove this video?')) return;
    try {
      await deleteDoc(doc(db, 'videos', id));
      setFeedback({ type: 'success', message: 'Video removed.' });
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', message: 'Failed to remove video.' });
    }
  };

  // Delete Inquiry
  const handleDeleteInquiry = async (id: string) => {
    if (!window.confirm('Delete this inquiry message?')) return;
    try {
      await deleteDoc(doc(db, 'inquiries', id));
      setFeedback({ type: 'success', message: 'Message deleted.' });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pt-28 pb-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dashboard Header Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-950 border border-slate-800 rounded-3xl p-6 mb-10 shadow-xl">
          <div>
            <h1 className="text-3xl font-bold font-serif text-white tracking-wide">Parish Control Center</h1>
            <p className="text-sm text-slate-400 mt-1">Manage Holy Innocents Church content dynamically</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 bg-slate-900 border border-slate-850 hover:bg-slate-800 text-white font-bold px-5 py-3 rounded-full text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>

        {/* Global Notifications */}
        {feedback && (
          <div className={`flex gap-3 border p-4 rounded-xl mb-8 text-sm ${
            feedback.type === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}>
            {feedback.type === 'success' ? <CheckCircle className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Tabs Control */}
        <div className="flex border-b border-slate-800 mb-8 overflow-x-auto gap-2">
          {[
            { id: 'programs', label: 'Programs', icon: <Calendar className="h-4 w-4" /> },
            { id: 'gallery', label: 'Gallery', icon: <ImageIcon className="h-4 w-4" /> },
            { id: 'committee', label: 'Committee', icon: <Users className="h-4 w-4" /> },
            { id: 'articles', label: 'Articles & Prayers', icon: <BookOpen className="h-4 w-4" /> },
            { id: 'videos', label: 'Videos & Songs', icon: <Video className="h-4 w-4" /> },
            { id: 'inquiries', label: `Inquiries (${inquiries.length})`, icon: <Inbox className="h-4 w-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); setFeedback(null); }}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 font-semibold tracking-wider text-[10px] uppercase transition-colors shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? 'border-accent text-accent'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab contents */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Tabs Logic */}
          {activeTab === 'programs' && (
            <>
              {/* Add form */}
              <div className="bg-slate-955 bg-slate-955/60 border border-slate-800 p-8 rounded-3xl lg:col-span-1 h-fit shadow-lg">
                <h2 className="text-xl font-serif font-bold text-white mb-6 flex items-center gap-2">
                  <Plus className="h-5 w-5 text-accent" />
                  Add Monthly Event
                </h2>
                <form onSubmit={handleAddProgram} className="space-y-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Event Title *</label>
                    <input
                      type="text"
                      required
                      value={progTitle}
                      onChange={(e) => setProgTitle(e.target.value)}
                      placeholder="e.g. Holy Qurbana Celebration"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-accent text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date *</label>
                      <input
                        type="date"
                        required
                        value={progDate}
                        onChange={(e) => setProgDate(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-accent text-sm text-slate-350"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Time *</label>
                      <input
                        type="text"
                        required
                        value={progTime}
                        onChange={(e) => setProgTime(e.target.value)}
                        placeholder="e.g. 08:30 AM - 11:30 AM"
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-accent text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description</label>
                    <textarea
                      rows={3}
                      value={progDesc}
                      onChange={(e) => setProgDesc(e.target.value)}
                      placeholder="Special note, MMVS details, etc."
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-accent text-sm resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={progSubmitting}
                    className="w-full bg-accent hover:bg-accent-light text-primary-dark font-bold py-3 rounded-xl uppercase tracking-widest text-[10px] transition-all shadow-md shadow-accent/10 cursor-pointer"
                  >
                    {progSubmitting ? 'Saving...' : 'Add Program'}
                  </button>
                </form>
              </div>

              {/* List */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-xl font-serif font-bold text-white mb-6">Scheduled Programs</h2>
                {programs.length === 0 ? (
                  <div className="bg-slate-950/20 border border-dashed border-slate-800 p-12 text-center rounded-3xl">
                    <Calendar className="h-10 w-10 text-slate-700 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">No scheduled events found.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {programs.map((item) => (
                      <div key={item.id} className="bg-slate-955 bg-slate-950/40 border border-slate-800 p-5 rounded-2xl flex justify-between items-center gap-4 hover:border-slate-700 transition-colors">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-accent font-semibold bg-accent/5 border border-accent/10 px-2 py-0.5 rounded">
                              {new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                            <span className="text-xs text-slate-400 font-medium bg-slate-800 px-2 py-0.5 rounded">{item.time}</span>
                          </div>
                          <h3 className="text-lg font-serif font-bold text-white mt-2">{item.title}</h3>
                          {item.description && <p className="text-xs text-slate-455 mt-1 leading-relaxed">{item.description}</p>}
                        </div>
                        <button
                          onClick={() => handleDeleteProgram(item.id)}
                          className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-350 hover:bg-rose-500/20 rounded-xl transition-colors shrink-0 cursor-pointer"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'gallery' && (
            <>
              {/* Photo uploader */}
              <div className="bg-slate-955 bg-slate-955/60 border border-slate-800 p-8 rounded-3xl lg:col-span-1 h-fit shadow-lg">
                <h2 className="text-xl font-serif font-bold text-white mb-6 flex items-center gap-2">
                  <Upload className="h-5 w-5 text-accent" />
                  Upload Photo
                </h2>
                <form onSubmit={handleUploadImage} className="space-y-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Select Image File</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImgFile(e.target.files ? e.target.files[0] : null)}
                      className="w-full text-sm text-slate-450 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-accent/10 file:text-accent file:hover:bg-accent/20 cursor-pointer"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Or Paste Image URL directly</label>
                    <input
                      type="text"
                      value={imgUrl}
                      onChange={(e) => setImgUrl(e.target.value)}
                      placeholder="https://example.com/photo.jpg"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-accent text-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Photo Title *</label>
                    <input
                      type="text"
                      required
                      value={imgTitle}
                      onChange={(e) => setImgTitle(e.target.value)}
                      placeholder="e.g. Parish Feast Day"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-accent text-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Category *</label>
                    <select
                      value={imgCategory}
                      onChange={(e) => setImgCategory(e.target.value as any)}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-accent text-sm text-slate-300"
                    >
                      <option value="worship">Worship</option>
                      <option value="community">Community</option>
                      <option value="ocym">OCYM</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Short Caption</label>
                    <textarea
                      rows={2}
                      value={imgDesc}
                      onChange={(e) => setImgDesc(e.target.value)}
                      placeholder="Describe this gallery photo..."
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-accent text-sm resize-none"
                    ></textarea>
                  </div>

                  {uploadProgress !== null && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold text-slate-400">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-accent h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={uploadProgress !== null}
                    className="w-full bg-accent hover:bg-accent-light text-primary-dark font-bold py-3 rounded-xl uppercase tracking-widest text-[10px] transition-all shadow-md shadow-accent/10 disabled:opacity-50 cursor-pointer"
                  >
                    Publish Photo
                  </button>
                </form>
              </div>

              {/* Library */}
              <div className="lg:col-span-2">
                <h2 className="text-xl font-serif font-bold text-white mb-6">Gallery Media Library</h2>
                {galleryItems.length === 0 ? (
                  <div className="bg-slate-955 bg-slate-950/20 border border-dashed border-slate-800 p-12 text-center rounded-3xl">
                    <ImageIcon className="h-10 w-10 text-slate-700 mx-auto mb-3" />
                    <p className="text-slate-550 text-sm">No photos uploaded.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {galleryItems.map((item) => (
                      <div key={item.id} className="bg-slate-950/40 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-colors flex flex-col justify-between">
                        <div className="relative aspect-[16/9] w-full bg-slate-900">
                          <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                          <span className="absolute top-3 left-3 text-[9px] bg-slate-950/80 text-accent font-bold px-2 py-0.5 rounded border border-slate-800 uppercase tracking-widest">
                            {item.category}
                          </span>
                        </div>
                        <div className="p-4 flex items-center justify-between gap-4">
                          <h4 className="text-sm font-semibold text-white truncate max-w-xs">{item.title}</h4>
                          <button
                            onClick={() => handleDeleteGallery(item.id)}
                            className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-350 hover:bg-rose-500/20 rounded-lg transition-colors shrink-0 cursor-pointer"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'committee' && (
            <>
              {/* Committee Form */}
              <div className="bg-slate-955 bg-slate-955/60 border border-slate-800 p-8 rounded-3xl lg:col-span-1 h-fit shadow-lg">
                <h2 className="text-xl font-serif font-bold text-white mb-6 flex items-center gap-2">
                  <Plus className="h-5 w-5 text-accent" />
                  Add Member
                </h2>
                <form onSubmit={handleAddMember} className="space-y-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={memberName}
                      onChange={(e) => setMemberName(e.target.value)}
                      placeholder="e.g. Fr. Ranju Skaria"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-accent text-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Role/Title *</label>
                    <input
                      type="text"
                      required
                      value={memberRole}
                      onChange={(e) => setMemberRole(e.target.value)}
                      placeholder="e.g. Vicar / Trustee"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-accent text-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Display Order (1-20)</label>
                    <input
                      type="number"
                      value={memberOrder}
                      onChange={(e) => setMemberOrder(e.target.value)}
                      placeholder="1"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-accent text-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Select Photo File</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setMemberFile(e.target.files ? e.target.files[0] : null)}
                      className="w-full text-sm text-slate-450 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-accent/10 file:text-accent file:hover:bg-accent/20 cursor-pointer"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Or Paste Photo URL directly</label>
                    <input
                      type="text"
                      value={memberUrl}
                      onChange={(e) => setMemberUrl(e.target.value)}
                      placeholder="https://example.com/avatar.jpg"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-accent text-sm"
                    />
                  </div>

                  {memberProgress !== null && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold text-slate-400">
                        <span>Uploading photo...</span>
                        <span>{memberProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-accent h-full transition-all duration-300" style={{ width: `${memberProgress}%` }}></div>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={memberProgress !== null}
                    className="w-full bg-accent hover:bg-accent-light text-primary-dark font-bold py-3 rounded-xl uppercase tracking-widest text-[10px] transition-all shadow-md shadow-accent/10 disabled:opacity-50 cursor-pointer"
                  >
                    Add Member
                  </button>
                </form>
              </div>

              {/* Committee List */}
              <div className="lg:col-span-2">
                <h2 className="text-xl font-serif font-bold text-white mb-6">Current Parish Committee</h2>
                {committee.length === 0 ? (
                  <div className="bg-slate-955 bg-slate-950/20 border border-dashed border-slate-800 p-8 rounded-3xl text-center text-slate-550 font-light">
                    Currently displaying default hardcoded members. Add a member above to configure a custom list.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {committee.map((item) => (
                      <div key={item.id} className="bg-slate-950/40 border border-slate-800 p-4 rounded-2xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center font-bold text-accent overflow-hidden shrink-0">
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              item.name.charAt(0)
                            )}
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-white leading-tight">{item.name}</h4>
                            <p className="text-xs text-accent font-semibold tracking-wider uppercase mt-1">{item.role}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteMember(item.id)}
                          className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-350 hover:bg-rose-500/20 rounded-xl transition-colors shrink-0 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'articles' && (
            <>
              {/* Article Form */}
              <div className="bg-slate-955 bg-slate-955/60 border border-slate-800 p-8 rounded-3xl lg:col-span-1 h-fit shadow-lg">
                <h2 className="text-xl font-serif font-bold text-white mb-6 flex items-center gap-2">
                  <Plus className="h-5 w-5 text-accent" />
                  Post Article
                </h2>
                <form onSubmit={handleAddArticle} className="space-y-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Title *</label>
                    <input
                      type="text"
                      required
                      value={artTitle}
                      onChange={(e) => setArtTitle(e.target.value)}
                      placeholder="e.g. Great Lent Prayer Malayalam"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-accent text-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Category *</label>
                    <input
                      type="text"
                      required
                      value={artCategory}
                      onChange={(e) => setArtCategory(e.target.value)}
                      placeholder="e.g. Prayers / Teachings"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-accent text-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Content *</label>
                    <textarea
                      rows={5}
                      required
                      value={artContent}
                      onChange={(e) => setArtContent(e.target.value)}
                      placeholder="Write spiritual reflection or prayer details..."
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-accent text-sm resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={artSubmitting}
                    className="w-full bg-accent hover:bg-accent-light text-primary-dark font-bold py-3 rounded-xl uppercase tracking-widest text-[10px] transition-all shadow-md shadow-accent/10 disabled:opacity-50 cursor-pointer"
                  >
                    {artSubmitting ? 'Posting...' : 'Post Article'}
                  </button>
                </form>
              </div>

              {/* Article List */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-xl font-serif font-bold text-white mb-6">Spiritual Articles</h2>
                {articles.length === 0 ? (
                  <div className="bg-slate-955 bg-slate-950/20 border border-dashed border-slate-800 p-8 text-center text-slate-550 font-light rounded-2xl">
                    Currently displaying fallback Lent article. Post a new article to override.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {articles.map((item) => (
                      <div key={item.id} className="bg-slate-950/40 border border-slate-800 p-5 rounded-2xl flex justify-between items-start gap-4">
                        <div className="flex-grow">
                          <span className="text-[9px] bg-accent/10 text-accent font-bold px-2.5 py-0.5 rounded border border-accent/20 tracking-wider uppercase font-sans">
                            {item.category || 'General'}
                          </span>
                          <h3 className="text-lg font-serif font-bold text-white mt-3">{item.title}</h3>
                          <p className="text-xs text-slate-400 mt-2 font-sans line-clamp-3 leading-relaxed whitespace-pre-line">{item.content}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteArticle(item.id)}
                          className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-350 hover:bg-rose-500/20 rounded-xl transition-colors shrink-0 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'videos' && (
            <>
              {/* Video Form */}
              <div className="bg-slate-955 bg-slate-955/60 border border-slate-800 p-8 rounded-3xl lg:col-span-1 h-fit shadow-lg">
                <h2 className="text-xl font-serif font-bold text-white mb-6 flex items-center gap-2">
                  <Plus className="h-5 w-5 text-accent" />
                  Add Video / Song
                </h2>
                <form onSubmit={handleAddVideo} className="space-y-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Video Title *</label>
                    <input
                      type="text"
                      required
                      value={vidTitle}
                      onChange={(e) => setVidTitle(e.target.value)}
                      placeholder="e.g. HIIOPC Choir MMVS Song"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-accent text-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">YouTube URL or Embed ID *</label>
                    <input
                      type="text"
                      required
                      value={vidUrl}
                      onChange={(e) => setVidUrl(e.target.value)}
                      placeholder="e.g. https://www.youtube.com/watch?v=xxxxxx"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-accent text-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description</label>
                    <textarea
                      rows={2}
                      value={vidDesc}
                      onChange={(e) => setVidDesc(e.target.value)}
                      placeholder="Choir list, lyrics credits, etc."
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-accent text-sm resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={vidSubmitting}
                    className="w-full bg-accent hover:bg-accent-light text-primary-dark font-bold py-3 rounded-xl uppercase tracking-widest text-[10px] transition-all shadow-md shadow-accent/10 disabled:opacity-50 cursor-pointer"
                  >
                    {vidSubmitting ? 'Saving...' : 'Add Video'}
                  </button>
                </form>
              </div>

              {/* Video List */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-xl font-serif font-bold text-white mb-6">Parish Videos & Audio Choir Songs</h2>
                {videos.length === 0 ? (
                  <div className="bg-slate-950/20 border border-dashed border-slate-800 p-12 text-center rounded-3xl">
                    <Video className="h-10 w-10 text-slate-700 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">No videos configured. Please add one above.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {videos.map((item) => (
                      <div key={item.id} className="bg-slate-955 bg-slate-950/40 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between gap-4">
                        <div>
                          <h4 className="text-sm font-semibold text-white leading-tight">{item.title}</h4>
                          <p className="text-xs text-slate-455 mt-1 truncate">{item.youtubeUrl}</p>
                          {item.description && <p className="text-xs text-slate-400 font-sans mt-2 line-clamp-2 leading-relaxed">{item.description}</p>}
                        </div>
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleDeleteVideo(item.id)}
                            className="p-2 bg-rose-500/10 border border-rose-500/20 text-rose-350 hover:bg-rose-500/20 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'inquiries' && (
            <div className="lg:col-span-3 space-y-4">
              <h2 className="text-xl font-serif font-bold text-white mb-6">Received Contact Inquiries</h2>
              {inquiries.length === 0 ? (
                <div className="bg-slate-955 bg-slate-950/20 border border-dashed border-slate-800 p-12 text-center rounded-3xl max-w-xl mx-auto">
                  <Inbox className="h-10 w-10 text-slate-700 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm">Inbox clean! There are no messages from the website visitors.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {inquiries.map((inq) => (
                    <div key={inq.id} className="bg-slate-955 bg-slate-950/40 border border-slate-800 p-6 rounded-3xl flex flex-col justify-between gap-4">
                      <div>
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h3 className="font-serif font-bold text-white text-lg">{inq.name}</h3>
                            <p className="text-xs text-accent mt-0.5">{inq.email} {inq.phone ? `| ${inq.phone}` : ''}</p>
                          </div>
                          <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded font-medium font-sans">
                            {inq.createdAt?.toDate ? new Date(inq.createdAt.toDate()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeStyle: 'short' } as any) : 'Just now'}
                          </span>
                        </div>
                        <p className="text-sm text-slate-350 font-sans mt-4 leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-slate-800 whitespace-pre-wrap">
                          {inq.message}
                        </p>
                      </div>
                      <div className="flex justify-end pt-2">
                        <button
                          onClick={() => handleDeleteInquiry(inq.id)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-rose-500/10 border border-rose-500/20 text-rose-350 hover:bg-rose-500/20 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete Message
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
