import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, History, Star, Database, Shield, Zap, Flame, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Card from '../components/Card';
import Button from '../components/Button';

const HomeDashboard = () => {
  const { user, queries, schemas } = useApp();

  const totalQueries = queries.length;
  const favoriteQueries = queries.filter(q => q.isFavorite).length;
  const totalSchemas = schemas.length;

  const stats = [
    { 
      name: 'Queries Forged', 
      value: totalQueries, 
      icon: Sparkles, 
      color: 'text-primary',
      chart: (
        <svg className="w-16 h-8 text-[#B8FF4F]" viewBox="0 0 50 20" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M0,18 Q12,12 25,15 T50,5" strokeLinecap="round" />
        </svg>
      )
    },
    { 
      name: 'Starred Scrolls', 
      value: favoriteQueries, 
      icon: Star, 
      color: 'text-[#EAB308]',
      chart: (
        <svg className="w-16 h-8 text-amber-500" viewBox="0 0 50 20" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M0,15 C10,15 15,5 25,8 C35,11 40,3 50,3" strokeLinecap="round" />
        </svg>
      )
    },
    { 
      name: 'Loaded Schemas', 
      value: totalSchemas, 
      icon: Database, 
      color: 'text-primary',
      chart: (
        <svg className="w-16 h-8 text-primary" viewBox="0 0 50 20" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M0,19 L15,10 L30,12 L50,4" strokeLinecap="round" />
        </svg>
      )
    },
    { 
      name: 'Engine Efficiency', 
      value: '98%', 
      icon: Flame, 
      color: 'text-[#EF4444]',
      chart: (
        <svg className="w-16 h-8 text-[#EF4444]" viewBox="0 0 50 20" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M0,12 L10,12 L20,8 L35,10 L50,2" strokeLinecap="round" />
        </svg>
      )
    }
  ];

  const shortcuts = [
    {
      title: 'Generate SQL',
      desc: 'Formulate natural text into optimized SQL commands.',
      path: '/dashboard/generator',
      icon: Sparkles,
      btnText: 'Open Generator'
    },
    {
      title: 'Upload Schema',
      desc: 'Introduce new MySQL structure files into Shogun AI.',
      path: '/dashboard/schema',
      icon: Database,
      btnText: 'Manage Schema'
    },
    {
      title: 'Query History',
      desc: 'Examine previous database scrolls and logical breakdowns.',
      path: '/dashboard/history',
      icon: History,
      btnText: 'View History'
    }
  ];

  return (
    <div className="space-y-8 text-left animate-fade-in font-sans">
      {/* Welcome Banner Card */}
      <div className="bg-[#111111] text-white border border-[#111111] p-6 shadow-md rounded-[20px] relative overflow-hidden">
        {/* Abstract design elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 border border-white/5 rounded-full pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight text-white uppercase">
              Welcome back, {user?.name.split(' ')[0]}!
            </h2>
            <p className="text-sm text-white/70 max-w-xl leading-relaxed">
              The Citadel gate console is secure. Ready your schemas for execution inside Shogun AI SQL playground.
            </p>
          </div>
          <Link to="/dashboard/generator" className="flex-shrink-0">
            <Button variant="accent" size="md" className="font-semibold rounded-lg hover:shadow-md">
              Forge SQL Console
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <Card key={i} variant="parchment" className="hover:border-primary transition-all duration-300">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-secondary tracking-wider">{s.name}</p>
                  <h4 className="text-2xl font-display font-bold text-primary">{s.value}</h4>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <div className={`p-1.5 bg-[#FAFAFA] rounded-md border border-border-light ${s.color}`}>
                    <Icon size={16} />
                  </div>
                  {s.chart}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Main Grid: Shortcuts & Recent Activity */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Short cuts & recent queries */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Quick Actions */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2">
              <Zap size={14} className="text-accent fill-accent" /> Quick Operations
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {shortcuts.map((sc, i) => {
                const Icon = sc.icon;
                return (
                  <Card key={i} variant="parchment" className="flex flex-col h-full hover:border-primary transition-all duration-300">
                    <div className="flex-1 space-y-2.5 text-left">
                      <div className="w-8 h-8 rounded-lg bg-[#FAFAFA] border border-border-light flex items-center justify-center text-primary shadow-3xs">
                        <Icon size={16} />
                      </div>
                      <h4 className="font-display font-semibold text-sm text-primary">{sc.title}</h4>
                      <p className="text-xs text-secondary leading-relaxed">{sc.desc}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-border-light">
                      <Link to={sc.path}>
                        <button className="text-xs font-semibold text-primary hover:text-secondary transition-colors cursor-pointer flex items-center gap-1">
                          {sc.btnText} →
                        </button>
                      </Link>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Recent Queries Feed */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                <History size={14} /> Recent Queries
              </h3>
              <Link to="/dashboard/history" className="text-xs font-semibold text-secondary hover:text-primary transition-colors">
                All History →
              </Link>
            </div>
            
            <div className="space-y-3">
              {queries.slice(0, 3).map((q) => (
                <Card 
                  key={q.id} 
                  variant="parchment" 
                  className="hover:border-primary hover:shadow-xs transition-all duration-200"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center text-left">
                    <div className="space-y-1 overflow-hidden">
                      <p className="text-xs font-semibold text-primary truncate max-w-lg">
                        "{q.prompt}"
                      </p>
                      <span className="text-[10px] font-mono text-secondary/60 block">
                        Forged at: {q.timestamp}
                      </span>
                    </div>
                    <Link to="/dashboard/generator" state={{ query: q }} className="flex-shrink-0">
                      <Button size="sm" variant="secondary" className="rounded-lg">
                        Re-open Scroll
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
              {queries.length === 0 && (
                <div className="text-center py-8 border border-dashed border-border-light bg-white text-secondary/60 font-sans text-xs italic rounded-2xl">
                  No queries in history yet. Launch the generator to begin.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right 1 Column: Loaded Schemas Overview */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2">
              <Database size={14} /> Active Schemas
            </h3>
            <Link to="/dashboard/schema" className="text-xs font-semibold text-secondary hover:text-primary transition-colors">
              Manage →
            </Link>
          </div>

          <Card variant="parchment" className="h-auto">
            <div className="space-y-3 text-left">
              {schemas.slice(0, 3).map((s) => (
                <div key={s.id} className="p-3 bg-[#FAFAFA] border border-border-light rounded-xl space-y-1.5 hover:border-primary transition-colors">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-xs text-primary truncate max-w-[150px]">{s.name}</span>
                    <span className="text-[9px] font-mono text-secondary">{s.size}</span>
                  </div>
                  <div className="text-[10px] text-secondary flex justify-between">
                    <span>Tables: {s.tableCount}</span>
                    <span>{s.timestamp}</span>
                  </div>
                </div>
              ))}
              {schemas.length === 0 && (
                <div className="text-center py-8 text-secondary/50 font-sans text-xs italic space-y-3">
                  <p>No schemas uploaded yet.</p>
                  <div>
                    <Link to="/dashboard/schema">
                      <Button size="sm" variant="secondary" className="rounded-lg">
                        Load Schema
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
              {schemas.length > 0 && (
                <div className="pt-2 text-center text-[10px] text-secondary font-sans italic border-t border-border-light/50">
                  {schemas.length} schema files active in generator context.
                </div>
              )}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default HomeDashboard;
