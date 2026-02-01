import React from 'react';
import { Loader2, CheckCircle2, Circle } from 'lucide-react';
import { ProcessingStage } from '../types';

interface ProcessingStepProps {
  currentStage: ProcessingStage;
}

export const ProcessingStep: React.FC<ProcessingStepProps> = ({ currentStage }) => {
  const steps = [
    { id: ProcessingStage.ANALYZING_CNN, label: "CNN Acoustic Analysis", sub: "Checking spectral artifacts" },
    { id: ProcessingStage.ANALYZING_LSTM, label: "LSTM Temporal Analysis", sub: "Evaluating emotional uniformity" },
    { id: ProcessingStage.ANALYZING_XGB, label: "XGBoost Physiological Analysis", sub: "Detecting breathing patterns" },
    { id: ProcessingStage.DECIDING, label: "Aggregating Scores", sub: "Finalizing confidence metric" },
  ];

  // Helper to determine state of a step
  const getStepStatus = (stepId: ProcessingStage) => {
    const stageOrder = [
      ProcessingStage.UPLOADING,
      ProcessingStage.ANALYZING_CNN,
      ProcessingStage.ANALYZING_LSTM,
      ProcessingStage.ANALYZING_XGB,
      ProcessingStage.DECIDING,
      ProcessingStage.COMPLETED
    ];
    
    const currentIndex = stageOrder.indexOf(currentStage);
    const stepIndex = stageOrder.indexOf(stepId);

    if (currentStage === ProcessingStage.COMPLETED) return 'completed';
    if (currentIndex === stepIndex) return 'active';
    if (currentIndex > stepIndex) return 'completed';
    return 'pending';
  };

  return (
    <div className="w-full max-w-md mx-auto py-8 relative">
      {/* Vertical Timeline Line */}
      <div className="absolute left-[19px] top-10 bottom-10 w-0.5 bg-slate-200 -z-10" />

      <div className="space-y-6">
        {steps.map((step) => {
          const status = getStepStatus(step.id);
          const isCompleted = status === 'completed';
          const isActive = status === 'active';
          
          return (
            <div key={step.id} className="flex items-start gap-4 group relative">
              {/* Icon Container */}
              <div className="relative flex-shrink-0 mt-1">
                {/* Active Pulse Effect */}
                {isActive && (
                  <div className="absolute inset-0 -m-1 bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full opacity-30 animate-pulse" />
                )}
                
                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-2
                  ${isCompleted 
                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-200' 
                    : isActive 
                      ? 'bg-gradient-to-tr from-blue-600 to-emerald-500 border-transparent text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-110' 
                      : 'bg-white border-slate-200 text-slate-300'
                  }
                `}>
                  {isCompleted ? (
                    <CheckCircle2 size={20} className="animate-in zoom-in duration-300" />
                  ) : isActive ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <Circle size={12} fill="currentColor" className="text-slate-100" />
                  )}
                </div>
              </div>
              
              {/* Text Content */}
              <div className={`flex-1 pt-2 transition-all duration-500 ${status === 'pending' ? 'opacity-40 blur-[0.5px]' : 'opacity-100'}`}>
                <h4 className={`text-sm font-semibold tracking-tight transition-colors duration-300
                  ${isActive ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-emerald-600' : 'text-slate-800'}
                `}>
                  {step.label}
                </h4>
                <p className={`text-xs font-mono mt-0.5 transition-colors duration-300
                   ${isActive ? 'text-emerald-600' : 'text-slate-500'}
                `}>
                  {step.sub}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};