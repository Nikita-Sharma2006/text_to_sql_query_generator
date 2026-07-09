import React from 'react';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  ...props
}) => {
  const baseStyle = 'inline-flex items-center justify-center font-sans font-medium tracking-tight transition-all duration-200 transform active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent border cursor-pointer';
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-md',
    md: 'px-5 py-2.5 text-sm rounded-lg',
    lg: 'px-7 py-3 text-base rounded-lg shadow-sm',
  };

  const variantStyles = {
    // Dark primary button
    primary: 'bg-primary text-white border-primary hover:bg-[#222222] hover:border-[#222222]',
    // White background, light border secondary button
    secondary: 'bg-white text-primary border-border-light hover:bg-[#FAFAFA] hover:text-primary',
    // Lime green accent button
    accent: 'bg-accent text-primary border-accent hover:bg-accent-hover hover:border-accent-hover',
    // Transparent, minimal hover border
    ghost: 'bg-transparent text-secondary border-transparent hover:bg-[#FAFAFA] hover:text-primary hover:border-border-light',
    // Danger red text and border, red filled hover
    danger: 'bg-transparent text-[#EF4444] border-[#EF4444]/25 hover:bg-[#EF4444] hover:text-white hover:border-[#EF4444]',
  };

  const disabledStyle = 'opacity-55 cursor-not-allowed transform-none active:scale-100';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyle}
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${disabled || loading ? disabledStyle : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
