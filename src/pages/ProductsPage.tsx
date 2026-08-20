import React, { useEffect, useState, useRef } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { DeviceMockup } from '../components/DeviceMockup';
import { Link, useLocation } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Footer from '../components/Footer';
import { motion } from 'motion/react';
import { SafeImage } from '../components/SafeImage';

// Products Page - RhumbLabs
export default function ProductsPage() {
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

  const location = useLocation();

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

      <section className="pt-32 pb-24 md:pt-40 md:pb-40 bg-transparent relative z-10">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          
          <div className="mb-16 md:mb-24 text-center">
            <h1 className="text-5xl md:text-6xl lg:text-[5rem] font-bold tracking-tighter text-text-primary">Our Products</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-4 max-w-5xl mx-auto">
            {/* RhumbNav - Summary Layout */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full group relative rounded-[2rem] linear-card backdrop-blur-xl overflow-hidden aspect-square flex flex-col p-6 sm:p-8 md:p-10 justify-between"
            >
              <div className="flex flex-col items-center justify-between h-full w-full text-center">
                {/* Logo Area - 3x larger */}
                <div className="flex-1 flex items-center justify-center w-full min-h-0 pt-1 pb-1">
                  <SafeImage 
                    src="/images/rhumbnav-logo.png" 
                    alt="RhumbNav Logo" 
                    className="w-auto max-w-full max-h-[200px] sm:max-h-[250px] md:max-h-[290px] object-contain scale-125 sm:scale-140 md:scale-150 origin-center" 
                  />
                </div>
                
                {/* Text Area - Small margin directly below the logo */}
                <div className="pt-2 pb-3 flex items-center justify-center w-full">
                  <p className="text-text-secondary text-base sm:text-lg md:text-xl leading-relaxed font-light max-w-xs">
                    Aviation precision in your pocket.
                  </p>
                </div>
                
                {/* Button Area */}
                <div className="pb-1 flex items-center justify-center w-full">
                  <Link to="/rhumbnav" className="inline-flex shrink-0 items-center justify-center gap-2 h-12 px-8 rounded-full btn-cyan-glow text-white font-semibold group/btn">
                    Discover RhumbNav
                    <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Pogo - Summary Layout */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="w-full group relative rounded-[2rem] linear-card backdrop-blur-xl overflow-hidden aspect-square flex flex-col p-6 sm:p-8 md:p-10 justify-between"
            >
              <div className="flex flex-col items-center justify-between h-full w-full text-center">
                {/* Logo Area - 3x larger */}
                <div className="flex-1 flex items-center justify-center w-full min-h-0 pt-1 pb-1">
                  <SafeImage 
                    src="/images/pogo-logo.png" 
                    alt="Pogo Logo" 
                    className="w-auto max-w-full max-h-[200px] sm:max-h-[250px] md:max-h-[290px] object-contain scale-125 sm:scale-140 md:scale-150 origin-center" 
                  />
                </div>
                
                {/* Text Area - Small margin directly below the logo */}
                <div className="pt-2 pb-3 flex items-center justify-center w-full">
                  <p className="text-text-secondary text-base sm:text-lg md:text-xl leading-relaxed font-light max-w-xs">
                    Climb higher, track smarter.
                  </p>
                </div>
                
                {/* Button Area */}
                <div className="pb-1 flex items-center justify-center w-full">
                  <Link to="/pogo" className="inline-flex shrink-0 items-center justify-center gap-2 h-12 px-8 rounded-full btn-magenta-glow text-white font-semibold group/btn">
                    Explore Pogo
                    <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
