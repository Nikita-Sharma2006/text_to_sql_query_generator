import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Sparkles, 
  History, 
  Star, 
  Database, 
  User, 
  Settings, 
  LogOut,
  X,
  Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { logout, user } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    if (onClose) onClose();
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'AI Generator', path: '/dashboard/generator', icon: Sparkles },
    { name: 'Query History', path: '/dashboard/history', icon: History },
    { name: 'Favorites', path: '/dashboard/favorites', icon: Star },
    { name: 'Database Schemas', path: '/dashboard/schema', icon: Database },
    { name: 'Warrior Profile', path: '/dashboard/profile', icon: User },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/30 md:hidden backdrop-blur-xs"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-border-light text-primary
          flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Sidebar Header */}
        <div className="p-5 border-b border-border-light flex justify-between items-center relative bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary text-accent shadow-sm">
              <Layers size={18} />
            </div>
            <div>
              <h1 className="text-sm font-display font-extrabold text-primary tracking-tight leading-none uppercase">SHOGUN SQL</h1>
              <span className="text-[9px] uppercase tracking-wider text-secondary font-mono">v1.2.4 SaaS</span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="md:hidden text-secondary hover:text-primary transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* User Card */}
        {user && (
          <div className="px-5 py-4 border-b border-border-light bg-[#FAFAFA] flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-border-light overflow-hidden bg-white flex-shrink-0 relative">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden w-full h-full bg-primary text-white items-center justify-center font-sans font-bold text-sm">
                {user.name.substring(0,1)}
              </div>
            </div>
            <div className="overflow-hidden text-left">
              <h4 className="text-sm font-sans font-semibold text-primary truncate tracking-tight">{user.name}</h4>
              <p className="text-[10px] font-sans text-secondary truncate italic">Daimyo Administrator</p>
            </div>
          </div>
        )}

        {/* Menu Links */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/dashboard'}
                onClick={onClose}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 text-xs font-sans font-medium tracking-tight rounded-lg transition-all duration-200 text-left
                  ${isActive 
                    ? 'bg-accent/15 text-primary border-l-2 border-primary font-semibold' 
                    : 'text-secondary hover:bg-[#FAFAFA] hover:text-primary'}
                `}
              >
                <Icon size={16} className="flex-shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer / Logout */}
        <div className="p-4 border-t border-border-light bg-[#FAFAFA]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-border-light hover:bg-[#FAFAFA] text-secondary hover:text-primary font-sans text-xs tracking-tight font-medium rounded-lg transition-all duration-200 cursor-pointer shadow-2xs"
          >
            <LogOut size={13} />
            <span>Leave Citadel</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
