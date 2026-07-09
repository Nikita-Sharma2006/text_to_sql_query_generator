import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Eye, Bell, Compass, LogOut, Code, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Card from '../components/Card';
import Button from '../components/Button';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const { settings, toggleSettings, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Successfully exited the Citadel console.');
  };

  const handleThemeChange = (themeName) => {
    toast(`Theme changed to ${themeName} (Visual Preview Only)`, {
      icon: '🎨',
      style: {
        background: '#111111',
        color: '#FFFFFF',
        border: '1px solid #E5E7EB',
        fontFamily: 'Inter, sans-serif'
      }
    });
  };

  return (
    <div className="space-y-8 text-left animate-fade-in font-sans">
      {/* Title Header */}
      <div>
        <h2 className="text-2xl font-display font-bold tracking-tight text-primary uppercase">Citadel Settings</h2>
        <p className="text-xs text-secondary mt-1">Configure workspace layout themes, alerts, and system specifications</p>
      </div>

      {/* Divider */}
      <div className="h-px bg-border-light w-full"></div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Configs */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Aesthetic Theme Selection */}
          <Card variant="parchment" title="Citadel Aesthetic Theme" className="hover:border-border-light">
            <div className="space-y-4 text-left">
              <p className="text-xs text-secondary leading-relaxed">
                Choose the visual style of your console panels. Custom themes adjust contrast levels and card borders.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {/* SaaS Light theme option */}
                <div 
                  onClick={() => handleThemeChange('SaaS Light')}
                  className="border-2 border-primary bg-white p-4 rounded-xl cursor-pointer hover:shadow-xs transition-shadow relative"
                >
                  <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-accent"></div>
                  <h4 className="font-semibold text-xs text-primary uppercase tracking-wide">SaaS Light</h4>
                  <p className="text-[10px] text-secondary mt-1">Clean minimalist layout</p>
                </div>
                
                {/* SaaS Dark theme option */}
                <div 
                  onClick={() => handleThemeChange('SaaS Dark')}
                  className="border border-border-light bg-[#111111] p-4 rounded-xl cursor-pointer hover:shadow-xs transition-shadow hover:border-primary"
                >
                  <h4 className="font-semibold text-xs text-accent uppercase tracking-wide">SaaS Dark</h4>
                  <p className="text-[10px] text-white/50 mt-1">Sleek dark mode theme</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Toggle options */}
          <Card variant="parchment" title="Preferences" className="hover:border-border-light">
            <div className="space-y-4 text-xs text-secondary text-left">
              {/* Notification toggle */}
              <div className="flex items-center justify-between py-2 border-b border-border-light/50">
                <div>
                  <span className="font-bold text-primary flex items-center gap-2">
                    <Bell size={13} /> Dispatch Decrees
                  </span>
                  <p className="text-[10px] text-secondary mt-0.5">Toggle notifications for successful query generations</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={() => {
                    toggleSettings('notifications');
                    toast.success(settings.notifications ? 'Notifications muted' : 'Notifications enabled');
                  }}
                  className="h-4 w-4 text-primary focus:ring-accent border-border-light rounded cursor-pointer"
                />
              </div>

              {/* Dark mode mock state toggle */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <span className="font-bold text-primary flex items-center gap-2">
                    <Eye size={13} /> High Contrast Mode
                  </span>
                  <p className="text-[10px] text-secondary mt-0.5">Thicker lines on panels for dark code compiler screens</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.darkMode}
                  onChange={() => {
                    toggleSettings('darkMode');
                    toast.success(settings.darkMode ? 'High contrast disabled' : 'High contrast active');
                  }}
                  className="h-4 w-4 text-primary focus:ring-accent border-border-light rounded cursor-pointer"
                />
              </div>
            </div>
          </Card>

          {/* Logout Action Card */}
          <Card variant="parchment" title="Secure Exit" className="hover:border-border-light">
            <div className="space-y-4 text-left text-xs text-secondary">
              <p className="leading-relaxed">
                Log out of the current session and secure the database generator logs. This clears temporary memory buffers.
              </p>
              <div>
                <Button 
                  onClick={handleLogout}
                  variant="danger" 
                  size="sm"
                  className="flex items-center gap-1.5 rounded-lg"
                >
                  <LogOut size={13} />
                  SECURE DEPARTURE
                </Button>
              </div>
            </div>
          </Card>

        </div>

        {/* Right 1 Column: Metadata */}
        <div className="space-y-6">
          <Card variant="parchment" className="bg-primary text-white border-primary hover:border-primary">
            <div className="space-y-4 text-left text-xs">
              <h3 className="font-display font-bold text-sm text-accent uppercase tracking-tight flex items-center gap-1.5">
                <Code size={15} /> System Blueprint
              </h3>
              
              <div className="space-y-3 text-white/70 pt-3 border-t border-white/10 font-mono">
                <div className="flex justify-between">
                  <span>Engine:</span>
                  <span className="text-accent">v1.2.4-SaaS</span>
                </div>
                <div className="flex justify-between">
                  <span>AI Model:</span>
                  <span className="text-accent">Shogun-v4</span>
                </div>
                <div className="flex justify-between">
                  <span>Core SQL:</span>
                  <span className="text-accent">MySQL 8.0</span>
                </div>
                <div className="flex justify-between">
                  <span>Frontend:</span>
                  <span className="text-accent">React + Tailwind</span>
                </div>
              </div>
            </div>
          </Card>

          <Card variant="parchment" className="border-[#EF4444]/20 bg-[#EF4444]/5 hover:border-[#EF4444]/25">
            <div className="space-y-2 text-xs text-left">
              <h4 className="font-semibold text-[#EF4444] uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle size={13} /> Console Warning
              </h4>
              <p className="text-[#EF4444] leading-relaxed italic">
                Protect your access credentials. The platform is not responsible for query logs compromised due to un-attended workstation screens.
              </p>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default SettingsPage;
