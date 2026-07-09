import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Copy, ExternalLink, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Card from '../components/Card';
import Button from '../components/Button';
import toast from 'react-hot-toast';

const FavoriteQueries = () => {
  const { queries, toggleFavorite } = useApp();
  const navigate = useNavigate();

  const favorites = queries.filter(q => q.isFavorite);

  const handleCopy = (sql) => {
    navigator.clipboard.writeText(sql);
    toast.success('SQL query copied to clipboard!');
  };

  const handleRemove = (id) => {
    toggleFavorite(id);
    toast.error('Removed from favorites.');
  };

  const handleReuse = (query) => {
    navigate('/dashboard/generator', { state: { query } });
  };

  return (
    <div className="space-y-6 text-left animate-fade-in font-sans">
      {/* Title Header */}
      <div>
        <h2 className="text-2xl font-display font-bold tracking-tight text-primary uppercase">Favorite Queries</h2>
        <p className="text-xs text-secondary mt-1">Your saved library of frequently used SQL statement templates</p>
      </div>

      {/* Divider */}
      <div className="h-px bg-border-light w-full"></div>

      {/* Grid Display */}
      <div className="grid md:grid-cols-2 gap-6">
        {favorites.map((q) => (
          <Card 
            key={q.id} 
            variant="parchment" 
            className="flex flex-col h-full hover:border-primary hover:shadow-xs transition-all duration-300 border-border-light"
          >
            <div className="flex-1 space-y-4 flex flex-col text-left">
              {/* Card Header details */}
              <div className="flex justify-between items-start gap-4">
                <h3 className="text-sm font-semibold text-primary truncate max-w-[85%]">
                  "{q.prompt}"
                </h3>
                <div className="text-primary flex-shrink-0">
                  <Star size={14} fill="#111111" />
                </div>
              </div>

              {/* SQL box */}
              <div className="flex-1 bg-[#18181B] border border-neutral-800 rounded-xl p-3 font-mono text-[11px] text-white/95 overflow-x-auto min-h-[112px] max-h-36">
                <pre>{q.sql}</pre>
              </div>

              <div className="text-[10px] font-mono text-secondary">
                Created: {q.timestamp}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="mt-4 pt-3 border-t border-border-light grid grid-cols-3 gap-2">
              <Button 
                onClick={() => handleCopy(q.sql)}
                variant="ghost" 
                size="sm"
                className="flex items-center justify-center gap-1 py-1 rounded-lg"
              >
                <Copy size={11} />
                <span className="text-[10px] font-semibold">COPY</span>
              </Button>
              <Button 
                onClick={() => handleReuse(q)}
                variant="primary" 
                size="sm"
                className="flex items-center justify-center gap-1 py-1 rounded-lg"
              >
                <ExternalLink size={11} />
                <span className="text-[10px] font-semibold">REUSE</span>
              </Button>
              <Button 
                onClick={() => handleRemove(q.id)}
                variant="danger" 
                size="sm"
                className="flex items-center justify-center gap-1 py-1 rounded-lg"
              >
                <Trash2 size={11} />
                <span className="text-[10px] font-semibold">UNSTAR</span>
              </Button>
            </div>
          </Card>
        ))}

        {favorites.length === 0 && (
          <div className="col-span-2 text-center py-20 border border-dashed border-border-light bg-white rounded-[20px] text-secondary">
            <Star className="mx-auto text-secondary/35 mb-3" size={28} />
            <p className="font-sans text-sm italic">
              No starred queries in your library. Add them from the generator screen.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoriteQueries;
