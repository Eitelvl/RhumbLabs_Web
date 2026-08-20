import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'motion/react';
import TopBar from '../components/TopBar';
import Footer from '../components/Footer';
import { SafeImage } from '../components/SafeImage';
import { 
  ArrowRight, 
  Sparkles, 
  Terminal, 
  Layers, 
  Cpu, 
  Compass, 
  Flame, 
  Boxes,
  Code2, 
  CheckCircle2, 
  Workflow, 
  Microscope,
  Zap
} from 'lucide-react';

export default function AboutPage() {
  const customCapabilities = [
    'Web applications',
    'Mobile applications',
    'Internal tools',
    'APIs and backend systems',
    'Automation',
    'Data-driven platforms',
    'Custom digital products'
  ];

  const labFocusAreas = [
    { title: 'New Technologies', desc: 'Evaluating emerging runtimes, frameworks, and edge computing models.', icon: Cpu },
    { title: 'Applied AI', desc: 'Integrating pragmatic, local, and multimodal intelligence directly into workflows.', icon: Sparkles },
    { title: 'Automation Engines', desc: 'Removing manual friction through declarative scripts and resilient pipelines.', icon: Zap },
    { title: 'Interface Systems', desc: 'Crafting responsive, tactile, and zero-latency user interactions.', icon: Layers },
    { title: 'Developer Tooling', desc: 'Building internal CLI tools, mock generators, and diagnostics.', icon: Terminal },
    { title: 'Rapid Prototypes', desc: 'Validating product hypotheses in days rather than quarters.', icon: Microscope }
  ];

  const workSteps = [
    {
      num: '01',
      title: 'Understand',
      desc: 'We start by understanding the problem, not by choosing the technology. We dig into constraints, user friction, and fundamental requirements before writing a single line of code.'
    },
    {
      num: '02',
      title: 'Shape',
      desc: 'We turn ideas and requirements into a clear product and technical direction. Architecture, data models, interfaces, and roadmaps are forged with deliberate precision.'
    },
    {
      num: '03',
      title: 'Build',
      desc: 'We design, engineer, test, and iterate until the thing actually works. Clean code, robust type systems, and performant backends built to withstand real-world use.'
    },
    {
      num: '04',
      title: 'Launch',
      desc: 'We ship it, learn from it, and keep improving it. Observability, continuous feedback loops, and thoughtful iterations ensure the software stays alive and thriving.'
    }
  ];

  // Interactive Lab Oscilloscope / Visualizer Component
  const LabOscilloscope = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let animationId: number;
      let phase = 0;

      const render = () => {
        const width = canvas.width;
        const height = canvas.height;
        ctx.clearRect(0, 0, width, height);

        // Draw subtle grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.lineWidth = 1;
        const gridSize = 24;
        for (let x = 0; x < width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        // Draw sine wave 1 (Cyan)
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.75)';
        for (let x = 0; x < width; x++) {
          const y = height / 2 + Math.sin((x * 0.02) + phase) * 22 + Math.sin((x * 0.04) - phase * 0.5) * 10;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Draw sine wave 2 (Magenta / Violet)
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.65)';
        for (let x = 0; x < width; x++) {
          const y = height / 2 + Math.cos((x * 0.018) - phase * 0.8) * 18 + Math.cos((x * 0.035) + phase * 0.4) * 8;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Active node pulse
        const nodeX = (width * 0.65 + Math.sin(phase) * 60);
        const nodeY = height / 2 + Math.sin((nodeX * 0.02) + phase) * 22 + Math.sin((nodeX * 0.04) - phase * 0.5) * 10;
        
        ctx.beginPath();
        ctx.arc(nodeX, nodeY, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#00F2FE';
        ctx.shadowColor = '#00F2FE';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        phase += 0.025;
        animationId = requestAnimationFrame(render);
      };

      render();

      return () => {
        cancelAnimationFrame(animationId);
      };
    }, []);

    return (
      <div className="w-full h-44 rounded-2xl bg-bg-primary border border-card-border overflow-hidden relative flex flex-col justify-between p-4 shadow-sm">
        <div className="flex items-center justify-between text-[11px] text-text-secondary font-mono tracking-wider z-10">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            SYS.EXP // LIVE TELEMETRY
          </span>
          <span className="opacity-70">240Hz · ACTIVE RUNTIME</span>
        </div>
        <canvas 
          ref={canvasRef} 
          width={480} 
          height={160} 
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
        <div className="flex items-center justify-between text-[11px] text-text-secondary font-mono z-10 pt-2 border-t border-card-border">
          <span>PROTO: STATE_SYNC</span>
          <span className="text-cyan-400">READY</span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-bg-primary text-text-primary min-h-screen selection:bg-card-border selection:text-text-primary">
      <TopBar />

      <main className="relative z-10">
        
        {/* =========================================================================
            01 — HERO SECTION
            ========================================================================= */}
        <section className="min-h-[85vh] md:min-h-[88vh] pt-28 md:pt-36 pb-16 md:pb-24 px-6 lg:px-12 max-w-6xl mx-auto text-center flex flex-col justify-center items-center">
          
          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-text-primary mb-8 leading-[1.06] max-w-5xl"
          >
            We build things <br className="hidden sm:block" /> that should exist.
          </motion.h1>

          {/* Supporting Text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-lg sm:text-xl md:text-2xl text-text-secondary max-w-3xl leading-relaxed font-light mb-12"
          >
            Rhumb Labs is a technology company building products, software, and custom digital experiences — from our own ideas to solutions built around yours.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              to="/products"
              className="px-8 py-4 rounded-full bg-card-element hover:bg-bg-secondary border border-card-border text-text-primary text-sm font-semibold transition-all duration-300 flex items-center gap-2 shadow-sm"
            >
              Our Products
              <ArrowRight className="w-4 h-4 text-cyan-400" />
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 rounded-full brand-btn-primary text-sm font-semibold transition-all duration-300 flex items-center gap-2"
            >
              Start a Project
            </Link>
          </motion.div>
        </section>


        {/* =========================================================================
            02 — WHAT IS RHUMB LABS? (Editorial Statement)
            ========================================================================= */}
        <section className="py-20 md:py-32 px-6 lg:px-12 border-t border-border-subtle">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-start">
              
              <div className="md:col-span-4">
                <span className="text-xs font-mono font-semibold tracking-widest text-text-secondary uppercase block mb-3">
                  02 / IDENTITY
                </span>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary leading-snug">
                  A small lab <br className="hidden md:block"/> for big ideas.
                </h2>
              </div>

              <div className="md:col-span-8 flex flex-col gap-6 text-text-secondary text-lg md:text-xl font-light leading-relaxed">
                <p>
                  Rhumb Labs is where ideas become software. We design and build our own products, explore new technologies, and work on custom projects that demand something beyond the ordinary.
                </p>
                <p className="text-text-primary font-normal">
                  Some things we build for ourselves. Some we build with others. The common thread is simple: start with a problem, understand it deeply, and build the right thing.
                </p>
              </div>

            </div>
          </div>
        </section>


        {/* =========================================================================
            03 — WHAT WE DO (3 Visual Pillar Cards)
            ========================================================================= */}
        <section className="py-20 md:py-32 px-6 lg:px-12 border-t border-border-subtle">
          <div className="max-w-6xl mx-auto">
            
            <div className="mb-16 md:mb-20">
              <span className="text-xs font-mono font-semibold tracking-widest text-text-secondary uppercase block mb-3">
                03 / CAPABILITIES
              </span>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-text-primary">
                What we do.
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              
              {/* Pillar 1: PRODUCTS */}
              <div className="linear-card backdrop-blur-xl rounded-3xl p-8 flex flex-col justify-between hover:border-cyan-500/40 transition-all duration-300 relative overflow-hidden group">
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60">
                      PRODUCTS
                    </span>
                    <Boxes className="w-5 h-5 text-cyan-400/80" />
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight mb-3">
                    We build our own.
                  </h3>
                  <p className="text-text-secondary text-sm md:text-base leading-relaxed mb-8 font-light">
                    We create and operate software products under the Rhumb Labs umbrella.
                  </p>

                  <div className="space-y-4 pt-6 border-t border-border-subtle">
                    <Link to="/rhumbnav" className="block p-4 rounded-2xl linear-card hover:border-cyan-500/50 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-text-primary text-sm flex items-center gap-1.5">
                          <Compass className="w-4 h-4 text-cyan-400" />
                          RhumbNav
                        </span>
                        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-800/60">EFB</span>
                      </div>
                      <p className="text-xs text-text-secondary font-light">A navigation-focused product developed by Rhumb Labs.</p>
                    </Link>

                    <Link to="/pogo" className="block p-4 rounded-2xl linear-card hover:border-fuchsia-500/50 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-text-primary text-sm flex items-center gap-1.5">
                          <Flame className="w-4 h-4 text-fuchsia-400" />
                          Pogo
                        </span>
                        <span className="text-[10px] font-mono text-fuchsia-400 bg-fuchsia-950/80 px-2 py-0.5 rounded-full border border-fuchsia-800/60">BOULDERING</span>
                      </div>
                      <p className="text-xs text-text-secondary font-light">Another product within the Rhumb Labs ecosystem.</p>
                    </Link>
                  </div>
                </div>

                <div className="pt-8 mt-6">
                  <Link 
                    to="/products"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-text-primary hover:text-cyan-400 transition-colors group-hover:translate-x-1 duration-300"
                  >
                    Explore products
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Pillar 2: CUSTOM */}
              <div className="linear-card backdrop-blur-xl rounded-3xl p-8 flex flex-col justify-between hover:border-purple-500/40 transition-all duration-300 relative overflow-hidden group">
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-xs font-mono font-bold tracking-widest text-purple-400 uppercase px-3 py-1 rounded-full bg-purple-950/80 border border-purple-800/60">
                      CUSTOM
                    </span>
                    <Code2 className="w-5 h-5 text-purple-400/80" />
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight mb-3">
                    We build yours.
                  </h3>
                  <p className="text-text-secondary text-sm md:text-base leading-relaxed mb-6 font-light">
                    For ideas that need a custom solution, Rhumb Labs designs and develops software from the ground up.
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {customCapabilities.map((item) => (
                      <span 
                        key={item}
                        className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-bg-primary border border-card-border text-text-secondary"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-text-secondary leading-relaxed font-light italic border-t border-border-subtle pt-4">
                    Engineering and product thinking applied directly to your mission.
                  </p>
                </div>

                <div className="pt-8 mt-6">
                  <Link 
                    to="/contact"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-text-primary hover:text-purple-400 transition-colors group-hover:translate-x-1 duration-300"
                  >
                    Start a project
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Pillar 3: EXPERIMENTS */}
              <div className="linear-card backdrop-blur-xl rounded-3xl p-8 flex flex-col justify-between hover:border-cyan-400/40 transition-all duration-300 relative overflow-hidden group">
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-xs font-mono font-bold tracking-widest text-text-secondary uppercase px-3 py-1 rounded-full bg-card-element border border-card-border">
                      EXPERIMENTS
                    </span>
                    <Sparkles className="w-5 h-5 text-text-secondary" />
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight mb-3">
                    We explore what’s next.
                  </h3>
                  <p className="text-text-secondary text-sm md:text-base leading-relaxed mb-6 font-light">
                    Rhumb Labs also acts as a playground for ideas, prototypes, experiments, and technologies that may eventually become products.
                  </p>

                  {/* Visual Generative Micro Element */}
                  <div className="my-2">
                    <LabOscilloscope />
                  </div>
                </div>

                <div className="pt-6 mt-4 flex items-center justify-between text-xs text-text-secondary font-mono">
                  <span>ACTIVE LAB INITIATIVES</span>
                  <span className="text-cyan-400">ONGOING</span>
                </div>
              </div>

            </div>

          </div>
        </section>


        {/* =========================================================================
            04 — OUR PRODUCTS (Built Here)
            ========================================================================= */}
        <section className="py-20 md:py-32 px-6 lg:px-12 border-t border-border-subtle">
          <div className="max-w-6xl mx-auto">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 md:mb-20">
              <div>
                <span className="text-xs font-mono font-semibold tracking-widest text-text-secondary uppercase block mb-3">
                  04 / ECOSYSTEM
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-text-primary">
                  Built here.
                </h2>
              </div>
              <p className="text-text-secondary text-sm md:text-base max-w-md font-light">
                Products crafted with end-to-end focus on user simplicity, precision, and reliable real-time performance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Product 1: RhumbNav */}
              <Link 
                to="/rhumbnav"
                className="linear-card backdrop-blur-xl rounded-3xl p-8 flex flex-col justify-between hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.12)] transition-all duration-300 group"
              >
                <div>
                  {/* Card Header: Status Badge & Arrow */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold tracking-wider text-cyan-400 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-800/60 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                      IN DEVELOPMENT
                    </span>
                    <ArrowRight className="w-4 h-4 text-text-secondary group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                  </div>

                  {/* Logo Area: Left-Aligned */}
                  <div className="h-20 sm:h-24 flex items-center justify-start mb-6">
                    <SafeImage 
                      src="/images/rhumbnav-logo.png" 
                      alt="RhumbNav" 
                      className="h-10 sm:h-12 md:h-14 w-auto object-contain origin-left scale-[3] -translate-x-3"
                    />
                  </div>

                  <p className="text-text-secondary text-sm leading-relaxed font-light mb-6">
                    A navigation product built by Rhumb Labs. Light EFB shaping flight planning and in-flight awareness.
                  </p>
                </div>

                <div className="pt-6 border-t border-border-subtle flex items-center justify-between text-xs text-text-secondary font-medium">
                  <span>Aviation & Navigation</span>
                  <span className="text-text-primary group-hover:text-cyan-400 transition-colors">View product →</span>
                </div>
              </Link>

              {/* Product 2: Pogo */}
              <Link 
                to="/pogo"
                className="linear-card backdrop-blur-xl rounded-3xl p-8 flex flex-col justify-between hover:border-fuchsia-500/50 hover:shadow-[0_0_30px_rgba(192,38,211,0.12)] transition-all duration-300 group"
              >
                <div>
                  {/* Card Header: Status Badge & Arrow */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold tracking-wider text-fuchsia-400 bg-fuchsia-950/80 px-3 py-1 rounded-full border border-fuchsia-800/60 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400"></span>
                      AVAILABLE
                    </span>
                    <ArrowRight className="w-4 h-4 text-text-secondary group-hover:text-fuchsia-400 group-hover:translate-x-1 transition-all" />
                  </div>

                  {/* Logo Area: Left-Aligned */}
                  <div className="h-20 sm:h-24 flex items-center justify-start mb-6">
                    <SafeImage 
                      src="/images/pogo-logo.png" 
                      alt="Pogo" 
                      className="h-10 sm:h-12 md:h-14 w-auto object-contain origin-left scale-[3] -translate-y-3"
                    />
                  </div>

                  <p className="text-text-secondary text-sm leading-relaxed font-light mb-6">
                    Another idea from the lab, built into a real product. Dedicated climbing and bouldering session tracking.
                  </p>
                </div>

                <div className="pt-6 border-t border-border-subtle flex items-center justify-between text-xs text-text-secondary font-medium">
                  <span>Fitness & Analytics</span>
                  <span className="text-text-primary group-hover:text-fuchsia-400 transition-colors">View product →</span>
                </div>
              </Link>

              {/* Product 3: More Experiments Card */}
              <div className="linear-card backdrop-blur-xl border-dashed rounded-3xl p-8 flex flex-col justify-between">
                <div>
                  {/* Card Header: Status Badge & Sparkle */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold tracking-wider text-text-secondary bg-card-element px-3 py-1 rounded-full border border-card-border">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80"></span>
                      INCUBATING
                    </span>
                    <Sparkles className="w-4 h-4 text-text-secondary" />
                  </div>

                  {/* Logo Area / Focus */}
                  <div className="h-28 sm:h-32 md:h-36 flex flex-col justify-center mb-6">
                    <span className="font-mono text-xs text-cyan-400 mb-1">// WHAT'S NEXT</span>
                    <div className="text-xl font-bold text-text-primary">More experiments →</div>
                  </div>

                  <h3 className="text-2xl font-bold text-text-primary mb-2">
                    Continuously Brewing
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed font-light mb-6">
                    Rhumb Labs will continue prototyping and releasing new standalone software and developer utilities.
                  </p>
                </div>

                <div className="pt-6 border-t border-border-subtle flex items-center justify-between text-xs text-text-secondary font-mono">
                  <span>STATUS: ACTIVE LAB</span>
                  <span className="text-cyan-400">RESEARCH</span>
                </div>
              </div>

            </div>

          </div>
        </section>


        {/* =========================================================================
            05 — CUSTOM DEVELOPMENT (Conversion-Oriented & Direct)
            ========================================================================= */}
        <section className="py-20 md:py-32 px-6 lg:px-12 border-t border-border-subtle">
          <div className="max-w-5xl mx-auto">
            <div className="linear-card backdrop-blur-xl rounded-3xl p-8 sm:p-12 md:p-16 relative overflow-hidden">
              
              <div className="max-w-3xl relative z-10">
                <span className="text-xs font-mono font-semibold tracking-widest text-cyan-400 uppercase block mb-4">
                  05 / CUSTOM DEVELOPMENT
                </span>
                
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-text-primary mb-4 leading-tight">
                  Have something in mind?
                </h2>
                
                <p className="text-xl md:text-2xl font-medium text-text-primary mb-6">
                  Tell us what you're trying to build.
                </p>
                
                <p className="text-text-secondary text-base md:text-lg leading-relaxed font-light mb-10 max-w-2xl">
                  From an early idea to a production-ready platform, we can help design the product, architect the technology, and build the software behind it.
                </p>
                
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full brand-btn-primary text-sm font-semibold transition-all duration-300"
                >
                  Talk to Rhumb Labs
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>
          </div>
        </section>


        {/* =========================================================================
            06 — HOW WE WORK (4-Step Sequential Process)
            ========================================================================= */}
        <section className="py-20 md:py-32 px-6 lg:px-12 border-t border-border-subtle">
          <div className="max-w-6xl mx-auto">
            
            <div className="mb-16 md:mb-20">
              <span className="text-xs font-mono font-semibold tracking-widest text-text-secondary uppercase block mb-3">
                06 / METHODOLOGY
              </span>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-text-primary">
                How we work.
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {workSteps.map((step) => (
                <div 
                  key={step.num}
                  className="linear-card rounded-3xl p-7 flex flex-col justify-between hover:border-cyan-500/40 transition-all duration-300 group"
                >
                  <div>
                    <span className="text-2xl md:text-3xl font-mono font-bold text-text-secondary/40 group-hover:text-cyan-400 transition-colors block mb-6">
                      {step.num}
                    </span>
                    <h3 className="text-xl font-bold text-text-primary mb-3 tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed font-light">
                      {step.desc}
                    </p>
                  </div>
                  
                  <div className="pt-6 mt-6 border-t border-border-subtle flex items-center gap-2 text-xs font-mono text-text-secondary">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/60"></span>
                    STAGE {step.num}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>


        {/* =========================================================================
            07 — PHILOSOPHY (Large Typographic Statement)
            ========================================================================= */}
        <section className="py-32 md:py-48 px-6 lg:px-12 border-t border-border-subtle text-center flex flex-col items-center justify-center relative">
          <div className="max-w-4xl mx-auto">
            <span className="text-xs font-mono font-semibold tracking-widest text-text-secondary uppercase block mb-8">
              07 / CORE PHILOSOPHY
            </span>
            
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-text-primary mb-12 leading-[1.1]">
              Good software is invisible. <br />
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 bg-clip-text text-transparent">
                Good products aren't.
              </span>
            </h2>

            <p className="text-lg sm:text-xl md:text-2xl text-text-secondary leading-relaxed font-light max-w-3xl mx-auto">
              We care about the details people notice and the engineering they don't. The interface should feel simple. The technology behind it should be anything but accidental.
            </p>
          </div>
        </section>


        {/* =========================================================================
            08 — THE LAB (Experimental Focus & Domains)
            ========================================================================= */}
        <section className="py-20 md:py-32 px-6 lg:px-12 border-t border-border-subtle">
          <div className="max-w-6xl mx-auto">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
              <div className="lg:col-span-5">
                <span className="text-xs font-mono font-semibold tracking-widest text-text-secondary uppercase block mb-3">
                  08 / RESEARCH & EXPERIMENTATION
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-text-primary mb-6">
                  The lab is <br className="hidden lg:block"/> always open.
                </h2>
                <p className="text-text-secondary text-base md:text-lg leading-relaxed font-light">
                  Beyond production products, Rhumb Labs maintains continuous R&D exploring emerging computing paradigms, AI interfaces, and automation tools.
                </p>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {labFocusAreas.map((area) => {
                  const Icon = area.icon;
                  return (
                    <div 
                      key={area.title}
                      className="linear-card rounded-2xl p-6 hover:border-cyan-500/40 transition-all duration-300"
                    >
                      <div className="w-10 h-10 rounded-xl bg-bg-primary flex items-center justify-center border border-card-border mb-4 text-cyan-400">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-bold text-text-primary mb-1.5">
                        {area.title}
                      </h3>
                      <p className="text-xs text-text-secondary leading-relaxed font-light">
                        {area.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </section>


        {/* =========================================================================
            09 — FINAL CTA (Clean, Confident & Direct)
            ========================================================================= */}
        <section className="py-28 md:py-40 px-6 lg:px-12 border-t border-border-subtle text-center flex flex-col items-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-text-primary mb-6">
              Let's build something.
            </h2>
            
            <p className="text-lg sm:text-xl text-text-secondary leading-relaxed font-light mb-10 max-w-xl mx-auto">
              Have a product idea, a problem worth solving, or something that doesn't exist yet?
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/contact"
                className="px-8 py-4 rounded-full brand-btn-primary text-sm font-semibold transition-all duration-300 flex items-center gap-2"
              >
                Get in touch
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/products"
                className="px-8 py-4 rounded-full bg-card-element hover:bg-bg-secondary border border-card-border text-text-primary text-sm font-semibold transition-all duration-300 flex items-center gap-2"
              >
                Explore our products
                <ArrowRight className="w-4 h-4 text-cyan-400" />
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
