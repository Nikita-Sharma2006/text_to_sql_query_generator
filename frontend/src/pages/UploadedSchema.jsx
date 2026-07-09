import React, { useState, useRef } from 'react';
import { Database, Upload, Trash2, FileText, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Card from '../components/Card';
import Button from '../components/Button';
import toast from 'react-hot-toast';

const UploadedSchema = () => {
  const { schemas, uploadSchema, deleteSchema } = useApp();
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [expandedSchema, setExpandedSchema] = useState(null);

  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = async (file) => {
    if (!file) return;
    
    // Validate file type
    const isSql = file.name.endsWith('.sql');
    if (!isSql) {
      toast.error('Only SQL (.sql) files are accepted.');
      return;
    }

    setUploading(true);
    setUploadProgress(15);
    
    // Simulate upload progress animation
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 200);

    try {
      const text = await file.text();
      // Simulate compiling time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      clearInterval(interval);
      setUploadProgress(100);
      
      uploadSchema(file.name, text);
      toast.success('Schema cataloged successfully!');
    } catch (err) {
      toast.error('Failed to parse schema details.');
    } finally {
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleDelete = (id) => {
    deleteSchema(id);
    toast.error('Schema scroll deleted.');
  };

  const toggleExpand = (id) => {
    setExpandedSchema(expandedSchema === id ? null : id);
  };

  return (
    <div className="space-y-8 text-left animate-fade-in font-sans">
      {/* Title Header */}
      <div>
        <h2 className="text-2xl font-display font-bold tracking-tight text-primary uppercase">Database Schemas</h2>
        <p className="text-xs text-secondary mt-1">Upload and catalog schema structures to feed the AI generator context</p>
      </div>

      {/* Divider */}
      <div className="h-px bg-border-light w-full"></div>

      {/* Upload Area & Info */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Uploader and List */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Drag & Drop Area */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-[20px] p-12 text-center transition-all duration-300 relative overflow-hidden bg-white
              ${dragActive ? 'border-primary bg-[#FAFAFA] scale-[1.01]' : 'border-border-light'}
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".sql"
              onChange={handleChange}
              className="hidden"
            />

            {uploading ? (
              <div className="space-y-4 py-4">
                <div className="w-10 h-10 rounded-full border-solid border-[#111111]/10 border-t-[#B8FF4F] animate-spin mx-auto border-3"></div>
                <h4 className="font-semibold text-sm text-primary uppercase tracking-tight">Compiling schema...</h4>
                <div className="w-48 bg-border-light/50 h-1 rounded-full mx-auto overflow-hidden">
                  <div 
                    className="bg-primary h-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-12 h-12 bg-[#FAFAFA] border border-border-light rounded-xl flex items-center justify-center mx-auto text-primary shadow-3xs">
                  <Upload size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-primary uppercase tracking-wide">Upload SQL Schema</h4>
                  <p className="text-xs text-secondary mt-1 max-w-sm mx-auto leading-relaxed">
                    Drag and drop your schema file here, or click to choose from system files.
                  </p>
                </div>
                <Button 
                  onClick={handleButtonClick}
                  variant="secondary" 
                  size="sm"
                  className="cursor-pointer rounded-lg text-xs"
                >
                  Browse Files
                </Button>
                <div className="text-[9px] font-mono text-secondary uppercase tracking-wider">
                  Maximum file size: 10MB • Only .sql format
                </div>
              </div>
            )}
          </div>

          {/* Active Schemas List */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2">
              <Database size={14} /> Cataloged Schemas
            </h3>
            
            <div className="space-y-4">
              {schemas.map((s) => {
                const isExpanded = expandedSchema === s.id;
                return (
                  <Card 
                    key={s.id} 
                    variant="parchment" 
                    className="hover:border-primary hover:shadow-xs transition-all duration-300"
                  >
                    <div className="space-y-4 text-left">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-[#FAFAFA] border border-border-light rounded-xl text-primary shadow-3xs">
                            <FileText size={18} />
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm text-primary tracking-tight">{s.name}</h4>
                            <span className="text-[10px] font-mono text-secondary flex gap-4">
                              <span>Size: {s.size}</span>
                              <span>Tables: {s.tableCount}</span>
                              <span>Uploaded: {s.timestamp}</span>
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleExpand(s.id)}
                            className="p-2 text-secondary hover:text-primary transition-colors hover:bg-[#FAFAFA] rounded-lg cursor-pointer"
                            title="Inspect Tables"
                          >
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                          <button
                            onClick={() => handleDelete(s.id)}
                            className="p-2 text-[#EF4444] hover:bg-[#EF4444]/5 transition-colors rounded-lg cursor-pointer"
                            title="Delete Schema"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Expanded table details */}
                      {isExpanded && (
                        <div className="pt-4 border-t border-border-light/60 space-y-4 animate-fade-in">
                          <h5 className="text-xs font-semibold text-primary uppercase tracking-wider">Detected Tables Structure:</h5>
                          <div className="grid md:grid-cols-2 gap-4">
                            {s.tables.map((table, tIdx) => (
                              <div key={tIdx} className="bg-[#FAFAFA] border border-border-light p-4 rounded-xl shadow-3xs">
                                <span className="font-semibold text-xs text-primary border-b border-border-light/60 pb-1.5 block mb-2">
                                  {table.name}
                                </span>
                                <ul className="text-[11px] font-mono text-secondary space-y-1">
                                  {table.columns.map((col, cIdx) => (
                                    <li key={cIdx} className="flex justify-between">
                                      <span>• {col.split(' ')[0]}</span>
                                      <span className="text-secondary/60 italic font-sans text-[10px]">{col.split(' ')[1] || ''}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}

              {schemas.length === 0 && (
                <div className="text-center py-12 border border-dashed border-border-light bg-white text-secondary font-sans text-xs italic rounded-[20px]">
                  No database schemas registered yet. Upload a .sql file to enable context-aware query formulation.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right 1 Column: Guidelines */}
        <div>
          <Card variant="parchment" className="h-full border-border-light">
            <div className="space-y-4 text-xs font-sans text-left">
              <h3 className="font-display font-bold text-sm text-primary uppercase tracking-tight flex items-center gap-1.5">
                <AlertCircle size={15} /> Schema Guidelines
              </h3>
              <p className="text-secondary leading-relaxed">
                To maximize query accuracy, upload schema blueprints that follow standard MySQL declarations.
              </p>
              
              <ul className="space-y-3.5 text-secondary/80 pt-4 border-t border-border-light">
                <li className="flex gap-2">
                  <span className="text-primary font-bold">1.</span>
                  <span>Use standard <code>CREATE TABLE</code> block templates.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">2.</span>
                  <span>Declare data column types (e.g. <code>INT</code>, <code>VARCHAR</code>, <code>DECIMAL</code>).</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">3.</span>
                  <span>Include comments where helpful; Shogun AI reads schema descriptions.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">4.</span>
                  <span>Do not load user passwords or rows. Metadata schemas only.</span>
                </li>
              </ul>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default UploadedSchema;
