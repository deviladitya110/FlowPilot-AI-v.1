import React from 'react';
import { Outlet } from 'react-router-dom';
import { Zap } from 'lucide-react';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <div className="mb-8 flex items-center">
        <Zap className="h-8 w-8 text-primary mr-2" />
        <span className="text-3xl font-bold text-white tracking-tight">FlowPilot AI</span>
      </div>
      <div className="w-full max-w-md">
        <Outlet />
      </div>
      <div className="mt-8 text-center text-sm text-text-secondary">
        <p>"Turn repetitive requests into intelligent workflows."</p>
      </div>
    </div>
  );
};
