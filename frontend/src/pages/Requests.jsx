import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Plus } from 'lucide-react';

export const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data } = await api.get('/requests');
        setRequests(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  if (loading) return <div className="text-white p-8">Loading requests...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Requests</h2>
          <p className="text-text-secondary mt-1">Manage and track your workflow requests.</p>
        </div>
        <Button onClick={() => navigate('/requests/new')}>
          <Plus className="mr-2 h-4 w-4" />
          New Request
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-text-secondary uppercase bg-card border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">ID / Title</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Priority</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-text-secondary">
                    No requests found.
                  </td>
                </tr>
              ) : (
                requests.map((request) => (
                  <tr 
                    key={request.id} 
                    className="hover:bg-card-light cursor-pointer transition-colors"
                    onClick={() => navigate(\`/requests/\${request.id}\`)}
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{request.title}</div>
                      <div className="text-text-secondary text-xs mt-1">#{request.id.slice(0,8)}</div>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">{request.category || '-'}</td>
                    <td className="px-6 py-4 text-text-secondary">{request.priority || '-'}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={request.status} />
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      {new Date(request.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
