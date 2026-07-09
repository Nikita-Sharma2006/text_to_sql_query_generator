import React from 'react';

const Card = ({
  children,
  variant = 'parchment', // 'parchment' (now white/light) | 'charcoal' (now dark)
  className = '',
  title = '',
  subtitle = '',
  headerAction = null,
  ...props
}) => {
  const isLight = variant === 'parchment';

  return (
    <div
      className={`
        border border-border-light rounded-[20px] overflow-hidden relative card-hover
        ${isLight 
          ? 'bg-white text-primary' 
          : 'bg-primary text-white border-primary'}
        ${className}
      `}
      {...props}
    >
      {/* Card Header */}
      {(title || subtitle || headerAction) && (
        <div className={`px-6 py-5 border-b border-border-light flex justify-between items-center relative
          ${isLight ? 'bg-white' : 'bg-black/10'}`}
        >
          <div>
            {title && (
              <h3 className={`text-lg font-display font-semibold ${isLight ? 'text-primary' : 'text-accent'}`}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p className={`text-xs mt-1 font-sans ${isLight ? 'text-secondary' : 'text-white/60'}`}>
                {subtitle}
              </p>
            )}
          </div>
          {headerAction && <div className="z-10">{headerAction}</div>}
        </div>
      )}

      {/* Card Content */}
      <div className="px-6 py-5 relative z-10">
        {children}
      </div>
    </div>
  );
};

export default Card;
