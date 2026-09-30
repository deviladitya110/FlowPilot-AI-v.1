import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Zap, Calendar, User, Tag, AlertCircle, FileText } from 'lucide-react';

export const RequestDetails = () => {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reqRes, logsRes] = await Promise.all([
          api.get(\`/requests/\${id}\`),
          api.get(\`/audit-logs?request_id=\${id}\`)
        ]);
        setRequest(reqRes.data);
        setLogs(logsRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="text-white p-8">Loading details...</div>;
  if (!request) return <div className="text-white p-8">Request not found.</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">{request.title}</h2>
          <div className="flex items-center space-x-4 mt-2">
            <span className="text-text-secondary text-sm">#{request.id.slice(0,8)}</span>
            <StatusBadge status={request.status} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Request Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-text leading-relaxed whitespace-pre-wrap">{request.description}</p>
            </CardContent>
          </Card>

          {request.ai_analysis && (
            <Card className="border-primary/30">
              <CardHeader className="bg-primary/5 border-b border-primary/20 pb-4">
                <CardTitle className="text-primary flex items-center">
                  <Zap className="mr-2 h-5 w-5" /> AI Analysis & Routing
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                  <div>
                    <span className="flex items-center text-xs text-text-secondary mb-1"><Tag className="h-3 w-3 mr-1"/> Category</span>
                    <span className="text-white font-medium">{request.category}</span>
                  </div>
                  <div>
                    <span className="flex items-center text-xs text-text-secondary mb-1"><AlertCircle className="h-3 w-3 mr-1"/> Priority</span>
                    <span className="text-white font-medium">{request.priority}</span>
                  </div>
                  <div>
                    <span className="flex items-center text-xs text-text-secondary mb-1"><FileText className="h-3 w-3 mr-1"/> Intent</span>
                    <span className="text-white font-medium">{request.intent}</span>
                  </div>
                  <div>
                    <span className="flex items-center text-xs text-text-secondary mb-1"><Zap className="h-3 w-3 mr-1"/> Confidence</span>
                    <span className="text-white font-medium">{Math.round(request.ai_confidence * 100)}%</span>
                  </div>
                </div>
                <div className="bg-background-light p-4 rounded-md border border-border">
                  <p className="text-sm italic text-text-secondary">"{request.ai_analysis.reason}"</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {logs.map((log, i) => (
                  <div key={log.id} className="relative pl-6 pb-2">
                    {/* Line */}
                    {i !== logs.length - 1 && (
                      <div className="absolute left-[7px] top-2 bottom-[-16px] w-[2px] bg-border" />
                    )}
                    {/* Dot */}
                    <div className="absolute left-0 top-1.5 h-4 w-4 rounded-full border-2 border-background bg-primary" />
                    
                    <div>
                      <p className="text-sm font-medium text-white">{log.description}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-text-secondary bg-background-light px-1.5 py-0.5 rounded">
                          {log.event_type}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {new Date(log.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
