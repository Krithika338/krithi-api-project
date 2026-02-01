import React from 'react';
import { AnalysisResponse, Classification } from '../types';
import { ShieldCheck, ShieldAlert, Activity, Cpu, HeartPulse, BrainCircuit } from 'lucide-react';

interface AnalysisResultProps {
  result: AnalysisResponse;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ result }) => {
  const isHuman = result.classification === Classification.HUMAN;
  const percentage = Math.round(result.confidence * 100);
  
  // Theme based on classification
  const themeColor = isHuman ? 'emerald' : 'rose';
  const Icon = isHuman ? ShieldCheck : ShieldAlert;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Header Card */}
      <div className={`relative overflow-hidden rounded-2xl border bg-white/90 p-8 shadow-xl
        ${isHuman ? 'border-emerald-200 shadow-emerald-100' : 'border-rose-200 shadow-rose-100'}`}>
        
        {/* Background Glow */}
        <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-30 pointer-events-none
          ${isHuman ? 'bg-emerald-300' : 'bg-rose-300'}`} />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className={`p-4 rounded-xl ${isHuman ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
              <Icon size={40} strokeWidth={1.5} />
            </div>
            <div>
              <div className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-1">Classification</div>
              <h2 className={`text-3xl font-bold tracking-tight ${isHuman ? 'text-emerald-700' : 'text-rose-700'}`}>
                {result.classification}
              </h2>
            </div>
          </div>

          <div className="text-center md:text-right">
             <div className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-1">Confidence Score</div>
             <div className="text-4xl font-mono font-bold text-slate-800">
                {result.confidence.toFixed(2)}
             </div>
          </div>
        </div>

        {/* Confidence Meter */}
        <div className="mt-8 relative h-2 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out rounded-full ${isHuman ? 'bg-emerald-500' : 'bg-rose-500'}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Language Detected */}
        <div className="p-6 rounded-xl border border-slate-200 bg-white/60 shadow-sm">
           <div className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">Detected Language</div>
           <div className="text-xl font-medium text-slate-800">{result.language}</div>
        </div>

        {/* Explanation */}
        <div className="md:col-span-2 p-6 rounded-xl border border-slate-200 bg-white/60 shadow-sm">
           <div className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3">Analysis Explanation</div>
           <p className="text-slate-600 leading-relaxed text-sm">
             {result.explanation}
           </p>
        </div>
      </div>

      {/* Simulated Component Breakdown */}
      <div className="grid grid-cols-3 gap-2 opacity-80">
         <div className="flex flex-col items-center p-3 rounded bg-white border border-slate-200 shadow-sm">
            <Activity className="w-5 h-5 text-blue-500 mb-2" />
            <span className="text-[10px] text-slate-500 uppercase font-mono">CNN Acoustic</span>
         </div>
         <div className="flex flex-col items-center p-3 rounded bg-white border border-slate-200 shadow-sm">
            <BrainCircuit className="w-5 h-5 text-purple-500 mb-2" />
            <span className="text-[10px] text-slate-500 uppercase font-mono">LSTM Temporal</span>
         </div>
         <div className="flex flex-col items-center p-3 rounded bg-white border border-slate-200 shadow-sm">
            <HeartPulse className="w-5 h-5 text-pink-500 mb-2" />
            <span className="text-[10px] text-slate-500 uppercase font-mono">XGB Physiological</span>
         </div>
      </div>

    </div>
  );
};