import React from 'react';

const TextArea = ({
  label = '',
  placeholder = '',
  value,
  onChange,
  className = '',
  error = '',
  rows = 4,
  required = false,
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full text-left ${className}`}>
      {label && (
        <label className="text-xs font-medium tracking-tight text-primary uppercase flex gap-1 font-sans">
          {label}
          {required && <span className="text-[#EF4444] font-sans">*</span>}
        </label>
      )}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        required={required}
        className={`
          w-full px-4 py-3 font-sans text-sm text-primary border border-border-light bg-white 
          focus:border-primary focus:ring-2 focus:ring-accent focus:outline-none 
          placeholder:text-secondary/50 transition-all duration-200 rounded-lg resize-none shadow-2xs
          ${error ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/25' : ''}
        `}
        {...props}
      />
      {error && (
        <span className="text-xs font-sans text-[#EF4444] mt-0.5">
          {error}
        </span>
      )}
    </div>
  );
};

export default TextArea;
