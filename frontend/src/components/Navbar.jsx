import React, { useState } from 'react';
import { Menu, Bell, Shield, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Navbar = ({ onMenuToggle }) => {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNotificationClick = () => {
    toast('No new decrees from the Citadel.', {
      icon: '📜',
      style: {
        background: '#111111',
        color: '#FFFFFF',
        border: '1px solid #E5E7EB',
        fontFamily: 'Inter, sans-serif'
      }
    });
  };

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-border-light px-6 flex justify-between items-center relative z-30 shadow-2xs">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 border border-border-light hover:bg-[#FAFAFA] rounded-lg transition-colors cursor-pointer"
        >
          <Menu size={16} />
        </button>
        <div className="hidden sm:flex items-center gap-2 text-primary font-sans font-medium text-xs">
          <Shield size={14} className="text-primary" />
          <span className="tracking-tight uppercase">Citadel Gatehouse Console</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button
          onClick={handleNotificationClick}
          className="p-2 text-secondary hover:text-primary transition-colors relative cursor-pointer hover:bg-[#FAFAFA] rounded-lg"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#EF4444] rounded-full border border-white"></span>
        </button>

        {/* User Dropdown */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 text-left hover:text-primary transition-all focus:outline-none cursor-pointer p-1 rounded-lg hover:bg-[#FAFAFA]"
            >
              <div className="w-7 h-7 rounded-full border border-border-light overflow-hidden bg-[#FAFAFA] shadow-2xs">
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden w-full h-full bg-primary text-white items-center justify-center font-sans font-bold text-xs">
                  {user.name.substring(0,1)}
                </div>
              </div>
              <span className="hidden md:inline font-sans text-xs font-semibold text-primary max-w-[120px] truncate">{user.name.split(' ')[0]}</span>
              <ChevronDown size={12} className="opacity-60" />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setDropdownOpen(false)}></div>
                <div className="absolute right-0 mt-2 w-48 bg-white border border-border-light shadow-lg z-40 rounded-xl py-1.5 animate-fade-in">
                  <Link
                    to="/dashboard/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-sans font-medium text-secondary hover:text-primary hover:bg-[#FAFAFA] border-b border-border-light/50"
                  >
                    <User size={13} className="text-secondary" />
                    Warrior Profile
                  </Link>
                  <Link
                    to="/dashboard/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-sans font-medium text-secondary hover:text-primary hover:bg-[#FAFAFA] border-b border-border-light/50"
                  >
                    <Settings size={13} className="text-secondary" />
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs font-sans font-medium text-[#EF4444] hover:bg-[#EF4444]/5 cursor-pointer"
                  >
                    <LogOut size={13} />
                    Leave Citadel
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
