import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Zap, Activity, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export const NewRequest = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [step, setStep] = useState('IDLE'); // IDLE, CREATING, ANALYZING, ROUTING, DONE
  const [analysisResult, setAnalysisResult] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.length < 5 || description.length < 10) {
      toast.error('Please provide a descriptive title and details.');
      return;
    }

    try {
      setStep('CREATING');
      const { data: request } = await api.post('/requests', { title, description });
      
      setStep('ANALYZING');
      // Adding artificial delay for UI demo effect
      await new Promise(r => setTimeout(r, 1500));
      
      setStep('ROUTING');
      const { data: runResult } = await api.post(\`/workflows/\${request.id}/run\`);
      
      // Fetch updated request to get AI analysis
      const { data: updatedRequest } = await api.get(\`/requests/\${request.id}\`);
      setAnalysisResult(updatedRequest.ai_analysis);
      
      setStep('DONE');
      toast.success(runResult.message || 'Workflow executed');
      
      setTimeout(() => {
        navigate(\`/requests/\${request.id}\`);
      }, 3000);
      
    } catch (error) {
      toast.error('Failed to process request');
      setStep('IDLE');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">New Request</h2>
        <p className="text-text-secondary mt-1">Describe your issue or request and let AI automate the routing.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          {step === 'IDLE' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Request Title</label>
                <Input 
                  placeholder="e.g. Wi-Fi down in Library" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Description</label>
                <textarea 
                  className="flex min-h-[120px] w-full rounded-md border border-border bg-background-light px-3 py-2 text-sm text-text placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="My college Wi-Fi has been down for two days..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="pt-2">
                <Button type="submit" className="w-full sm:w-auto">
                  <Zap className="mr-2 h-4 w-4" />
                  Analyze & Automate
                </Button>
              </div>
            </form>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center space-y-8">
              <div className="flex flex-col space-y-4 w-full max-w-sm">
                <StepIndicator current={step === 'CREATING'} done={['ANALYZING', 'ROUTING', 'DONE'].includes(step)} text="Creating request record..." />
                <StepIndicator current={step === 'ANALYZING'} done={['ROUTING', 'DONE'].includes(step)} text="AI analyzing intent and urgency..." />
                <StepIndicator current={step === 'ROUTING'} done={step === 'DONE'} text="Evaluating business rules..." />
                <StepIndicator current={step === 'DONE'} done={step === 'DONE'} text="Workflow triggered!" />
              </div>

              {step === 'DONE' && analysisResult && (
                <div className="w-full bg-background-light border border-border rounded-lg p-6 mt-8 animate-in fade-in slide-in-from-bottom-4">
                  <h4 className="font-medium text-primary mb-4 flex items-center"><Zap className="h-4 w-4 mr-2"/> AI Classification Result</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-text-secondary block text-xs">Category</span><span className="text-white font-medium">{analysisResult.category}</span></div>
                    <div><span className="text-text-secondary block text-xs">Priority</span><span className="text-white font-medium">{analysisResult.priority}</span></div>
                    <div><span className="text-text-secondary block text-xs">Intent</span><span className="text-white font-medium">{analysisResult.intent}</span></div>
                    <div><span className="text-text-secondary block text-xs">Confidence</span><span className="text-white font-medium">{Math.round(analysisResult.confidence * 100)}%</span></div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border">
                    <span className="text-text-secondary block text-xs mb-1">Reasoning</span>
                    <p className="text-text italic">"{analysisResult.reason}"</p>
                  </div>
                  <div className="mt-4">
                    <span className="text-text-secondary block text-xs mb-1">Action Triggered</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary border border-primary/30">
                      {analysisResult.recommendedAction}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const StepIndicator = ({ current, done, text }) => {
  return (
    <div className={`flex items-center space-x-3 \${!current && !done ? 'opacity-40' : ''}`}>
      {done ? (
        <CheckCircle className="h-5 w-5 text-success" />
      ) : current ? (
        <Activity className="h-5 w-5 text-primary animate-pulse" />
      ) : (
        <Clock className="h-5 w-5 text-text-secondary" />
      )}
      <span className={`text-sm font-medium \${current ? 'text-primary' : done ? 'text-white' : 'text-text-secondary'}`}>
        {text}
      </span>
    </div>
  );
};
