import TopBar from '../components/TopBar';
import Footer from '../components/Footer';
import { motion, useScroll, useTransform } from 'motion/react';
import { DeviceMockup } from '../components/DeviceMockup';
import { Compass, BookText, Calculator, Map, Crosshair } from 'lucide-react';
import { useRef } from 'react';

export default function RhumbNavPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  return (
    <div className="bg-[#000000] text-white min-h-screen selection:bg-blue-500/30 selection:text-white">
      <TopBar />
      
      <main className="pt-32 pb-32 relative overflow-hidden" ref={containerRef}>
        
        {/* Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[600px] bg-blue-600/10 rounded-[100%] blur-[120px] pointer-events-none opacity-50"></div>

        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
          
          {/* Hero Section */}
          <div className="flex flex-col items-center text-center mt-12 mb-32 md:mb-48">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center justify-center mb-8 relative h-20 md:h-28 w-64 md:w-96"
            >
              <img src="/logo_horizontal.png" alt="RhumbNav Logo" className="w-[240px] md:w-[360px] h-auto object-contain scale-[1.3] md:scale-[1.4] origin-center" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-[6rem] font-bold tracking-tighter mb-8 leading-[1.05] text-white"
            >
              Flight simplified. <br className="hidden md:block"/> Navigation perfected.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-[#8A8F98] max-w-3xl mx-auto leading-relaxed font-light mb-16"
            >
              RhumbNav is a new light EFB shaped by real flight experience, bringing flight planning, navigation, and in-flight awareness into one seamless experience.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-full text-white font-medium shadow-[0_0_40px_rgba(59,130,246,0.15)]"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#3DDC84]" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4483-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0004.5511-.4482.9997-.9993.9997zm-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997zm11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0216 3.503C15.5902 8.244 13.8533 7.85 12 7.85c-1.8533 0-3.5902.394-5.1375 1.1002L4.841 5.447a.416.416 0 00-.5676-.1521.416.416 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.44z"/>
              </svg>
              Coming Soon for Android
            </motion.div>
          </div>

          {/* Epic Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
             {/* Feature 1 - Left Column Tall */}
             <motion.div 
               whileHover={{ y: -5 }}
               className="md:col-span-1 group relative rounded-[2.5rem] border border-white/10 bg-[#0a0b0d] overflow-hidden min-h-[600px] flex flex-col"
             >
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-[80px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
                
                <div className="p-10 md:p-14 z-10">
                  <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mb-8">
                     <Calculator className="w-6 h-6 text-sky-400" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Precision calculation</h2>
                  <p className="text-[#8A8F98] text-lg font-light leading-relaxed">
                    Flight calculations made faster, cleaner, and easier. From wind correction to fuel planning, RhumbNav gives you the numbers that matter—without the clutter.
                  </p>
                </div>

                <div className="flex-1 w-full relative flex items-center justify-center overflow-hidden pb-10">
                   <motion.div style={{ y: y1 }} className="flex justify-center items-center w-full">
                      <DeviceMockup 
                        type="phone"
                        className="w-[50%] max-w-[280px] shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
                        imageSrc="/FPL.jpeg"
                        alt="Precision Calculation"
                      />
                   </motion.div>
                </div>
             </motion.div>

             {/* Feature 2 - Right Column Tall */}
             <motion.div 
               whileHover={{ y: -5 }}
               className="md:col-span-1 group relative rounded-[2.5rem] border border-white/10 bg-[#0a0b0d] overflow-hidden min-h-[600px] flex flex-col pt-10"
             >
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[80px] pointer-events-none -translate-x-1/3 translate-y-1/3"></div>

                <div className="flex-1 w-full relative flex items-start justify-center pt-12 pb-4 z-10">
                   <motion.div style={{ y: y2 }} className="flex justify-center items-start w-full">
                      <DeviceMockup 
                        type="phone"
                        className="w-[60%] md:w-[65%] max-w-[260px] shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
                        imageSrc="/allFlight.jpeg"
                        alt="Logbook Phone"
                      />
                   </motion.div>
                </div>
                
                <div className="p-10 md:p-14 z-10 mt-auto bg-gradient-to-t from-[#0a0b0d] via-[#0a0b0d] to-transparent pt-20">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-8">
                     <BookText className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">A better logbook</h3>
                  <p className="text-[#8A8F98] text-lg font-light leading-relaxed">
                    A smarter way to track your flying life. Keep flight time, landings, approaches, and records organized in a logbook built for modern aviation.
                  </p>
                </div>
             </motion.div>

             {/* Feature 3 - Wide bottom card */}
             <motion.div 
               whileHover={{ y: -5 }}
               className="md:col-span-2 group relative rounded-[2.5rem] border border-white/10 bg-[#0a0b0d] overflow-hidden min-h-[500px] flex flex-col md:flex-row items-center"
             >
                <div className="flex-1 p-10 md:p-16 lg:p-20 z-10 order-2 md:order-1">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-8">
                     <Compass className="w-6 h-6 text-indigo-400" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Built for confident flying</h3>
                  <p className="text-[#8A8F98] text-lg md:text-xl font-light leading-relaxed">
                    Purpose-built VFR navigation for pilots who value clarity in the cockpit. Plan smarter, stay oriented, and fly with greater confidence. All your credentials and documents seamlessly integrated.
                  </p>
                </div>
                
                <div className="flex-1 w-full relative h-[350px] md:h-[500px] flex items-center justify-center order-1 md:order-2 overflow-visible">
                   <div className="flex flex-row items-center justify-center w-[115%] md:w-[125%] max-w-[580px] md:max-w-[720px] mt-10 md:mt-0 -ml-4 md:-ml-12 z-10 pr-4 md:pr-8">
                     <DeviceMockup 
                        type="tablet"
                        className="w-[75%] md:w-[73%] shadow-[0_30px_80px_rgba(0,0,0,0.8)] z-10"
                        imageSrc="/nav.jpeg"
                        alt="Confident Flying Interface"
                     />
                     <DeviceMockup 
                        type="phone"
                        className="w-[31%] md:w-[32%] shadow-[-20px_20px_60px_rgba(0,0,0,0.8)] z-20 -ml-[8%] md:-ml-[6%]"
                        imageSrc="/FPL.jpeg"
                        alt="Flight Plan Interface"
                     />
                   </div>
                </div>
             </motion.div>
          </div>

          {/* Bottom Callout */}
          <div className="mt-24 mb-10 p-12 md:p-20 rounded-[2.5rem] border border-white/10 bg-white/[0.02] text-center relative overflow-hidden backdrop-blur-xl">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] bg-sky-500/5 rounded-[100%] blur-[80px] pointer-events-none"></div>
             <Crosshair className="w-12 h-12 text-slate-300 mx-auto mb-8 opacity-60" />
             <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Aviation in your pocket.</h2>
             <p className="text-[#8A8F98] text-xl font-light leading-relaxed max-w-2xl mx-auto">
               Experience modern flying without the clutter. Start navigating, planning, and logging with unprecedented clarity.
             </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
