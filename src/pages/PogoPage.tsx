import TopBar from '../components/TopBar';
import Footer from '../components/Footer';
import { motion, useScroll, useTransform } from 'motion/react';
import { DeviceMockup } from '../components/DeviceMockup';
import { Activity, MapPin, TrendingUp, NotebookPen, Mountain } from 'lucide-react';
import { useRef } from 'react';

export default function PogoPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <div className="bg-bg-primary text-text-primary min-h-screen selection:bg-purple-500/30 selection:text-text-primary">
      <TopBar />
      
      <main className="pt-32 pb-32 relative overflow-hidden" ref={containerRef}>
        
        {/* Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[600px] bg-purple-600/10 rounded-[100%] blur-[120px] pointer-events-none opacity-50"></div>

        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
          
          {/* Hero Section */}
          <div className="flex flex-col items-center text-center mt-12 mb-32 md:mb-48">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center justify-center mb-8 relative h-20 md:h-28 w-64 md:w-80"
            >
              <img src="/pogo/Pogo2.png" alt="Pogo Logo" className="white-logo w-[220px] md:w-[320px] h-auto object-contain scale-[1.3] md:scale-[1.5] origin-center" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-[6rem] font-bold tracking-tighter mb-8 leading-[1.05] text-text-primary"
            >
              Master every route. <br className="hidden md:block"/> Elevate your climb.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed font-light mb-16"
            >
              Designed exclusively for the climbing community. Log your sessions, analyze your progress, and stay motivated with a digital companion built for the wall.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-card-element border border-card-border rounded-full text-text-primary font-medium shadow-[0_0_40px_rgba(168,85,247,0.15)]"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#3DDC84]" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4483-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0004.5511-.4482.9997-.9993.9997zm-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997zm11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0216 3.503C15.5902 8.244 13.8533 7.85 12 7.85c-1.8533 0-3.5902.394-5.1375 1.1002L4.841 5.447a.416.416 0 00-.5676-.1521.416.416 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.44z"/>
              </svg>
              Coming Soon for Android
            </motion.div>
          </div>

          {/* Epic Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
             {/* Feature 1 - Wide Card */}
             <motion.div 
               whileHover={{ y: -5 }}
               className="md:col-span-2 group relative rounded-[2.5rem] border border-card-border bg-bg-secondary overflow-hidden min-h-[500px] md:min-h-[600px] flex flex-col md:flex-row items-center"
             >
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
                
                <div className="flex-1 p-10 md:p-16 lg:p-20 z-10">
                  <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-8">
                     <NotebookPen className="w-6 h-6 text-purple-400" />
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Log every session</h2>
                  <p className="text-text-secondary text-lg md:text-xl font-light leading-relaxed max-w-xl">
                    Log your bouldering sessions, attempts, completed problems, grades, climbing time, and personal notes. Pogo keeps your history organized to make your progression tangible.
                  </p>
                </div>

                <div className="flex-1 w-full relative h-[400px] md:h-[600px] flex items-center justify-center overflow-hidden">
                   <motion.div style={{ y }} className="w-full h-full flex justify-center items-center">
                      <DeviceMockup 
                        type="phone"
                        className="w-[60%] md:w-[70%] max-w-[300px] shadow-[0_20px_60px_var(--shadow-heavy)] rotate-[-4deg]"
                        imageSrc="/pogo/sesion_activa.jpeg"
                        alt="Log Session"
                      />
                   </motion.div>
                </div>
             </motion.div>

             {/* Feature 2 - Tall Card */}
             <motion.div 
               whileHover={{ y: -5 }}
               className="group relative rounded-[2.5rem] border border-card-border bg-bg-secondary overflow-hidden min-h-[500px] flex flex-col"
             >
                <div className="p-10 md:p-14 z-10">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-8">
                     <TrendingUp className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">Clear Progression</h3>
                  <p className="text-text-secondary text-base md:text-lg font-light leading-relaxed">
                    Turn your data into powerful, visual graphs. Track your activity and improve over time.
                  </p>
                </div>
                <div className="flex-1 relative flex items-center justify-center mt-auto pb-10">
                   <DeviceMockup 
                      type="phone"
                      className="w-[50%] max-w-[250px] shadow-[0_20px_50px_var(--shadow-medium)]"
                      imageSrc="/pogo/summary_active_v.jpeg"
                      alt="Clear Progression"
                   />
                </div>
             </motion.div>

             {/* Feature 3 - Tall Card */}
             <motion.div 
               whileHover={{ y: -5 }}
               className="group relative rounded-[2.5rem] border border-card-border bg-bg-secondary overflow-hidden min-h-[500px] flex flex-col"
             >
                <div className="p-10 md:p-14 z-10">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-8">
                     <MapPin className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">Your Gym's Grades</h3>
                  <p className="text-text-secondary text-base md:text-lg font-light leading-relaxed">
                    Configure your gym, use its real colors and grades, and log boulder, route, or mixed sessions with a scale adapted to where you climb.
                  </p>
                </div>
                <div className="flex-1 relative flex items-center justify-center mt-auto pb-10">
                   <DeviceMockup 
                      type="phone"
                      className="w-[50%] max-w-[250px] shadow-[0_20px_50px_var(--shadow-medium)]"
                      imageSrc="/pogo/gymdetalle.jpeg"
                      alt="Your Gym's Grades"
                   />
                </div>
             </motion.div>
          </div>

          {/* Bottom Callout */}
          <div className="mt-24 mb-10 p-12 md:p-20 rounded-[2.5rem] border border-card-border bg-card-element text-center relative overflow-hidden backdrop-blur-xl">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] bg-slate-500/5 rounded-[100%] blur-[80px] pointer-events-none"></div>
             <Mountain className="w-12 h-12 text-text-secondary mx-auto mb-8 opacity-60" />
             <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">A smarter way to climb</h2>
             <p className="text-text-secondary text-xl font-light leading-relaxed max-w-2xl mx-auto">
               From quick session logging to long-term statistics, Pogo offers climbers a personal space to record, analyze, and grow in the world of bouldering.
             </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
