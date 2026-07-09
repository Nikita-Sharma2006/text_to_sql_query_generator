import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ShieldAlert } from 'lucide-react';
import Button from '../components/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-bg-default flex flex-col justify-center items-center px-4 relative overflow-hidden grid-bg font-sans">
      
      <div className="max-w-md text-center space-y-6 relative z-10 animate-fade-in">
        <div className="w-14 h-14 rounded-2xl border border-border-light bg-white text-[#EF4444] flex items-center justify-center mx-auto shadow-sm">
          <ShieldAlert size={28} />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-display font-extrabold text-primary uppercase tracking-tight leading-none">
            Page Not Found
          </h1>
          
          <p className="text-sm text-secondary leading-relaxed max-w-xs mx-auto">
            The URL path you seek does not exist in the Citadel archives. Turn back before you lose your way.
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-border-light w-24 mx-auto"></div>

        <div>
          <Link to="/">
            <Button variant="primary" size="md" className="flex items-center justify-center gap-2 mx-auto rounded-lg text-xs">
              <Compass size={14} />
              Return to Entrance
            </Button>
          </Link>
        </div>
      </div>
      
    </div>
  );
};

export default NotFound;
