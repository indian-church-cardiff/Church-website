import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle, ShieldAlert } from 'lucide-react';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import ScrollReveal from '../components/ScrollReveal';
import GlowCard from '../components/GlowCard';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Save contact inquiry directly into Firestore
      await addDoc(collection(db, 'inquiries'), {
        name,
        email,
        phone,
        message,
        createdAt: serverTimestamp(),
      });

      setSubmitStatus('success');
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6 text-accent" />,
      title: 'Phone Number',
      detail: '01639 697330',
      href: 'tel:01639697330',
    },
    {
      icon: <Mail className="h-6 w-6 text-accent" />,
      title: 'Email Address',
      detail: 'hiiocwales@gmail.com',
      href: 'mailto:hiiocwales@gmail.com',
    },
    {
      icon: <MapPin className="h-6 w-6 text-accent" />,
      title: 'Location / Chapel',
      detail: 'Graig road, Briton Ferry, Neath, Wales, UK, SA11 2YY',
      href: 'https://maps.google.com/?q=Graig+road+Briton+Ferry+Neath+Wales+UK+SA11+2YY',
    },
  ];

  return (
    <div className="min-h-screen mesh-bg pt-32 pb-24 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <ScrollReveal animation="fade-up" className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-accent font-semibold tracking-widest text-xs uppercase bg-accent/5 px-3 py-1.5 rounded-md border border-accent/20">Get in Touch</span>
          <h1 className="text-4xl sm:text-5xl font-serif text-slate-900 mt-4 font-bold leading-tight">Connect With Us</h1>
          <div className="h-1 w-16 bg-gradient-to-r from-accent to-accent-light mx-auto mt-4 mb-6"></div>
          <p className="text-slate-600 font-light leading-relaxed">
            Have questions about our spiritual administration, holy liturgy timings, or want to schedule pastoral assistance? Reach out to us.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* Contact Details List */}
          <div className="space-y-6 lg:col-span-1">
            {contactInfo.map((info, index) => (
              <ScrollReveal key={index} animation="slide-right" delay={index * 150}>
                <a 
                  href={info.href}
                  target={info.title.includes('Location') ? '_blank' : undefined}
                  rel={info.title.includes('Location') ? 'noreferrer' : undefined}
                  className="block group"
                >
                  <GlowCard className="p-6 bg-white border border-slate-100">
                    <div className="flex gap-4">
                      <div className="p-3.5 bg-accent/5 rounded-xl group-hover:bg-accent/15 border border-accent/10 transition-all duration-300 shrink-0">
                        {info.icon}
                      </div>
                      <div>
                        <h3 className="text-[10px] font-bold text-accent uppercase tracking-widest font-sans">{info.title}</h3>
                        <p className="text-sm sm:text-base font-medium text-slate-800 mt-2 font-sans group-hover:text-accent transition-colors duration-300 leading-relaxed font-light">
                          {info.detail}
                        </p>
                      </div>
                    </div>
                  </GlowCard>
                </a>
              </ScrollReveal>
            ))}
          </div>

          {/* Contact Form */}
          <ScrollReveal animation="slide-left" className="lg:col-span-2">
            <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-xl glass">
              <h2 className="text-2xl font-serif font-bold text-slate-900 mb-6">Send us a Message</h2>

              {submitStatus === 'success' && (
                <ScrollReveal animation="scale-in">
                  <div className="flex gap-3 bg-emerald-50 border border-emerald-500/20 text-emerald-800 p-4 rounded-xl mb-6 backdrop-blur-sm">
                    <CheckCircle className="h-5.5 w-5.5 text-emerald-500 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-sm">Message Sent Successfully!</h4>
                      <p className="text-xs text-emerald-700 mt-0.5 font-light">Thank you for reaching out. We will get in touch with you shortly.</p>
                    </div>
                  </div>
                </ScrollReveal>
              )}

              {submitStatus === 'error' && (
                <ScrollReveal animation="scale-in">
                  <div className="flex gap-3 bg-rose-50 border border-rose-500/20 text-rose-800 p-4 rounded-xl mb-6 backdrop-blur-sm">
                    <ShieldAlert className="h-5.5 w-5.5 text-rose-500 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-sm">Submission Failed</h4>
                      <p className="text-xs text-rose-755 mt-0.5 font-light">There was a problem sending your inquiry. Please verify your internet connection or try again later.</p>
                    </div>
                  </div>
                </ScrollReveal>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="name" className="text-[10px] font-bold text-accent uppercase tracking-widest">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-300 text-slate-800"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-[10px] font-bold text-accent uppercase tracking-widest">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-300 text-slate-800"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="phone" className="text-[10px] font-bold text-accent uppercase tracking-widest">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-300 text-slate-800"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="text-[10px] font-bold text-accent uppercase tracking-widest">Your Message *</label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we assist you?"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-300 text-slate-800 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto bg-gradient-to-r from-accent-dark to-accent hover:from-accent hover:to-accent-light text-primary-dark font-bold px-8 py-3.5 rounded-full uppercase tracking-wider text-xs transition-all duration-300 shadow-lg shadow-accent/20 flex items-center justify-center gap-2 hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer text-slate-900"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </ScrollReveal>

        </div>

      </div>
    </div>
  );
}
