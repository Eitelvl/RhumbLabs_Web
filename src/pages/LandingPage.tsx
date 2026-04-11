import { ArrowRight, AtSign, CheckCircle2, Globe, Apple, Monitor } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import TopBar from '../components/TopBar';
import Footer from '../components/Footer';
import { motion } from 'motion/react';

// Custom Android Icon
const AndroidIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4483-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0004.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.25 13.8533 7.85 12 7.85s-3.5902.4-5.1367 1.1004L4.841 5.4467a.416.416 0 00-.5676-.1521.416.416 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3435-4.1021-2.6892-7.5743-6.1185-9.4396"/>
  </svg>
);

export default function LandingPage() {
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
    <div className="bg-surface text-on-surface min-h-screen overflow-x-hidden">
      <TopBar />

      {/* Hero Section */}
      <section id="home" className="relative pt-40 pb-32 overflow-hidden px-8 min-h-[85vh] flex items-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10"></div>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 items-center w-full">
          <div className="w-full lg:w-1/2 z-10">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-8 leading-[1.05]"
            >
              Where experience <br/><span className="text-primary">comes first.</span>
            </motion.h1>
          </div>
          
          <div className="w-full lg:w-1/2 relative h-[500px] flex items-center justify-center">
            {/* Decorative element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 blur-[100px] -z-10"></div>
            
            {/* iOS Card */}
            <motion.div 
              initial={{ opacity: 0, x: 50, y: -50 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1, delay: 0.4, type: "spring" }}
              className="absolute top-4 left-4 md:top-10 md:left-10 glass-panel p-8 rounded-2xl border border-outline-variant/20 cyan-glow flex flex-col items-center justify-center gap-4 w-40 h-40 md:w-48 md:h-48 z-20 bg-surface/40 backdrop-blur-2xl"
            >
              <Apple className="w-12 h-12 md:w-16 md:h-16 text-slate-100" />
              <span className="font-bold tracking-widest uppercase text-xs md:text-sm text-slate-300">iOS</span>
            </motion.div>

            {/* Android Card */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, type: "spring" }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 md:bottom-10 glass-panel p-8 rounded-2xl border border-outline-variant/20 cyan-glow flex flex-col items-center justify-center gap-4 w-48 h-48 md:w-56 md:h-56 z-30 bg-surface/50 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,229,255,0.15)]"
            >
              <AndroidIcon className="w-16 h-16 md:w-20 md:h-20 text-[#3DDC84]" />
              <span className="font-bold tracking-widest uppercase text-xs md:text-sm text-slate-300">Android</span>
            </motion.div>

            {/* Web Card */}
            <motion.div 
              initial={{ opacity: 0, x: -50, y: -50 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1, delay: 0.8, type: "spring" }}
              className="absolute top-16 right-4 md:top-20 md:right-10 glass-panel p-8 rounded-2xl border border-outline-variant/20 cyan-glow flex flex-col items-center justify-center gap-4 w-40 h-40 md:w-48 md:h-48 z-10 bg-surface/40 backdrop-blur-2xl"
            >
              <Monitor className="w-12 h-12 md:w-16 md:h-16 text-primary" />
              <span className="font-bold tracking-widest uppercase text-xs md:text-sm text-slate-300">Web</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Product: RhumbNav */}
      <section id="products" className="py-32 overflow-hidden bg-surface-container-low/50 scroll-mt-12 md:scroll-mt-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5 order-1 lg:order-2">
              <img src="/logo_horizontal.png" alt="RhumbNav" className="w-[300px] md:w-[450px] h-auto object-contain -mt-16 md:-mt-24 -ml-10 md:-ml-16 relative z-10" />
              <div className="-mt-8 md:-mt-12 relative z-20">
                <p className="text-on-surface-variant text-lg leading-relaxed mb-8">
                  RhumbNav is a modern aviation platform built to simplify flight planning, navigation, and in-flight awareness in one seamless experience.
                </p>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-center gap-3 text-secondary">
                    <CheckCircle2 className="text-primary w-5 h-5" />
                    <span>License & Logbook</span>
                  </li>
                  <li className="flex items-center gap-3 text-secondary">
                    <CheckCircle2 className="text-primary w-5 h-5" />
                    <span>E6B Computer</span>
                  </li>
                  <li className="flex items-center gap-3 text-secondary">
                    <CheckCircle2 className="text-primary w-5 h-5" />
                    <span>VFR Nav, Flight Planning & More</span>
                  </li>
                </ul>
                <Link to="/rhumbnav" className="font-bold text-primary flex items-center gap-2 group w-fit">
                  Learn more about RhumbNav
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </div>
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div className="relative w-full aspect-[16/10] flex items-center justify-center">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full -z-10"></div>
                
                {/* Tablet Mockup */}
                <motion.div 
                  initial={{ opacity: 0, y: 30, rotate: -4 }}
                  whileInView={{ opacity: 1, y: 0, rotate: -2 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, type: "spring" }}
                  className="absolute top-4 md:top-10 left-0 w-[85%] rounded-[1.5rem] md:rounded-[2rem] border-[6px] md:border-[8px] border-slate-800 bg-slate-950 shadow-2xl overflow-hidden aspect-[16/10] z-10"
                >
                  {/* Tablet Camera/Bezel */}
                  <div className="absolute left-0 inset-y-0 w-4 md:w-6 bg-slate-800 flex justify-center items-center z-20">
                     <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-slate-950 rounded-full"></div>
                  </div>
                  {/* Tablet Image */}
                  <img alt="RhumbNav Tablet Interface" className="w-full h-full object-contain pl-4 md:pl-6" src="/LogbookTablet.jpeg" />
                </motion.div>

                {/* Phone Mockup */}
                <motion.div 
                  initial={{ opacity: 0, y: 50, x: 20, rotate: 8 }}
                  whileInView={{ opacity: 1, y: 0, x: 0, rotate: 4 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2, type: "spring" }}
                  className="absolute -bottom-4 md:-bottom-10 right-0 w-[35%] rounded-[1.5rem] md:rounded-[2.5rem] border-[4px] md:border-[6px] border-slate-800 bg-slate-950 shadow-[0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden aspect-[9/19] z-20"
                >
                  {/* Phone Image */}
                  <img alt="RhumbNav Mobile Interface" className="w-full h-full object-contain" src="/FPL.jpeg" />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-40 bg-surface scroll-mt-12 md:scroll-mt-16">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-4xl font-bold mb-10">About Rhumb Labs</h2>
          <div className="h-1 w-24 bg-primary mx-auto mb-12"></div>
          <p className="text-2xl text-on-surface-variant font-light leading-relaxed mb-8">
            Rhumb Labs is a digital product studio focused on building thoughtful, modern software experiences. We care about clarity, functionality, and creating tools that feel intuitive from the very first interaction.
          </p>
          <p className="text-xl text-outline leading-relaxed mb-12">
            Our approach brings together design, clarity, and real-world usability to shape products that are simple, reliable, and built with purpose.
          </p>
          <Link to="/contact" className="inline-flex items-center justify-center h-16 px-12 bg-gradient-to-br from-primary to-primary-dim text-on-primary-container font-bold rounded-md hover:shadow-[0_0_25px_rgba(129,236,255,0.4)] transition-all text-xl mt-8">
            Contact Us
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
