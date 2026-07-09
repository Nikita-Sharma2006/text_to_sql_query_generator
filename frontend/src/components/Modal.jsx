import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

const Modal = ({
  isOpen,
  onClose,
  title = '',
  children,
  confirmText = '',
  onConfirm = null,
  cancelText = 'Close',
  maxWidth = 'max-w-lg'
}) => {
  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-all duration-300">
      {/* Backdrop click closer */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Modal Container */}
      <div className={`w-full ${maxWidth} bg-white border border-border-light rounded-2xl shadow-xl overflow-hidden relative z-10 transition-all transform scale-100 duration-300 flex flex-col`}>
        {/* Header */}
        <div className="px-6 py-5 border-b border-border-light flex justify-between items-center bg-white">
          <h3 className="text-lg font-display font-semibold text-primary">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-secondary hover:text-primary p-1 rounded-md hover:bg-[#FAFAFA] transition-colors duration-200 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 overflow-y-auto max-h-[60vh] text-sm text-secondary font-sans leading-relaxed">
          {children}
        </div>

        {/* Action Footer */}
        <div className="px-6 py-4 border-t border-border-light bg-[#FAFAFA] flex justify-end gap-3">
          <Button variant="ghost" size="sm" onClick={onClose}>
            {cancelText}
          </Button>
          {onConfirm && (
            <Button variant="primary" size="sm" onClick={onConfirm}>
              {confirmText || 'Confirm'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
