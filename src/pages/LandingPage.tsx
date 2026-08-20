import { ArrowRight, AtSign, CheckCircle2, Globe, Apple, Monitor } from 'lucide-react';
import { DeviceMockup } from '../components/DeviceMockup';
import { Link, useLocation } from 'react-router-dom';
import React, { useEffect, useState, useRef } from 'react';
import TopBar from '../components/TopBar';
import Footer from '../components/Footer';
import { motion } from 'motion/react';
import { SafeImage } from '../components/SafeImage';

const AndroidIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4483-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0004.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.25 13.8533 7.85 12 7.85s-3.5902.4-5.1367 1.1004L4.841 5.4467a.416.416 0 00-.5676-.1521.416.416 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3435-4.1021-2.6892-7.5743-6.1185-9.4396"/>
  </svg>
);

export default function LandingPage() {
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return true;
  });

  useEffect(() => {
    const checkDark = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className="bg-bg-primary text-text-primary min-h-screen selection:bg-card-border selection:text-text-primary">
      <TopBar />

      {/* Modern Hero Section */}
      <section id="home" className="relative min-h-[100dvh] pt-24 md:pt-32 pb-20 px-6 lg:px-12 flex flex-col justify-center items-center text-center">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
           className="z-20 max-w-4xl w-full mx-auto flex flex-col items-center justify-center my-auto"
        >
          <h1 className="text-6xl md:text-8xl lg:text-[7.5rem] tracking-tight mb-6 leading-[1.05] font-headline text-center select-none">
            <span className="brand-hero-title-container">
              {/* Dynamic curved energy lines traversing letters from left (magenta-purple) to right (cyan-blue) */}
              <svg 
                className="brand-traversing-lines-svg"
                viewBox="0 0 700 120" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="titleStrandGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#c026d3" stopOpacity="0.85" />
                    <stop offset="25%" stopColor="#a855f7" stopOpacity="0.95" />
                    <stop offset="60%" stopColor="#3b82f6" stopOpacity="0.9" />
                    <stop offset="85%" stopColor="#06b6d4" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#00f2fe" stopOpacity="0.85" />
                  </linearGradient>
                  
                  <linearGradient id="titleStrandGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#9333ea" stopOpacity="0.75" />
                    <stop offset="30%" stopColor="#c084fc" stopOpacity="0.85" />
                    <stop offset="65%" stopColor="#2563eb" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
                  </linearGradient>

                  <linearGradient id="titleStrandGrad3" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#e879f9" stopOpacity="0.6" />
                    <stop offset="35%" stopColor="#818cf8" stopOpacity="0.75" />
                    <stop offset="70%" stopColor="#0284c7" stopOpacity="0.75" />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.6" />
                  </linearGradient>
                  
                  <filter id="strandGlow" x="-20%" y="-50%" width="140%" height="200%">
                    <feGaussianBlur stdDeviation="3.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Strand 1: Main undulating curve traversing letters */}
                <path 
                  d="M 5 62 C 120 40, 220 78, 350 58 C 480 38, 580 72, 695 56" 
                  stroke="url(#titleStrandGrad1)" 
                  strokeWidth="2.8" 
                  strokeLinecap="round"
                  filter="url(#strandGlow)"
                  className="brand-strand-wave-1"
                />

                {/* Strand 2: Secondary offset wave */}
                <path 
                  d="M 15 54 C 130 75, 240 42, 360 66 C 470 88, 570 48, 685 64" 
                  stroke="url(#titleStrandGrad2)" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                  filter="url(#strandGlow)"
                  className="brand-strand-wave-2"
                />

                {/* Strand 3: Delicate fine accent ribbon */}
                <path 
                  d="M 25 68 C 145 52, 260 70, 375 52 C 490 35, 595 62, 675 50" 
                  stroke="url(#titleStrandGrad3)" 
                  strokeWidth="1.5" 
                  strokeLinecap="round"
                  className="brand-strand-wave-3"
                />
              </svg>

              {/* Horizontal colorful accent line in the middle */}
              <span className="brand-middle-line" aria-hidden="true"></span>

              {/* Point / dot of purple & blue light traveling along the letters */}
              <span className="brand-light-point" aria-hidden="true"></span>

              {/* Exact typography representation: Rhumb (semibold) + Labs (light) */}
              <span className="relative z-10 text-text-primary">
                <span className="font-semibold">Rhumb</span>
                <span className="font-light">Labs</span>
              </span>
            </span>
          </h1>
          
          <p className="text-2xl md:text-3xl text-text-secondary font-light max-w-2xl mx-auto tracking-tight mb-12 leading-relaxed text-center">
            Designed for What’s Next.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <Link to="/#products" onClick={(e) => {
               const el = document.getElementById('products');
               if (el) {
                 e.preventDefault();
                 el.scrollIntoView({ behavior: 'smooth' });
               }
             }} className="group relative inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full brand-btn-primary font-medium transition-transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(6,182,212,0.4)]">
               Our Products
               <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
             </Link>
          </div>
        </motion.div>
      </section>

      {/* Stacked Large Banners Section */}
      <section id="products" className="py-16 md:py-24 bg-transparent scroll-mt-20 relative z-10">
        <div className="max-w-[1350px] mx-auto px-6 lg:px-12 flex flex-col gap-12 md:gap-16">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-text-primary">Our Products</h2>
            </div>
          </div>

          {/* Banner 1: RhumbNav - Horizontal Format */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="w-full group relative rounded-[1.75rem] md:rounded-[2.5rem] linear-card backdrop-blur-xl overflow-hidden p-6 sm:p-10 md:p-12 lg:p-14 min-h-[560px] md:min-h-[600px] lg:min-h-[640px] flex flex-col justify-center"
          >
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[90px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
            
            {/* Top-Left Corner Logo - Snug in corner without overlapping text */}
            <div className="absolute top-4 left-2 sm:top-6 sm:left-3 md:top-7 md:left-3 z-20 pointer-events-none">
              <SafeImage 
                src="/images/rhumbnav-logo.png" 
                alt="RhumbNav" 
                className="h-16 sm:h-20 md:h-24 lg:h-28 w-auto max-w-[240px] sm:max-w-xs md:max-w-sm object-contain object-left origin-[left_center] scale-[1.45] sm:scale-[1.8] md:scale-[2] lg:scale-[2.2]"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10 pt-20 sm:pt-24 lg:pt-8">
              {/* Text / Info Column - Centered vertically on the card */}
              <div className="lg:col-span-7 flex flex-col justify-center items-start text-left">
                {/* Title */}
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-bold text-text-primary tracking-tight leading-snug mb-4">
                  Aviation precision in your pocket.
                </h3>

                {/* Subtitle */}
                <p className="text-text-secondary text-base md:text-lg leading-relaxed mb-6 font-light max-w-xl">
                  The all-in-one flight planning, navigation, and logbook platform designed exclusively for modern pilots. Beautifully complex, incredibly simple to use.
                </p>
                
                {/* Bullet Points Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mb-8">
                  {['Complete VFR Navigation', 'Digital Logbook & Pilot Credentials', 'Real-time Weather & Airport Info', 'Advanced E6B Flight Computer'].map(feature => (
                    <div key={feature} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-card-element border border-card-border flex items-center justify-center shrink-0">
                         <CheckCircle2 className="text-cyan-400 w-3.5 h-3.5" />
                      </div>
                      <span className="text-text-secondary text-xs md:text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
                
                {/* CTA Button */}
                <Link to="/rhumbnav" className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-full btn-cyan-glow text-white font-semibold text-sm w-fit group/btn">
                  <span className="relative z-10 flex items-center gap-2">
                     Discover RhumbNav
                     <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </span>
                </Link>
              </div>
              
              {/* Image Column - 3 Vertical Phones Stack */}
              <div className="lg:col-span-5 flex justify-center items-center relative min-h-[300px] md:min-h-[360px] py-4 self-center">
                <div className="flex flex-row items-center justify-center w-full max-w-[380px] md:max-w-[440px] relative">
                  {/* Left Phone: Pilot License */}
                  <DeviceMockup 
                    type="phone"
                    className="w-[50%] md:w-[54%] shadow-[0_15px_35px_rgba(0,0,0,0.3)] z-10 scale-90 -mr-[20%]"
                    imageSrc="/images/rhumbnav-license.jpeg"
                    alt="RhumbNav Pilot License"
                  />
                  {/* Center Phone (Front): Active Navigation */}
                  <DeviceMockup 
                    type="phone"
                    className="w-[58%] md:w-[62%] shadow-[0_25px_60px_var(--shadow-heavy)] z-30 relative"
                    imageSrc="/images/rhumbnav-nav-active.jpeg"
                    alt="RhumbNav Active Navigation"
                  />
                  {/* Right Phone: Flight Plan (FPL) */}
                  <DeviceMockup 
                    type="phone"
                    className="w-[50%] md:w-[54%] shadow-[0_15px_35px_rgba(0,0,0,0.3)] z-10 scale-90 -ml-[20%]"
                    imageSrc="/images/rhumbnav-fpl.jpeg"
                    alt="RhumbNav Flight Plan"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Banner 2: Pogo - Horizontal Format */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="w-full group relative rounded-[1.75rem] md:rounded-[2.5rem] linear-card backdrop-blur-xl overflow-hidden p-6 sm:p-10 md:p-12 lg:p-14 min-h-[560px] md:min-h-[600px] lg:min-h-[640px] flex flex-col justify-center"
          >
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[90px] pointer-events-none -translate-y-1/2 -translate-x-1/3"></div>
            
            {/* Top-Right Corner Logo - Snug in corner without overlapping text */}
            <div className="absolute top-4 right-5 sm:top-6 sm:right-8 md:top-7 md:right-10 z-20 pointer-events-none">
              <SafeImage 
                src="/images/pogo-logo.png" 
                alt="Pogo" 
                className="h-16 sm:h-20 md:h-24 lg:h-28 w-auto max-w-[240px] sm:max-w-xs md:max-w-sm object-contain object-right origin-[right_center] scale-[2] sm:scale-[2.5] md:scale-[2.75] lg:scale-[3]"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10 pt-20 sm:pt-24 lg:pt-8">
              {/* Image Column - 3 Vertical Phones Stack */}
              <div className="lg:col-span-5 order-2 lg:order-1 flex justify-center items-center relative min-h-[300px] md:min-h-[360px] py-4 self-center">
                 <div className="flex flex-row items-center justify-center w-full max-w-[380px] md:max-w-[440px] relative">
                   {/* Left Phone: Summary */}
                   <DeviceMockup 
                      type="phone"
                      className="w-[50%] md:w-[54%] shadow-[0_15px_35px_rgba(0,0,0,0.3)] z-10 scale-90 -mr-[20%]"
                      imageSrc={isDarkMode ? '/images/pogo-summary-dark.jpg' : '/images/pogo-summary-light.jpg'}
                      alt="Pogo Summary View"
                   />
                   {/* Center Phone (Front): Active Session */}
                   <DeviceMockup 
                      type="phone"
                      className="w-[58%] md:w-[62%] shadow-[0_25px_60px_var(--shadow-heavy)] z-30 relative"
                      imageSrc={isDarkMode ? '/images/pogo-active-session-dark.jpg' : '/images/pogo-active-session-light.jpg'}
                      alt="Pogo Active Session View"
                   />
                   {/* Right Phone: Achievements */}
                   <DeviceMockup 
                      type="phone"
                      className="w-[50%] md:w-[54%] shadow-[0_15px_35px_rgba(0,0,0,0.3)] z-10 scale-90 -ml-[20%]"
                      imageSrc={isDarkMode ? '/images/pogo-achievements-dark.jpg' : '/images/pogo-achievements-light.jpg'}
                      alt="Pogo Achievements View"
                   />
                </div>
              </div>
              
              {/* Text / Info Column - Centered vertically on the card, aligned right */}
              <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col justify-center items-end text-right">
                {/* Title */}
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-bold text-text-primary tracking-tight leading-snug mb-4 text-right">
                  Climb higher, track smarter.
                </h3>

                {/* Subtitle */}
                <p className="text-text-secondary text-base md:text-lg leading-relaxed mb-6 font-light max-w-xl text-right">
                  Log your bouldering sessions, visualize your progress over time, and stay motivated. Built specifically for the climbing community.
                </p>
                
                {/* Bullet Points Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mb-8 w-full">
                  {['Track Grades', 'Performance Analytics', 'Unlock Achievements', 'Session Logging'].map(feature => (
                    <div key={feature} className="flex items-center justify-end gap-3">
                      <span className="text-text-secondary text-xs md:text-sm font-medium text-right">{feature}</span>
                      <div className="w-2 h-2 rounded-full bg-fuchsia-400 shrink-0"></div>
                    </div>
                  ))}
                </div>
                
                {/* CTA Button */}
                <div className="flex justify-end w-full">
                  <Link to="/pogo" className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-full btn-magenta-glow text-white font-semibold text-sm w-fit group/btn">
                    <span className="relative z-10 flex items-center gap-2">
                      Explore Pogo
                      <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Modern About / Manifesto Section */}
      <section id="about" className="py-32 md:py-48 relative border-t border-border-subtle scroll-mt-20 z-10 bg-transparent">
         <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center relative z-10">
           <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-text-primary mb-10">
             Crafting Software <br className="hidden md:block"/> with intention.
           </h2>
           
           <p className="text-xl md:text-3xl text-text-secondary font-light leading-snug mb-16 text-balance">
             We care deeply about clarity, functionality, and creating tools that feel intuitive from the very first tap. By bringing together design and robust engineering, we shape digital products that are simple, reliable, and built with purpose.
           </p>
           
           <div className="flex flex-wrap items-center justify-center gap-4">
             <Link to="/about" className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full bg-card-element border border-card-border text-text-primary font-medium hover:bg-card-border transition-colors">
               About Rhumb Labs →
             </Link>
             <Link to="/contact" className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full brand-btn-primary font-medium transition-all">
               Get in touch
             </Link>
           </div>
         </div>
      </section>

      <Footer />
    </div>
  );
}
