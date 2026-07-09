import React from 'react';

const Footer = ({ className = '' }) => {
  return (
    <footer className={`py-12 px-6 bg-white border-t border-border-light text-secondary font-sans ${className}`}>
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
        <div>
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <span className="font-display font-extrabold text-sm text-primary tracking-tight uppercase">SHOGUN SQL</span>
            <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-secondary/60">AI Query Engine</span>
          </div>
          <p className="text-xs text-secondary/80 max-w-md leading-relaxed">
            Formulate high-performance database schemas and MySQL query scrolls with natural language processing and modern engineering practices.
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-3 text-xs text-secondary/60">
          <div className="flex gap-6 font-medium">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">Workflow</a>
            <a href="#why-us" className="hover:text-primary transition-colors"> Citadel Guarantee</a>
          </div>
          <p className="font-mono text-[10px] tracking-wide text-secondary/50">
            © {new Date().getFullYear()} Shogun SQL AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
