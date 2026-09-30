import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import toast from 'react-hot-toast';

export const Approvals = () => {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApprovals = async () => {
    try {
      const { data } = await api.get('/approvals');
      setApprovals(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleAction = async (id, action) => {
    try {
      await api.post(\`/approvals/\${id}/\${action}\`, { reason: \`\${action} by manager\` });
      toast.success(\`Request \${action} successfully\`);
      fetchApprovals();
    } catch (error) {
      toast.error('Failed to process approval');
    }
  };

  if (loading) return <div className="text-white p-8">Loading approvals...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Approval Center</h2>
        <p className="text-text-secondary mt-1">Review requests flagged by the AI for human oversight.</p>
      </div>

      <div className="grid gap-4">
        {approvals.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-text-secondary">
              No pending approvals. All caught up!
            </CardContent>
          </Card>
        ) : (
          approvals.map((approval) => (
            <Card key={approval.id} className="border-warning/30">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-white">{approval.title}</h3>
                    <p className="text-sm text-text-secondary">Request #{approval.request_id.slice(0,8)}</p>
                  </div>
                  <StatusBadge status={approval.status} />
                </div>
                
                <div className="my-4 p-4 bg-background-light rounded border border-border">
                  <div className="text-sm text-white mb-2"><span className="text-text-secondary">Description:</span> {approval.description}</div>
                  {approval.ai_analysis && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-xs text-warning mb-1 font-medium">AI Flagged Reason:</p>
                      <p className="text-sm italic text-text-secondary">"{approval.ai_analysis.reason}"</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3">
                  <Button variant="danger" onClick={() => handleAction(approval.id, 'reject')}>Reject</Button>
                  <Button variant="primary" onClick={() => handleAction(approval.id, 'approve')}>Approve & Continue</Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
