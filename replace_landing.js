import fs from 'fs';

const lines = fs.readFileSync('src/pages/LandingPage.tsx', 'utf8').split('\n');
const startIdx = lines.findIndex(l => l.includes('{/* Featured Product: RhumbNav */}'));
const endIdx = lines.findIndex(l => l.includes('{/* About Section */}'));

if (startIdx !== -1 && endIdx !== -1) {
    const before = lines.slice(0, startIdx);
    const after = lines.slice(endIdx);
    
    const newContent = `      {/* Featured Products */}
      <section id="products" className="py-32 overflow-hidden bg-surface-container-low/50 scroll-mt-12 md:scroll-mt-16">
        <div className="max-w-7xl mx-auto px-8 relative">
          <div className="flex justify-between items-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">Our Products</h2>
            <div className="flex gap-4">
              <button 
                onClick={() => setCurrentProduct(prev => prev === 0 ? 1 : 0)}
                className="w-12 h-12 rounded-full border border-outline-variant/20 flex items-center justify-center hover:bg-surface-container-highest transition-colors text-slate-300"
                aria-label="Previous Product"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={() => setCurrentProduct(prev => prev === 0 ? 1 : 0)}
                className="w-12 h-12 rounded-full border border-outline-variant/20 flex items-center justify-center hover:bg-surface-container-highest transition-colors text-slate-300"
                aria-label="Next Product"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="relative w-full overflow-hidden">
            <motion.div 
              className="flex w-full"
              animate={{ x: \`-\${100 * currentProduct}%\` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Product 1: RhumbNav */}
              <div className="w-full flex-shrink-0 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
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
                    <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full -z-10"></div>
                    <motion.div 
                      key="rhumbnav-tablet"
                      initial={{ opacity: 0, y: 30, rotate: -4 }}
                      whileInView={{ opacity: 1, y: 0, rotate: -2 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, type: "spring" }}
                      className="absolute top-4 md:top-10 left-0 w-[85%] rounded-[1.5rem] md:rounded-[2rem] border-[6px] md:border-[8px] border-slate-800 bg-slate-950 shadow-2xl overflow-hidden aspect-[16/10] z-10"
                    >
                      <div className="absolute left-0 inset-y-0 w-4 md:w-6 bg-slate-800 flex justify-center items-center z-20">
                         <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-slate-950 rounded-full"></div>
                      </div>
                      <img alt="RhumbNav Tablet Interface" className="w-full h-full object-contain pl-4 md:pl-6" src="/LogbookTablet.jpeg" />
                    </motion.div>
                    
                    <motion.div 
                      key="rhumbnav-phone"
                      initial={{ opacity: 0, y: 50, x: 20, rotate: 8 }}
                      whileInView={{ opacity: 1, y: 0, x: 0, rotate: 4 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2, type: "spring" }}
                      className="absolute -bottom-4 md:-bottom-10 right-0 w-[35%] rounded-[1.5rem] md:rounded-[2.5rem] border-[4px] md:border-[6px] border-slate-800 bg-slate-950 shadow-[0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden aspect-[9/19] z-20"
                    >
                      <img alt="RhumbNav Mobile Interface" className="w-full h-full object-contain" src="/FPL.jpeg" />
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Product 2: Pogo */}
              <div className="w-full flex-shrink-0 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                <div className="lg:col-span-5 order-1 lg:order-2">
                  <h3 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tighter text-on-surface">Pogo</h3>
                  <div className="relative z-20">
                    <p className="text-on-surface-variant text-lg leading-relaxed mb-8">
                      Pogo is a new light EFB shaped by real flight experience, bringing flight planning, navigation, and in-flight awareness into one seamless experience.
                    </p>
                    <ul className="space-y-4 mb-10">
                      <li className="flex items-center gap-3 text-secondary">
                        <CheckCircle2 className="text-primary w-5 h-5" />
                        <span>Precision for every calculation</span>
                      </li>
                      <li className="flex items-center gap-3 text-secondary">
                        <CheckCircle2 className="text-primary w-5 h-5" />
                        <span>Your documents, all in one place</span>
                      </li>
                      <li className="flex items-center gap-3 text-secondary">
                        <CheckCircle2 className="text-primary w-5 h-5" />
                        <span>Built for confident flying</span>
                      </li>
                    </ul>
                    <Link to="/pogo" className="font-bold text-primary flex items-center gap-2 group w-fit">
                      Learn more about Pogo
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </Link>
                  </div>
                </div>
                <div className="lg:col-span-7 order-2 lg:order-1">
                  <div className="relative w-full aspect-[16/10] flex items-center justify-center">
                    <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full -z-10"></div>
                    <motion.div 
                      key="pogo-tablet"
                      initial={{ opacity: 0, y: 30, rotate: -4 }}
                      whileInView={{ opacity: 1, y: 0, rotate: -2 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, type: "spring" }}
                      className="absolute top-4 md:top-10 left-0 w-[85%] rounded-[1.5rem] md:rounded-[2rem] border-[6px] md:border-[8px] border-slate-800 bg-slate-950 shadow-2xl overflow-hidden aspect-[16/10] z-10"
                    >
                      <div className="absolute left-0 inset-y-0 w-4 md:w-6 bg-slate-800 flex justify-center items-center z-20">
                         <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-slate-950 rounded-full"></div>
                      </div>
                      <img alt="Pogo Tablet Interface" className="w-full h-full object-contain xl:object-cover pl-4 md:pl-6" src="/pilotqr_horizontal.jpeg" />
                    </motion.div>
                    
                    <motion.div 
                      key="pogo-phone"
                      initial={{ opacity: 0, y: 50, x: 20, rotate: 8 }}
                      whileInView={{ opacity: 1, y: 0, x: 0, rotate: 4 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2, type: "spring" }}
                      className="absolute -bottom-4 md:-bottom-10 right-0 w-[35%] rounded-[1.5rem] md:rounded-[2.5rem] border-[4px] md:border-[6px] border-slate-800 bg-slate-950 shadow-[0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden aspect-[9/19] z-20"
                    >
                      <img alt="Pogo Mobile Interface" className="w-full h-full object-contain" src="/w&b2.jpeg" />
                    </motion.div>
                  </div>
                </div>
              </div>

            </motion.div>
          </div>
        </div>
      </section>
`;

    const finalContent = [...before, newContent, ...after].join('\n');
    fs.writeFileSync('src/pages/LandingPage.tsx', finalContent);
} else {
    console.log("Could not find start or end index", startIdx, endIdx);
}
