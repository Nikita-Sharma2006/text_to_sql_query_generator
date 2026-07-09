import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Send, Terminal, FileCode, CheckCircle, Database } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ChatBubble from '../components/ChatBubble';
import Modal from '../components/Modal';
import Button from '../components/Button';
import toast from 'react-hot-toast';

const AIGenerator = () => {
  const { generateSQL, executeSQL, schemas, queries, toggleFavorite } = useApp();
  const location = useLocation();
  const chatEndRef = useRef(null);

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'm-init',
      sender: 'ai',
      text: 'Greetings, Daimyo. I am the Shogun AI engine. Present your database desires in plain script, and I shall forge the SQL commands with proper discipline. If you have uploaded schema scrolls, I shall consult them.',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    }
  ]);

  // Modals state
  const [explainModalOpen, setExplainModalOpen] = useState(false);
  const [explainContent, setExplainContent] = useState('');
  const [explainQueryTitle, setExplainQueryTitle] = useState('');
  
  const [executeModalOpen, setExecuteModalOpen] = useState(false);
  const [executeResult, setExecuteResult] = useState(null);

  // If redirected from dashboard/history with a specific query, load it
  useEffect(() => {
    if (location.state?.query) {
      const q = location.state.query;
      setMessages(prev => [
        ...prev,
        {
          id: `m-user-${Date.now()}`,
          sender: 'user',
          text: `Reuse query: ${q.prompt}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
        },
        {
          id: `m-ai-${Date.now()}`,
          sender: 'ai',
          text: 'Understood. I have retrieved the query from your history log.',
          sql: q.sql,
          explanation: q.explanation,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
        }
      ]);
    }
  }, [location.state]);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    const userPrompt = prompt;
    setPrompt('');
    
    // Add user message
    const userMsg = {
      id: `m-user-${Date.now()}`,
      sender: 'user',
      text: userPrompt,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const result = await generateSQL(userPrompt);
      
      let aiMsg;
      if (result.needsClarification) {
        aiMsg = {
          id: `m-ai-${Date.now()}`,
          sender: 'ai',
          text: result.question || 'I need some clarification on your prompt. Could you specify further details?',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
        };
        toast('Shogun AI requires clarification.', {
          icon: '🤔',
          style: {
            background: '#111111',
            color: '#FFFFFF',
            border: '1px solid #E5E7EB',
            fontFamily: 'Inter, sans-serif'
          }
        });
      } else {
        aiMsg = {
          id: `m-ai-${Date.now()}`,
          sender: 'ai',
          text: 'The query template has been formulated. Here is your MySQL script:',
          sql: result.sql,
          explanation: result.explanation,
          confidence: result.confidence,
          confidenceReason: result.confidenceReason,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
        };
        toast.success('SQL formulated successfully!');
      }
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      toast.error(err.message || 'AI failed to interpret your prompt.');
    } finally {
      setLoading(false);
    }
  };

  const handleExplain = (msg) => {
    setExplainQueryTitle(msg.prompt || 'SQL Query logic');
    setExplainContent(msg.explanation);
    setExplainModalOpen(true);
  };

  const handleExecute = async (msg) => {
    setLoading(true);
    try {
      const result = await executeSQL(msg.sql);
      
      if (result.warning) {
        toast(result.warning, {
          icon: '⚠️',
          style: {
            background: '#111111',
            color: '#FFFFFF',
            border: '1px solid #E5E7EB',
            fontFamily: 'Inter, sans-serif'
          }
        });
      } else {
        toast.success('SQL executed successfully against the mock database!');
      }

      setExecuteResult({
        columns: result.columns,
        rows: result.rows,
        query: result.sql,
        executionTimeMs: result.executionTimeMs,
        isSimulated: result.isSimulated
      });
      setExecuteModalOpen(true);
    } catch (err) {
      toast.error(err.message || 'Database execution collapsed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 text-left animate-fade-in relative font-sans">
      
      {/* Top Header Panel */}
      <div className="bg-white border border-border-light p-4 shadow-2xs rounded-2xl flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg text-accent shadow-xs">
            <Terminal size={18} />
          </div>
          <div>
            <h2 className="text-sm font-display font-bold text-primary uppercase tracking-tight leading-tight">Shogun AI Console</h2>
            <p className="text-[10px] text-secondary">Describe database actions. Formulate SQL structure.</p>
          </div>
        </div>

        {/* Loaded Schema Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FAFAFA] border border-border-light rounded-lg text-xs text-secondary font-medium">
          <Database size={13} className="text-primary" />
          <span>Active Schemas: <b className="text-primary font-bold">{schemas.length}</b></span>
        </div>
      </div>

      {/* Chat Area Scrollbox */}
      <div className="flex-1 bg-white border border-border-light rounded-2xl shadow-2xs p-6 overflow-y-auto mb-4 min-h-[350px] relative">
        
        {messages.map((m) => (
          <ChatBubble
            key={m.id}
            message={m}
            onExplain={handleExplain}
            onExecute={handleExecute}
          />
        ))}

        {loading && (
          <div className="flex w-full gap-4 my-4 animate-pulse">
            <div className="flex-shrink-0 w-8 h-8 rounded-full border border-border-light bg-[#FAFAFA] flex items-center justify-center shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping"></span>
            </div>
            <div className="flex flex-col gap-1.5 text-left">
              <span className="text-[10px] uppercase font-bold text-secondary tracking-wider">Shogun AI Engine</span>
              <div className="bg-white border border-border-light text-primary rounded-xl rounded-tl-none p-4 max-w-[240px] text-xs font-medium shadow-2xs">
                Generating SQL query...
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Bottom Textbox Form */}
      <form onSubmit={handleSend} className="flex gap-3">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={loading}
          placeholder="Describe MySQL query (e.g. 'Get all users registered last month ordered by balance')"
          className="flex-1 px-4 py-3 font-sans text-sm text-primary border border-border-light bg-white focus:border-primary focus:ring-2 focus:ring-accent focus:outline-none placeholder:text-secondary/50 transition-all duration-200 rounded-xl shadow-2xs"
        />
        <Button
          type="submit"
          variant="primary"
          disabled={loading || !prompt.trim()}
          className="px-5 py-3 cursor-pointer rounded-xl flex items-center justify-center bg-primary text-white border-primary"
        >
          <Send size={15} />
        </Button>
      </form>

      {/* Explanation scroll modal */}
      <Modal
        isOpen={explainModalOpen}
        onClose={() => setExplainModalOpen(false)}
        title="SQL Logic Explanation"
      >
        <div className="space-y-4 font-sans text-left">
          <div className="p-3 bg-[#FAFAFA] border-l-4 border-primary italic text-xs text-primary rounded-md">
            "{explainQueryTitle}"
          </div>
          <p className="leading-relaxed text-sm text-secondary">
            {explainContent}
          </p>
        </div>
      </Modal>

      {/* Execution simulation modal */}
      <Modal
        isOpen={executeModalOpen}
        onClose={() => setExecuteModalOpen(false)}
        title="Execution Output Results"
        maxWidth="max-w-2xl"
      >
        {executeResult && (
          <div className="space-y-4 font-sans text-left">
            <div className="flex justify-between items-center text-xs border-b border-border-light pb-2">
              <span className="flex items-center gap-1.5 text-[#22C55E] font-bold uppercase tracking-wider">
                <CheckCircle size={13} /> Simulation Success
              </span>
              <span className="text-secondary font-mono">Time: {executeResult.executionTimeMs}ms</span>
            </div>

            {/* Simulated Query Code */}
            <div className="bg-[#18181B] text-white/90 p-3 rounded-xl font-mono text-xs overflow-x-auto border border-neutral-800 max-h-24">
              <pre>{executeResult.query}</pre>
            </div>

            {/* Table layout */}
            <div className="overflow-hidden border border-border-light rounded-xl shadow-2xs bg-white">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border-light">
                  <thead className="bg-[#FAFAFA]">
                    <tr>
                      {executeResult.columns.map((col, idx) => (
                        <th
                          key={idx}
                          className="px-4 py-2.5 text-left text-xs font-semibold text-primary uppercase tracking-tight border-b border-border-light"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-light text-xs text-secondary bg-white">
                    {executeResult.rows.map((row, rowIdx) => (
                      <tr key={rowIdx} className="hover:bg-[#FAFAFA]/50 transition-colors">
                        {row.map((cell, cellIdx) => (
                          <td key={cellIdx} className="px-4 py-2 font-mono border-b border-border-light">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="text-[10px] text-secondary/50 text-right italic font-mono">
              Database Environment Simulator (MySQL v8.0)
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};

export default AIGenerator;
