import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ExternalLink, Star, Search, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import toast from 'react-hot-toast';

const QueryHistory = () => {
  const { queries, deleteQuery, toggleFavorite } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const handleDelete = (id) => {
    deleteQuery(id);
    toast.error('Query record removed.');
  };

  const handleReuse = (query) => {
    navigate('/dashboard/generator', { state: { query } });
  };

  const filteredQueries = queries.filter(q => 
    q.prompt.toLowerCase().includes(search.toLowerCase()) ||
    q.sql.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 text-left animate-fade-in font-sans">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold tracking-tight text-primary uppercase">Query Archives</h2>
          <p className="text-xs text-secondary mt-1">Examine previous prompts and compiled SQL outputs</p>
        </div>
        
        {/* Search Bar */}
        <div className="w-full sm:w-72 relative">
          <Input
            placeholder="Search queries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
          <Search size={14} className="absolute right-3.5 top-9 text-secondary/50 pointer-events-none" />
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-border-light w-full"></div>

      {/* Queries List */}
      <div className="space-y-5">
        {filteredQueries.map((q) => (
          <Card 
            key={q.id} 
            variant="parchment" 
            className="hover:border-primary hover:shadow-xs transition-all duration-300"
          >
            <div className="flex flex-col lg:flex-row justify-between gap-6 text-left">
              {/* Left Column: Details */}
              <div className="flex-1 space-y-4 min-w-0">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono bg-primary text-white px-2 py-0.5 uppercase tracking-wider rounded-md font-semibold">
                      ID: {q.id}
                    </span>
                    <h3 className="text-sm font-semibold text-primary mt-2">
                      "{q.prompt}"
                    </h3>
                  </div>
                  <button 
                    onClick={() => {
                      toggleFavorite(q.id);
                      toast.success(q.isFavorite ? 'Removed from favorites' : 'Added to favorites!');
                    }}
                    className={`p-2 border rounded-lg transition-colors cursor-pointer hover:border-primary
                      ${q.isFavorite ? 'bg-accent/20 text-primary border-primary' : 'text-secondary/50 border-border-light'}`}
                  >
                    <Star size={14} fill={q.isFavorite ? '#111111' : 'none'} />
                  </button>
                </div>

                {/* SQL display */}
                <div className="bg-[#18181B] border border-neutral-800 rounded-xl p-3 font-mono text-[11px] text-white/95 overflow-x-auto max-h-36">
                  <pre>{q.sql}</pre>
                </div>

                <div className="flex justify-between items-center text-[10px] text-secondary font-mono">
                  <span>Forged at: {q.timestamp}</span>
                </div>
              </div>

              {/* Right Column: Actions */}
              <div className="lg:border-l lg:border-border-light/60 lg:pl-6 flex flex-row lg:flex-col justify-end lg:justify-center gap-3">
                <Button 
                  onClick={() => handleReuse(q)}
                  variant="primary" 
                  size="sm"
                  className="flex items-center justify-center gap-1.5 rounded-lg text-xs"
                >
                  <ExternalLink size={13} />
                  REUSE
                </Button>
                <Button 
                  onClick={() => handleDelete(q.id)}
                  variant="danger" 
                  size="sm"
                  className="flex items-center justify-center gap-1.5 rounded-lg text-xs"
                >
                  <Trash2 size={13} />
                  DELETE
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {filteredQueries.length === 0 && (
          <div className="text-center py-16 border border-dashed border-border-light bg-white rounded-[20px] text-secondary">
            <Filter className="mx-auto text-secondary/30 mb-3" size={28} />
            <p className="font-sans text-sm italic">
              No queries found matching the search query.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QueryHistory;
