import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Copy, Download, Play, HelpCircle, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const SQLCodeBlock = ({
  code = '',
  onExplain = null,
  onExecute = null,
  height = '200px',
  readOnly = true
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('SQL Query copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `shogun_query_${Date.now()}.sql`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('SQL query downloaded successfully!');
  };

  const editorOptions = {
    readOnly: readOnly,
    minimap: { enabled: false },
    fontSize: 13,
    fontFamily: "Geist Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    lineNumbers: 'on',
    scrollBeyondLastLine: false,
    automaticLayout: true,
    padding: { top: 12, bottom: 12 },
    background: '#18181B',
    lineDecorationsWidth: 6,
    lineNumbersMinChars: 3
  };

  return (
    <div className="overflow-hidden border border-border-light rounded-xl w-full shadow-sm flex flex-col bg-white">
      {/* CodeBlock Header */}
      <div className="bg-[#18181B] px-4 py-2.5 flex justify-between items-center text-white border-b border-[#27272A]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse"></span>
          <span className="font-sans font-medium text-xs text-white/90 tracking-tight">SQL Query Client</span>
        </div>
        <span className="text-[10px] font-mono tracking-wider text-white/40">MySQL 8.0</span>
      </div>

      {/* Editor Area */}
      <div className="bg-[#18181B] relative" style={{ height }}>
        <Editor
          height={height}
          defaultLanguage="sql"
          theme="vs-dark"
          value={code}
          options={editorOptions}
          loading={
            <div className="absolute inset-0 flex items-center justify-center bg-[#18181B] text-white/60 font-sans text-xs tracking-tight">
              Loading compiler...
            </div>
          }
        />
      </div>

      {/* Actions Toolbar */}
      <div className="bg-[#18181B] border-t border-[#27272A] px-3 py-2 flex flex-wrap justify-between items-center gap-2">
        <div className="flex gap-1.5">
          {onExplain && (
            <button
              onClick={onExplain}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-medium text-white/80 hover:text-accent hover:bg-white/5 rounded-md transition-all duration-200 cursor-pointer"
            >
              <HelpCircle size={13} className="text-accent" />
              Explain
            </button>
          )}
          {onExecute && (
            <button
              onClick={onExecute}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-medium text-white/80 hover:text-accent hover:bg-white/5 rounded-md transition-all duration-200 cursor-pointer"
            >
              <Play size={13} className="text-accent" />
              Execute
            </button>
          )}
        </div>

        <div className="flex gap-1.5">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-medium text-white/80 hover:text-accent hover:bg-white/5 rounded-md transition-all duration-200 cursor-pointer"
            title="Copy to Clipboard"
          >
            {copied ? <Check size={13} className="text-accent" /> : <Copy size={13} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-medium text-white/80 hover:text-accent hover:bg-white/5 rounded-md transition-all duration-200 cursor-pointer"
            title="Download SQL File"
          >
            <Download size={13} />
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default SQLCodeBlock;
