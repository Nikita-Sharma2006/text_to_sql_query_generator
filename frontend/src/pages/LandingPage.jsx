import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Database, 
  Monitor, 
  Compass, 
  Cpu,
  Layers,
  ArrowRight,
  Code
} from 'lucide-react';
import Button from '../components/Button';
import Footer from '../components/Footer';

const LandingPage = () => {
  const features = [
    {
      title: 'AI Intellect Core',
      desc: 'Formulate flawless, highly-optimized SQL queries directly from pure English prompts using state-of-the-art NLP models.',
      icon: Sparkles
    },
    {
      title: 'Citadel Security',
      desc: 'Your schemas and queries are guarded inside local state containers. No sensitive database credentials ever escape your viewport.',
      icon: ShieldCheck
    },
    {
      title: 'Lightning Compiler',
      desc: 'Generate, validate, and explain queries in fractions of a second. Optimize database execution speeds dynamically.',
      icon: Zap
    },
    {
      title: 'Schema Intelligence',
      desc: 'Feed your SQL schema declarations directly to the engine. Generated queries automatically adapt to your tables and key relations.',
      icon: Database
    },
    {
      title: 'Responsive Workspace',
      desc: 'Command your databases from your phone, tablet, laptop, or desktop. Optimized for every viewpoint and resolution.',
      icon: Monitor
    },
    {
      title: 'Minimal Aesthetic',
      desc: 'Clean layouts meet a premium SaaS palette. A distraction-free workspace designed specifically for database developers.',
      icon: Compass
    }
  ];

  return (
    <div className="min-h-screen bg-bg-default text-primary selection:bg-accent selection:text-primary flex flex-col relative overflow-hidden font-sans grid-bg">
      
      {/* Floating Glass Navigation */}
      <div className="w-full px-4 sm:px-6 lg:px-8 mt-6 sticky top-6 z-50">
        <nav className="max-w-5xl mx-auto px-6 py-3.5 flex justify-between items-center rounded-full glass-nav shadow-xs bg-white/70 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-primary text-accent shadow-sm">
              <Layers size={16} />
            </div>
            <span className="font-display font-extrabold text-sm tracking-tight text-primary uppercase">SHOGUN SQL</span>
          </div>

          <div className="hidden md:flex gap-6 items-center font-sans text-xs font-semibold text-secondary">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">Workflow</a>
            <a href="#why-us" className="hover:text-primary transition-colors">Citadel Guarantee</a>
            <span className="h-4 w-px bg-border-light"></span>
            <Link to="/login" className="hover:text-primary transition-colors">Log In</Link>
            <Link to="/register">
              <Button size="sm" variant="primary">Get Started</Button>
            </Link>
          </div>

          {/* Mobile menu links */}
          <div className="md:hidden flex gap-2.5 font-sans text-xs font-semibold">
            <Link to="/login" className="py-1.5 px-3 text-secondary hover:text-primary transition-colors">Login</Link>
            <Link to="/register" className="py-1.5 px-3 bg-primary text-white rounded-full hover:bg-neutral-800 transition-colors">Register</Link>
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="max-w-[1280px] mx-auto w-full px-6 py-16 md:py-24 grid md:grid-cols-12 gap-12 items-center relative z-10 flex-1">
        
        {/* Left Column: Headline */}
        <div className="md:col-span-7 text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/15 border border-accent/30 rounded-full text-primary font-sans text-xs font-semibold tracking-tight">
            <Cpu size={12} className="text-primary" />
            Artificial Intelligence x Modern Engineering
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold tracking-tight text-primary leading-[1.05]">
            AI-Integrated <br/>
            <span className="text-secondary select-none">MySQL Query</span> <br/>
            Generator.
          </h1>
          
          <p className="text-base md:text-lg font-sans text-secondary leading-relaxed max-w-xl">
            Transform natural language queries into production-ready, highly-optimized MySQL statements in seconds. Let the compiler respect your database architecture.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link to="/register">
              <Button size="lg" variant="primary" className="shadow-md hover:shadow-lg flex items-center gap-2">
                Forge Your First Query
                <ArrowRight size={16} />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="secondary">
                Login Workspace
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Column: Hero Art (Abstract Code Mockup) */}
        <div className="md:col-span-5 relative flex justify-center items-center">
          <div className="absolute w-72 h-72 bg-accent/10 filter blur-[80px] rounded-full -z-10"></div>
          
          {/* Pure CSS Geometric SaaS Code Layout */}
          <div className="border border-border-light bg-white rounded-2xl shadow-xl w-full p-4 space-y-4 max-w-[420px] aspect-[1.1] relative glow-hover overflow-hidden">
            {/* Window controls */}
            <div className="flex items-center gap-1.5 border-b border-border-light pb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
              <span className="text-[10px] text-secondary font-mono ml-2">shogun_compiler.sql</span>
            </div>

            {/* Prompt input card mockup */}
            <div className="bg-[#FAFAFA] border border-border-light rounded-xl p-3 text-[11px] text-secondary font-sans leading-relaxed relative">
              <span className="absolute top-2 right-2 px-1.5 py-0.2 bg-accent text-[9px] font-semibold rounded-md">Input Prompt</span>
              "Give me all clan members who pay above average tribute, ordered by join date"
            </div>

            {/* SQL output mockup */}
            <div className="bg-[#18181B] text-white/90 border border-neutral-800 rounded-xl p-3 font-mono text-[10px] space-y-1 overflow-x-auto select-none">
              <div className="flex justify-between items-center border-b border-neutral-800 pb-2 mb-2">
                <span className="text-[9px] uppercase tracking-wider text-white/40">Generated SQL</span>
                <span className="text-[9px] text-accent">Confidence: 98%</span>
              </div>
              <p><span className="text-[#F43F5E]">SELECT</span> * <span className="text-[#3B82F6]">FROM</span> users</p>
              <p><span className="text-[#3B82F6]">WHERE</span> tribute &gt; (</p>
              <p className="pl-4">  <span className="text-[#F43F5E]">SELECT</span> <span className="text-[#10B981]">AVG</span>(tribute) <span className="text-[#3B82F6]">FROM</span> users</p>
              <p>)</p>
              <p><span className="text-[#3B82F6]">ORDER BY</span> join_date <span className="text-[#3B82F6]">DESC</span>;</p>
            </div>
            
            {/* Background geometric accents */}
            <div className="absolute -bottom-8 -right-8 w-20 h-20 border border-border-light rounded-full pointer-events-none opacity-40"></div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="max-w-[1280px] mx-auto w-full px-6 py-20 relative z-10 text-center">
        <div className="mb-16 space-y-3">
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider bg-white border border-border-light px-3 py-1 rounded-full shadow-2xs">ARCHITECTURAL BLUEPRINT</span>
          <h2 className="text-3xl md:text-4xl font-display font-extrabold text-primary tracking-tight">Core Features of Shogun SQL</h2>
          <p className="text-secondary text-sm max-w-lg mx-auto">Equip your database pipeline with state-of-the-art computational workflows.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div 
                key={i} 
                className="bg-white border border-border-light p-8 rounded-[20px] shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col text-left relative overflow-hidden group"
              >
                {/* Accent hover line */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                <div className="w-10 h-10 rounded-xl bg-primary text-accent flex items-center justify-center mb-6 shadow-2xs">
                  <Icon size={20} />
                </div>
                <h3 className="text-base font-display font-semibold text-primary mb-3">{f.title}</h3>
                <p className="text-secondary leading-relaxed text-xs flex-1">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-[#111111] text-white py-24 relative z-10">
        <div className="max-w-[1280px] mx-auto px-6 grid md:grid-cols-12 gap-12 items-center">
          
          <div className="md:col-span-5 text-left space-y-6">
            <span className="text-xs font-semibold text-accent uppercase tracking-wider">LOGICAL SEQUENCE</span>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight leading-none">
              How the Compiler <br/>Unfolds
            </h2>
            <p className="text-white/60 leading-relaxed text-sm">
              The AI generator follows a three-step discipline of database query cultivation, translating natural thought into high-performance SQL.
            </p>
            <div className="w-16 h-1 bg-accent rounded-full"></div>
          </div>

          <div className="md:col-span-7 space-y-8 text-left">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-accent text-primary flex items-center justify-center font-display font-bold text-xs flex-shrink-0 shadow-sm">
                01
              </div>
              <div>
                <h4 className="font-display font-semibold text-white text-base tracking-tight mb-1">Load DB Schema</h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  Drag and drop your standard SQL schema scrolls. The AI engine instantly digests tables, keys, and relational constraints.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-accent text-primary flex items-center justify-center font-display font-bold text-xs flex-shrink-0 shadow-sm">
                02
              </div>
              <div>
                <h4 className="font-display font-semibold text-white text-base tracking-tight mb-1">Prompt in Plain Text</h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  Describe your retrieval criteria in normal English: <i>"Select all clan members who registered last week."</i>
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-accent text-primary flex items-center justify-center font-display font-bold text-xs flex-shrink-0 shadow-sm">
                03
              </div>
              <div>
                <h4 className="font-display font-semibold text-white text-base tracking-tight mb-1">Receive Output Code</h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  Collect perfectly formatted, high-performance MySQL statements alongside comprehensive step-by-step explanations.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="why-us" className="max-w-[1280px] mx-auto w-full px-6 py-20 relative z-10 text-center">
        <div className="mb-16 space-y-3">
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider bg-white border border-border-light px-3 py-1 rounded-full shadow-2xs">CITADEL INTEGRITY</span>
          <h2 className="text-3xl md:text-4xl font-display font-extrabold text-primary tracking-tight">The Shogun SQL Guarantee</h2>
          <p className="text-secondary text-sm max-w-lg mx-auto">Unlike generic text completion models, we understand relational structures natively.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
          <div className="p-6 bg-white border border-border-light rounded-2xl shadow-2xs relative overflow-hidden group">
            <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-accent"></div>
            <h3 className="font-display font-semibold text-primary text-base tracking-tight mb-2">Contextual Schema Mapping</h3>
            <p className="text-xs text-secondary leading-relaxed">
              Standard LLMs return queries out of context. Shogun SQL maps parameters explicitly against your uploaded tables, avoiding missing columns, invalid indices, or incorrect join predicates.
            </p>
          </div>

          <div className="p-6 bg-white border border-border-light rounded-2xl shadow-2xs relative overflow-hidden group">
            <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-accent"></div>
            <h3 className="font-display font-semibold text-primary text-base tracking-tight mb-2">Step-by-Step Logic Explainers</h3>
            <p className="text-xs text-secondary leading-relaxed">
              We do not just output SQL code. We describe the logic and components of the query so you can train developers, troubleshoot indices, and build clean system documentations.
            </p>
          </div>
        </div>

        <div className="mt-16">
          <Link to="/register">
            <Button size="lg" variant="primary">Forge Your First Query</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
      
    </div>
  );
};

export default LandingPage;
