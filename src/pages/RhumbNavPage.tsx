import TopBar from '../components/TopBar';
import Footer from '../components/Footer';
import { motion } from 'motion/react';

export default function RhumbNavPage() {
  return (
    <div className="bg-surface text-on-surface min-h-screen overflow-x-hidden flex flex-col">
      <TopBar />
      
      <main className="flex-grow pt-24 md:pt-32 pb-32 px-8 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10"></div>
        
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <img src="/logo_horizontal.png" alt="RhumbNav" className="w-[400px] md:w-[650px] lg:w-[800px] h-auto object-contain mx-auto mb-6" />
            <p className="text-2xl text-on-surface-variant max-w-3xl mx-auto leading-relaxed font-light mb-16">
              RhumbNav is a new light EFB shaped by real flight experience, bringing flight planning, navigation, and in-flight awareness into one seamless experience.
            </p>

            <div className="mt-20 space-y-32">
              {[
                {
                  title: "E6B Computer",
                  description: "Flight calculations made faster, cleaner, and easier. From wind correction to fuel planning, RhumbNav gives you the numbers that matter—without the clutter.",
                  image: "/w&b2.jpeg",
                  secondaryImage: "/computer.jpeg",
                  imageType: "both",
                  phonePosition: "left"
                },
                {
                  title: "License",
                  description: "All your pilot credentials in one refined digital space. Stay on top of medicals, ratings, endorsements, and important records with ease.",
                  image: "/pilotqr_horizontal.jpeg",
                  secondaryImage: "/license.jpeg",
                  imageType: "both",
                  phonePosition: "right"
                },
                {
                  title: "Navigation",
                  description: "Purpose-built VFR navigation for pilots who value clarity in the cockpit. Plan smarter, stay oriented, and fly with greater confidence.",
                  image: "/nav.jpeg",
                  secondaryImage: "/FPL.jpeg",
                  imageType: "both",
                  phonePosition: "right"
                },
                {
                  title: "Logbook",
                  description: "A smarter way to track your flying life. Keep flight time, landings, approaches, and records organized in a logbook built for modern aviation.",
                  image: "/LogbookTablet.jpeg",
                  secondaryImage: "/allFlight.jpeg",
                  imageType: "both",
                  phonePosition: "right"
                }
              ].map((feature, index) => (
                <div key={feature.title} className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16`}>
                  <div className="flex-1 text-left">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">{feature.title}</h2>
                    <p className="text-xl text-on-surface-variant leading-relaxed">{feature.description}</p>
                  </div>
                  <div className="flex-1 w-full flex justify-center">
                    {feature.imageType === 'both' ? (
                      <div className="relative w-full max-w-2xl aspect-[16/10] flex items-center justify-center mt-8 mb-12">
                        <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full -z-10"></div>
                        <motion.div 
                          initial={{ opacity: 0, y: 30, rotate: index % 2 === 0 ? -4 : 4 }}
                          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                          viewport={{ once: true, margin: "-100px" }}
                          transition={{ duration: 0.8, type: "spring" }}
                          className={`absolute top-0 ${feature.phonePosition === 'left' ? 'right-0' : 'left-0'} w-[85%] rounded-[1.5rem] md:rounded-[2rem] border-[6px] md:border-[8px] border-slate-800 bg-slate-950 shadow-2xl overflow-hidden aspect-[16/10] z-10`}
                        >
                          <div className="absolute left-0 inset-y-0 w-4 md:w-6 bg-slate-800 flex justify-center items-center z-20">
                             <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-slate-950 rounded-full"></div>
                          </div>
                          <img alt={`${feature.title} Tablet`} className="w-full h-full object-contain pl-4 md:pl-6" src={feature.image} />
                        </motion.div>
                        <motion.div 
                          initial={{ opacity: 0, y: 50, x: feature.phonePosition === 'left' ? -20 : 20, rotate: index % 2 === 0 ? 8 : -8 }}
                          whileInView={{ opacity: 1, y: 0, x: 0, rotate: index % 2 === 0 ? 4 : -4 }}
                          viewport={{ once: true, margin: "-100px" }}
                          transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
                          className={`absolute -bottom-8 md:-bottom-16 ${feature.phonePosition === 'left' ? 'left-0' : 'right-0'} w-[35%] rounded-[1.5rem] md:rounded-[2.5rem] border-[4px] md:border-[6px] border-slate-800 bg-slate-950 shadow-[0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden aspect-[9/19] z-20`}
                        >
                          <img alt={`${feature.title} Phone`} className="w-full h-full object-contain" src={feature.secondaryImage} />
                        </motion.div>
                      </div>
                    ) : feature.imageType === 'tablet' ? (
                      <div className="relative w-full max-w-2xl aspect-[16/10] flex items-center justify-center">
                        <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full -z-10"></div>
                        <motion.div 
                          initial={{ opacity: 0, y: 30, rotate: index % 2 === 0 ? -4 : 4 }}
                          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                          viewport={{ once: true, margin: "-100px" }}
                          transition={{ duration: 0.8, type: "spring" }}
                          className="w-[90%] rounded-[1.5rem] md:rounded-[2rem] border-[6px] md:border-[8px] border-slate-800 bg-slate-950 shadow-2xl overflow-hidden aspect-[16/10] z-10 relative"
                        >
                          <div className="absolute left-0 inset-y-0 w-4 md:w-6 bg-slate-800 flex justify-center items-center z-20">
                             <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-slate-950 rounded-full"></div>
                          </div>
                          <img alt={feature.title} className="w-full h-full object-contain pl-4 md:pl-6" src={feature.image} />
                        </motion.div>
                      </div>
                    ) : (
                      <div className="relative w-full max-w-sm aspect-[9/19] flex items-center justify-center">
                        <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full -z-10"></div>
                        <motion.div 
                          initial={{ opacity: 0, y: 30, rotate: index % 2 === 0 ? 6 : -6 }}
                          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                          viewport={{ once: true, margin: "-100px" }}
                          transition={{ duration: 0.8, type: "spring" }}
                          className="w-[75%] rounded-[2rem] md:rounded-[2.5rem] border-[4px] md:border-[6px] border-slate-800 bg-slate-950 shadow-[0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden aspect-[9/19] z-20 relative"
                        >
                          <img alt={feature.title} className="w-full h-full object-contain" src={feature.image} />
                        </motion.div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
