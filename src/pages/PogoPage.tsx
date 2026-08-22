import TopBar from '../components/TopBar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'motion/react';
import { DeviceMockup } from '../components/DeviceMockup';
import { Activity, MapPin, TrendingUp, NotebookPen, Mountain, Instagram, ArrowUpRight, Sparkles, Smartphone, QrCode } from 'lucide-react';
import { useRef } from 'react';
import { SafeImage } from '../components/SafeImage';

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
      
      <main className="pt-20 md:pt-24 pb-24 relative overflow-hidden" ref={containerRef}>
        
        {/* Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[500px] bg-purple-600/10 rounded-[100%] blur-[120px] pointer-events-none opacity-50"></div>

        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
          
          {/* Hero Section */}
          <div className="flex flex-col items-center text-center mt-2 md:mt-4 mb-20 md:mb-32">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center justify-center mb-3 md:mb-4 relative h-[200px] sm:h-[240px] md:h-[280px] lg:h-[300px] w-auto"
            >
              <SafeImage 
                src="/images/pogo-logo.png" 
                alt="Pogo Logo" 
                className="h-[200px] sm:h-[240px] md:h-[280px] lg:h-[300px] max-w-[90vw] md:max-w-none w-auto object-contain pointer-events-none origin-center scale-[1.75]"
              />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-bold tracking-tight mb-4 md:mb-5 leading-[1.08] text-text-primary"
            >
              Master every route. <br className="hidden md:block"/> Elevate your climb.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg sm:text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed font-light mb-8 md:mb-10"
            >
              Designed exclusively for the climbing community. Log your sessions, analyze your progress, and stay motivated with a digital companion built for the wall.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <Link
                to="/pogo/event"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-semibold shadow-[0_0_40px_rgba(168,85,247,0.3)] hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                <QrCode className="w-6 h-6" aria-hidden="true" />
                Open Pogo Event
              </Link>

              <a
                href="https://play.google.com/store/apps/details?id=com.rhumblabs.pogo&hl=es_419"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-card-element border border-card-border rounded-full text-text-primary font-medium shadow-[0_0_40px_rgba(168,85,247,0.15)] hover:bg-bg-secondary transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#3DDC84]" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4483-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0004.5511-.4482.9997-.9993.9997zm-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997zm11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0216 3.503C15.5902 8.244 13.8533 7.85 12 7.85c-1.8533 0-3.5902.394-5.1375 1.1002L4.841 5.447a.416.416 0 00-.5676-.1521.416.416 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.44z"/>
                </svg>
                Download for Android
              </a>

              <a
                href="https://testflight.apple.com/join/rW2JwgUW"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-card-element border border-card-border rounded-full text-text-primary font-medium shadow-[0_0_40px_rgba(168,85,247,0.15)] hover:bg-bg-secondary hover:border-purple-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                <Smartphone className="w-6 h-6" aria-hidden="true" />
                Join the Beta Testing
              </a>
            </motion.div>
          </div>

          {/* Epic Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
             {/* Feature 1 - Wide Card */}
             <motion.div 
               whileHover={{ y: -5 }}
               className="md:col-span-2 group relative rounded-[2.5rem] linear-card backdrop-blur-xl overflow-hidden min-h-[500px] md:min-h-[600px] flex flex-col md:flex-row items-center"
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

                <div className="flex-1 w-full relative h-[450px] md:h-[600px] flex items-center justify-center overflow-hidden">
                   <motion.div style={{ y }} className="w-full h-full flex justify-center items-center gap-4 px-6">
                      {/* Light Mode Mockups (English) */}
                      <DeviceMockup 
                        type="phone"
                        className="show-in-light w-[45%] max-w-[160px] md:max-w-[210px] shadow-[0_20px_60px_var(--shadow-heavy)] rotate-[-6deg]"
                        imageSrc="/images/pogo-active-session-light.jpg"
                        alt="Log Active Session Light"
                      />
                      <DeviceMockup 
                        type="phone"
                        className="show-in-light w-[45%] max-w-[160px] md:max-w-[210px] shadow-[0_20px_60px_var(--shadow-heavy)] rotate-[6deg] translate-y-6"
                        imageSrc="/images/pogo-session-detail-light.jpg"
                        alt="Session Detail Light"
                      />

                      {/* Dark Mode Mockups (Spanish) */}
                      <DeviceMockup 
                        type="phone"
                        className="show-in-dark w-[45%] max-w-[160px] md:max-w-[210px] shadow-[0_20px_60px_var(--shadow-heavy)] rotate-[-6deg]"
                        imageSrc="/images/pogo-active-session-dark.jpg"
                        alt="Log Active Session Dark"
                      />
                      <DeviceMockup 
                        type="phone"
                        className="show-in-dark w-[45%] max-w-[160px] md:max-w-[210px] shadow-[0_20px_60px_var(--shadow-heavy)] rotate-[6deg] translate-y-6"
                        imageSrc="/images/pogo-session-detail-dark.jpg"
                        alt="Session Detail Dark"
                      />
                   </motion.div>
                </div>
             </motion.div>

             {/* Feature 2 - Tall Card */}
             <motion.div 
               whileHover={{ y: -5 }}
               className="group relative rounded-[2.5rem] linear-card backdrop-blur-xl overflow-hidden min-h-[500px] flex flex-col"
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
                   {/* Light Mode Mockup (English) */}
                   <DeviceMockup 
                      type="phone"
                      className="show-in-light w-[50%] max-w-[250px] shadow-[0_20px_50px_var(--shadow-medium)]"
                      imageSrc="/images/pogo-summary-light.jpg"
                      alt="Clear Progression Light"
                   />
                   {/* Dark Mode Mockup (Spanish) */}
                   <DeviceMockup 
                      type="phone"
                      className="show-in-dark w-[50%] max-w-[250px] shadow-[0_20px_50px_var(--shadow-medium)]"
                      imageSrc="/images/pogo-summary-dark.jpg"
                      alt="Clear Progression Dark"
                   />
                </div>
             </motion.div>

             {/* Feature 3 - Tall Card */}
             <motion.div 
               whileHover={{ y: -5 }}
               className="group relative rounded-[2.5rem] linear-card backdrop-blur-xl overflow-hidden min-h-[500px] flex flex-col"
             >
                <div className="p-10 md:p-14 z-10">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-8">
                     <Activity className="w-6 h-6 text-amber-400" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">Complete History</h3>
                  <p className="text-text-secondary text-base md:text-lg font-light leading-relaxed">
                     Navigate and review your climbing records. Explore previous logs and see how you have excelled over sessions.
                  </p>
                </div>
                <div className="flex-1 relative flex items-center justify-center mt-auto pb-10">
                   {/* Light Mode Mockup (English) */}
                   <DeviceMockup 
                      type="phone"
                      className="show-in-light w-[50%] max-w-[250px] shadow-[0_20px_50px_var(--shadow-medium)]"
                      imageSrc="/images/pogo-history-light.jpg"
                      alt="Climbing History Light"
                   />
                   {/* Dark Mode Mockup (Spanish) */}
                   <DeviceMockup 
                      type="phone"
                      className="show-in-dark w-[50%] max-w-[250px] shadow-[0_20px_50px_var(--shadow-medium)]"
                      imageSrc="/images/pogo-history-dark.jpg"
                      alt="Climbing History Dark"
                   />
                </div>
             </motion.div>

             {/* Feature 4 - Wide Card */}
             <motion.div 
               whileHover={{ y: -5 }}
               className="md:col-span-2 group relative rounded-[2.5rem] linear-card backdrop-blur-xl overflow-hidden min-h-[500px] md:min-h-[600px] flex flex-col md:flex-row items-center"
             >
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
                
                <div className="flex-1 p-10 md:p-16 lg:p-20 z-10">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-8">
                     <MapPin className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Unlock Achievements</h2>
                  <p className="text-text-secondary text-lg md:text-xl font-light leading-relaxed max-w-xl">
                    Push your limits and unlock achievements. Log boulder, route, or mixed sessions with a scale adapted to where you climb and earn milestone badges.
                  </p>
                </div>

                <div className="flex-1 w-full relative h-[400px] md:h-[600px] flex items-center justify-center overflow-hidden">
                   <motion.div style={{ y }} className="w-full h-full flex justify-center items-center">
                      {/* Light Mode Mockup (English) */}
                      <DeviceMockup 
                        type="phone"
                        className="show-in-light w-[60%] md:w-[70%] max-w-[300px] shadow-[0_20px_60px_var(--shadow-heavy)] rotate-[4deg]"
                        imageSrc="/images/pogo-achievements-light.jpg"
                        alt="Unlock Achievements Light"
                      />
                      {/* Dark Mode Mockup (Spanish) */}
                      <DeviceMockup 
                        type="phone"
                        className="show-in-dark w-[60%] md:w-[70%] max-w-[300px] shadow-[0_20px_60px_var(--shadow-heavy)] rotate-[4deg]"
                        imageSrc="/images/pogo-achievements-dark.jpg"
                        alt="Unlock Achievements Dark"
                      />
                   </motion.div>
                </div>
             </motion.div>
          </div>

          {/* Bottom Promotional Callout */}
          <div className="mt-24 mb-10 p-10 sm:p-14 md:p-20 rounded-[2.5rem] linear-card text-center relative overflow-hidden backdrop-blur-xl">
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
             <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[100px] pointer-events-none -translate-x-1/3 translate-y-1/3"></div>
             
             <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
               {/* Icon / Emblem */}
               <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center mb-8 shadow-sm">
                  <Mountain className="w-8 h-8 text-fuchsia-400" />
               </div>

               {/* Headline */}
               <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight text-text-primary">
                 Join the Community Now!
               </h2>

               {/* Body */}
               <p className="text-text-secondary text-lg sm:text-xl font-light leading-relaxed mb-10 max-w-2xl">
                 From quick session logging to long-term statistics, Pogo offers climbers a personal space to record, analyze, and grow. Download the app today and connect with our community on Instagram.
               </p>

               {/* Action Buttons: App Download & Instagram */}
               <div className="flex flex-wrap items-center justify-center gap-4 w-full mb-8">
                 {/* Google Play Download */}
                 <a
                   href="https://play.google.com/store/apps/details?id=com.rhumblabs.pogo&hl=es_419"
                   target="_blank"
                   rel="noopener noreferrer"
                   className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-card-element border border-card-border hover:border-purple-500/50 hover:bg-bg-primary rounded-full text-text-primary font-semibold text-sm shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-all duration-300 group"
                 >
                   <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#3DDC84] shrink-0" xmlns="http://www.w3.org/2000/svg">
                     <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4483-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0004.5511-.4482.9997-.9993.9997zm-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997zm11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0216 3.503C15.5902 8.244 13.8533 7.85 12 7.85c-1.8533 0-3.5902.394-5.1375 1.1002L4.841 5.447a.416.416 0 00-.5676-.1521.416.416 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.44z"/>
                   </svg>
                   <span>Download on Android</span>
                   <ArrowUpRight className="w-4 h-4 text-text-secondary group-hover:text-fuchsia-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                 </a>

                 {/* iOS TestFlight Beta Link */}
                 <a
                   href="https://testflight.apple.com/join/rW2JwgUW"
                   target="_blank"
                   rel="noopener noreferrer"
                   className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-card-element border border-card-border hover:border-purple-500/50 hover:bg-bg-primary rounded-full text-text-primary font-semibold text-sm shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-all duration-300 group"
                 >
                   <Smartphone className="w-5 h-5 shrink-0" aria-hidden="true" />
                   <span>Join iOS Beta</span>
                   <ArrowUpRight className="w-4 h-4 text-text-secondary group-hover:text-purple-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                 </a>

                 {/* Instagram Community Link */}
                 <a
                   href="https://www.instagram.com/app.pogoclimb/"
                   target="_blank"
                   rel="noopener noreferrer"
                   className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-fuchsia-600/20 via-pink-600/20 to-amber-600/20 border border-fuchsia-500/40 hover:border-fuchsia-500 rounded-full text-text-primary font-semibold text-sm shadow-[0_0_25px_rgba(217,70,239,0.15)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group"
                 >
                   <Instagram className="w-5 h-5 text-pink-400 group-hover:scale-110 transition-transform" />
                   <span>Follow on Instagram</span>
                   <ArrowUpRight className="w-4 h-4 text-pink-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                 </a>
               </div>

               {/* Sub-Badges / Quick Info */}
               <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-text-secondary font-mono">
                 <span className="flex items-center gap-1.5">
                   <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
                   Free on Google Play
                 </span>
                 <span className="text-border-subtle">•</span>
                 <span>TestFlight iOS Open Beta</span>
                 <span className="text-border-subtle">•</span>
                 <span>@app.pogoclimb</span>
               </div>
             </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
