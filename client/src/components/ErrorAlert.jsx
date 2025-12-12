import React from 'react';
import { AlertCircle } from 'lucide-react';

export const ErrorAlert = ({ message }) => {
  if (!message) return null;

  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-[rgba(239,68,68,0.1)] border border-red-500/20 text-red-600 animate-fade-in my-4">
      <AlertCircle className="w-5 h-5 shrink-0" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};
