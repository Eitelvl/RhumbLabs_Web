import { ArrowRight, AtSign, CheckCircle2, Globe, Apple, Monitor } from 'lucide-react';
import { DeviceMockup } from '../components/DeviceMockup';
import { Link, useLocation } from 'react-router-dom';
import React, { useEffect, useState, useRef } from 'react';
import TopBar from '../components/TopBar';
import Footer from '../components/Footer';
import { motion } from 'motion/react';

const AndroidIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4483-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0004.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.25 13.8533 7.85 12 7.85s-3.5902.4-5.1367 1.1004L4.841 5.4467a.416.416 0 00-.5676-.1521.416.416 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3435-4.1021-2.6892-7.5743-6.1185-9.4396"/>
  </svg>
);

export default function LandingPage() {
  const location = useLocation();
  const [activeCard, setActiveCard] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard(prev => {
        const next = prev === 0 ? 1 : 0;
        const carousel = carouselRef.current;
        if (carousel) {
          const cardWidth = carousel.clientWidth;
          carousel.scrollTo({
            left: next * cardWidth,
            behavior: 'smooth'
          });
        }
        return next;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const cardWidth = e.currentTarget.clientWidth;
    const scrollRatio = scrollLeft / cardWidth;
    
    if (scrollRatio > 0.5 && activeCard !== 1) {
      setActiveCard(1);
    } else if (scrollRatio <= 0.5 && activeCard !== 0) {
      setActiveCard(0);
    }
  };

  return (
    <div className="bg-[#000000] text-white min-h-screen selection:bg-white/20 selection:text-white">
      <TopBar />

      {/* Modern Hero Section */}
      <section id="home" className="relative pt-48 pb-32 overflow-hidden px-6 lg:px-12 flex flex-col justify-center items-center text-center">
        {/* Subtle glowing orb in background */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[120px] opacity-60 pointer-events-none"></div>

        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
           className="z-20 max-w-5xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-sm font-medium text-slate-300 mb-10 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)] animate-pulse"></span>
            Building the next generation of software
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-[6rem] font-bold tracking-tighter mb-8 leading-[1.05] text-white font-headline">
            Digital products <br className="hidden md:block" />
            <span className="text-[#8A8F98]">built with purpose.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-[#8A8F98] font-light max-w-3xl mx-auto tracking-tight mb-12 leading-relaxed">
            We focus on creating reliable, intuitive, and beautifully crafted software.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <Link to="#products" className="group relative inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full bg-white text-black font-medium transition-transform hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
               Our Products
               <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
             </Link>
          </div>
        </motion.div>
      </section>

      {/* Expanded Products Section */}
      <section id="products" className="py-24 md:py-40 bg-[#000000] scroll-mt-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-24">
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-white">Our Products</h2>
            </div>
          </div>

          <div id="products-carousel" ref={carouselRef} onScroll={handleScroll} className="flex overflow-x-auto snap-x snap-mandatory gap-8 pb-4 no-scrollbar scroll-smooth -mx-6 px-6 lg:-mx-12 lg:px-12" style={{ scrollbarWidth: 'none' }}>
            {/* RhumbNav - Epic Layout */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="snap-center shrink-0 w-full max-w-[1300px] group relative rounded-[2rem] md:rounded-[3rem] border border-white/10 bg-[#0a0b0d] overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 p-8 md:p-16 lg:p-24 relative z-10">
                <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center">
                  <div className="relative mb-6 md:mb-8 self-start flex items-center h-16 md:h-20 w-64 md:w-80">
                    <img src="/logo_horizontal.png" alt="RhumbNav" className="w-[220px] md:w-[300px] h-auto object-contain scale-[1.3] md:scale-[1.4] origin-left" />
                  </div>
                  <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight leading-tight">Aviation precision <br className="hidden lg:block"/>in your pocket.</h3>
                  <p className="text-[#8A8F98] text-lg md:text-xl leading-relaxed mb-10 font-light max-w-lg">
                    The all-in-one flight planning, navigation, and logbook platform designed exclusively for modern pilots. Beautifully complex, incredibly simple to use.
                  </p>
                  
                  <div className="space-y-4 mb-12">
                    {['Complete VFR Navigation', 'Digital Logbook & Pilot Credentials', 'Real-time Weather & Airport Info', 'Advanced E6B Flight Computer'].map(feature => (
                      <div key={feature} className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                           <CheckCircle2 className="text-white w-5 h-5 opacity-70" />
                        </div>
                        <span className="text-white/80 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Link to="/rhumbnav" className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full bg-white text-black font-medium w-fit hover:bg-[#e0e5f4] transition-colors relative overflow-hidden group/btn">
                    <span className="relative z-10 flex items-center gap-2">
                       Discover RhumbNav
                       <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
                    </span>
                  </Link>
                </div>
                
                <div className="lg:col-span-6 xl:col-span-7 flex justify-end items-center relative mt-16 md:mt-0 lg:mt-0 min-h-[400px] md:min-h-[500px] overflow-visible">
                  <div className="flex flex-row items-center justify-center w-[150%] md:w-[180%] lg:w-[190%] max-w-[950px] md:max-w-[1300px] mt-10 md:mt-0 z-10 relative left-0 md:left-[2%] lg:left-[4%]">
                    <DeviceMockup 
                      type="tablet"
                      className="w-[75%] md:w-[73%] shadow-[0_30px_100px_rgba(0,0,0,0.8)] z-10"
                      imageSrc="/LogbookTablet.jpeg"
                      alt="RhumbNav Tablet Interface"
                    />
                    <DeviceMockup 
                      type="phone"
                      className="w-[31%] md:w-[32%] shadow-[-20px_30px_80px_rgba(0,0,0,0.8)] z-20 -ml-[8%] md:-ml-[6%]"
                      imageSrc="/FPL.jpeg"
                      alt="RhumbNav Mobile Interface"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Pogo - Epic Layout */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="snap-center shrink-0 w-full max-w-[1300px] group relative rounded-[2rem] md:rounded-[3rem] border border-white/10 bg-[#0a0b0d] overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 -translate-x-1/3"></div>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 p-8 md:p-16 lg:p-24 relative z-10">
                <div className="lg:col-span-6 xl:col-span-7 order-2 lg:order-1 flex justify-center lg:justify-start items-center relative mt-16 md:mt-0">
                   <div className="relative w-full max-w-[320px] lg:max-w-[380px] aspect-[9/19] flex justify-center items-center">
                     <DeviceMockup 
                        type="phone"
                        className="w-full z-20 shadow-[0_40px_100px_rgba(0,0,0,0.8)]"
                        imageSrc="/pogo/summary_v.jpeg"
                        alt="Pogo Mobile Interface"
                     />
                  </div>
                </div>
                
                <div className="lg:col-span-6 xl:col-span-5 order-1 lg:order-2 flex flex-col justify-center">
                  <div className="relative mb-6 self-start flex items-center h-16 md:h-20 w-56 md:w-72 -ml-12 md:-ml-16">
                    <img src="/pogo/Pogo2.png" alt="Pogo" className="w-[240px] md:w-[320px] h-auto object-contain scale-[1.3] md:scale-[1.5] origin-left -translate-y-6" />
                  </div>
                  <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight leading-tight">Climb higher, <br className="hidden lg:block"/>track smarter.</h3>
                  <p className="text-[#8A8F98] text-lg md:text-xl leading-relaxed mb-10 font-light max-w-lg">
                    Log your bouldering sessions, visualize your progress over time, and stay motivated. Built specifically for the climbing community.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                    {['Track Grades', 'Performance Analytics', 'Gym-Based Grades', 'Session Logging'].map(feature => (
                      <div key={feature} className="flex items-center gap-3">
                         <div className="w-2 h-2 rounded-full bg-white/20"></div>
                        <span className="text-white/80 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Link to="/pogo" className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full bg-white text-black font-medium w-fit hover:bg-[#e0e5f4] transition-colors group">
                    Explore Pogo
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="flex justify-center items-center gap-4 mt-12 mb-4">
            <button 
              onClick={() => { 
                setActiveCard(0); 
                carouselRef.current?.scrollTo({ left: 0, behavior: 'smooth' }); 
              }} 
              className={`h-2.5 rounded-full transition-all duration-300 ${activeCard === 0 ? 'bg-white w-8' : 'bg-white/30 hover:bg-white/50 w-2.5'}`} 
              aria-label="View RhumbNav card"
            />
            <button 
              onClick={() => { 
                setActiveCard(1); 
                carouselRef.current?.scrollTo({ left: carouselRef.current?.scrollWidth || 0, behavior: 'smooth' }); 
              }} 
              className={`h-2.5 rounded-full transition-all duration-300 ${activeCard === 1 ? 'bg-white w-8' : 'bg-white/30 hover:bg-white/50 w-2.5'}`} 
              aria-label="View Pogo card"
            />
          </div>

        </div>
      </section>

      {/* Modern About / Manifesto Section */}
      <section id="about" className="py-32 md:py-48 relative border-t border-white/5 scroll-mt-20">
         <div className="absolute inset-0 bg-[#050505]"></div>
         <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center relative z-10">
           <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-white mb-10">
             Crafting Software <br className="hidden md:block"/> with intention.
           </h2>
           
           <p className="text-xl md:text-3xl text-[#8A8F98] font-light leading-snug mb-16 text-balance">
             We care deeply about clarity, functionality, and creating tools that feel intuitive from the very first tap. By bringing together design and robust engineering, we shape digital products that are simple, reliable, and built with purpose.
           </p>
           
           <Link to="/contact" className="inline-flex items-center justify-center gap-2 h-14 px-10 rounded-full bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors">
             Get in touch
           </Link>
         </div>
      </section>

      <Footer />
    </div>
  );
}
