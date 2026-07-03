import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { Lock, Mail, ShieldAlert } from 'lucide-react';
import GlowCard from '../components/GlowCard';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect to admin dashboard if already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/admin');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (err: any) {
      console.error(err);
      setError('Invalid email credentials or unauthorized admin login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center px-4 relative overflow-hidden text-slate-800">
      {/* Light glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full filter blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-light/30 rounded-full filter blur-[120px] pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10">
        
        {/* Branding header */}
        <div className="text-center mb-8">
          <div className="relative inline-block hover:scale-105 transition-transform duration-500 mb-4 group">
            <div className="absolute -inset-1.5 rounded-full bg-accent/20 blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
            <img 
              src="/logo.jpg" 
              alt="St Gregorios Logo" 
              className="relative h-20 w-20 rounded-full border-2 border-accent object-cover mx-auto shadow-2xl" 
            />
          </div>
          <h2 className="text-2xl font-serif font-bold text-slate-900 tracking-wide">Parish Administration</h2>
          <p className="text-xs text-accent/80 font-sans mt-2 tracking-widest uppercase">Portal login configuration</p>
        </div>

        {/* Login Card */}
        <GlowCard className="p-8 bg-white border border-slate-200">
          {error && (
            <div className="flex gap-2.5 bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xl text-xs mb-6 font-sans">
              <ShieldAlert className="h-4.5 w-4.5 text-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-[10px] font-bold text-accent uppercase tracking-widest">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@stgregorioscardiff.org"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-250 rounded-xl focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-300 text-slate-800 text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-[10px] font-bold text-accent uppercase tracking-widest">Secret Key / Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <input
                  type="password"
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-250 rounded-xl focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-300 text-slate-800 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-accent-dark to-accent hover:from-accent hover:to-accent-light text-primary-dark font-bold py-3.5 rounded-xl uppercase tracking-widest text-[10px] transition-all duration-300 shadow-lg shadow-accent/20 disabled:opacity-50 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer text-slate-900"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </GlowCard>
      </div>
    </div>
  );
}
