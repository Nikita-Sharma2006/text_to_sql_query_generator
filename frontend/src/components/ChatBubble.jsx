import React from 'react';
import { User, ShieldAlert } from 'lucide-react';
import SQLCodeBlock from './SQLCodeBlock';

const ChatBubble = ({
  message,
  onExplain = null,
  onExecute = null
}) => {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex w-full gap-4 my-4 animate-fade-in ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* Sender Avatar Left */}
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full border border-border-light bg-[#FAFAFA] overflow-hidden flex items-center justify-center shadow-xs">
          <div className="w-full h-full bg-[#111111] text-accent flex items-center justify-center font-sans font-bold text-xs">
            AI
          </div>
        </div>
      )}

      {/* Message Content */}
      <div className={`max-w-[80%] flex flex-col gap-1.5`}>
        {/* Username/Role */}
        <span className={`text-[10px] font-sans font-semibold tracking-wider uppercase text-secondary ${isUser ? 'text-right' : 'text-left'}`}>
          {isUser ? 'User Prompt' : 'Shogun AI Engine'}
        </span>

        {/* Bubble body */}
        <div
          className={`
            border rounded-xl p-4 shadow-2xs text-left font-sans text-sm relative overflow-hidden
            ${isUser
              ? 'bg-[#111111] border-[#111111] text-white rounded-tr-none'
              : 'bg-white border-border-light text-primary rounded-tl-none'}
          `}
        >
          {/* Subtle Accent Bar on AI Responses */}
          {!isUser && (
            <div className="absolute top-0 left-0 bottom-0 w-1 bg-accent"></div>
          )}

          {/* Message Text */}
          <p className="whitespace-pre-line leading-relaxed text-sm">{message.text}</p>

          {/* Embedded SQL Code Block */}
          {message.sql && (
            <div className="mt-4">
              <SQLCodeBlock
                code={message.sql}
                onExplain={onExplain ? () => onExplain(message) : null}
                onExecute={onExecute ? () => onExecute(message) : null}
              />
            </div>
          )}

          {/* Confidence Badge */}
          {!isUser && message.confidence && (
            <div className="mt-3 flex flex-col gap-1 border-t border-border-light pt-2.5 font-sans">
              <div className="flex items-center gap-2">
                <span className="text-secondary uppercase tracking-wider font-bold text-[10px]">Confidence:</span>
                <span className={`px-2 py-0.5 font-sans text-[10px] font-semibold rounded-md uppercase tracking-wide
                  ${message.confidence === 'High' ? 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20' : 
                    message.confidence === 'Medium' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 
                    'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20'}`}>
                  {message.confidence}
                </span>
              </div>
              {message.confidenceReason && (
                <p className="text-secondary text-[11px] italic mt-0.5 leading-normal">
                  Reason: {message.confidenceReason}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Timestamp */}
        <span className={`text-[9px] font-mono text-secondary/60 ${isUser ? 'text-right' : 'text-left'}`}>
          {message.timestamp}
        </span>
      </div>

      {/* User Avatar on Right */}
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full border border-border-light bg-white overflow-hidden flex items-center justify-center shadow-xs">
          <div className="w-full h-full bg-[#FAFAFA] text-primary flex items-center justify-center font-sans font-bold text-xs">
            U
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBubble;
