import React, { useCallback, useState } from 'react';
import { Upload, FileAudio, AlertCircle } from 'lucide-react';

interface AudioUploaderProps {
  onFileSelected: (file: File) => void;
  isLoading: boolean;
}

export const AudioUploader: React.FC<AudioUploaderProps> = ({ onFileSelected, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const validateAndPassFile = (file: File) => {
    setError(null);
    if (file.type !== "audio/mpeg" && !file.name.toLowerCase().endsWith('.mp3')) {
      setError("Invalid format. Only MP3 files are accepted.");
      return;
    }
    // Optional: Check file size if needed, though not strictly required by prompt
    if (file.size > 10 * 1024 * 1024) { // 10MB limit check
         setError("File size too large. Please upload an MP3 under 10MB.");
         return;
    }
    onFileSelected(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      if (e.dataTransfer.files.length > 1) {
        setError("Multi-file upload rejected. Only one audio file allowed per request.");
        return;
      }
      validateAndPassFile(e.dataTransfer.files[0]);
    }
  }, [onFileSelected]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndPassFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div 
        className={`relative group border-2 border-dashed rounded-2xl p-12 transition-all duration-300 ease-in-out shadow-sm
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 bg-white/60'}
          ${isLoading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          onChange={handleChange}
          accept="audio/mpeg,.mp3"
          disabled={isLoading}
        />

        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className={`p-4 rounded-full transition-colors ${dragActive ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500 group-hover:text-slate-700'}`}>
            <Upload size={32} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-medium text-slate-700">
              Drag & Drop or Click to Upload
            </h3>
            <p className="text-sm text-slate-500">
              Format: MP3 only • Max 1 file • No pre-processing
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 rounded-lg bg-red-50 border border-red-200 flex items-center gap-3 text-red-600 animate-in fade-in slide-in-from-top-2">
          <AlertCircle size={20} />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}
    </div>
  );
};