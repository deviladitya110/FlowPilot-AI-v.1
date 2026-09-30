import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Card, CardContent } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Activity, Clock, CheckCircle, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        if (user?.role === 'USER') {
          // Normal users just see a simple view
          setLoading(false);
          return;
        }
        const { data } = await api.get('/analytics/overview');
        setMetrics(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [user]);

  if (loading) return <div className="text-white p-8">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Good morning, {user?.name?.split(' ')[0]} 👋</h2>
        <p className="text-text-secondary mt-1">Here's what's happening with your workflows today.</p>
      </div>

      {user?.role !== 'USER' && metrics && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <p className="text-sm font-medium text-text-secondary">Total Requests</p>
                  <Activity className="h-4 w-4 text-primary" />
                </div>
                <div className="text-3xl font-bold text-white">{metrics.metrics.totalRequests}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <p className="text-sm font-medium text-text-secondary">Automation Rate</p>
                  <Zap className="h-4 w-4 text-primary" />
                </div>
                <div className="text-3xl font-bold text-white">{metrics.metrics.automationRate}%</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <p className="text-sm font-medium text-text-secondary">Pending Approvals</p>
                  <Clock className="h-4 w-4 text-warning" />
                </div>
                <div className="text-3xl font-bold text-white">{metrics.metrics.pendingApprovals}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <p className="text-sm font-medium text-text-secondary">Time Saved</p>
                  <CheckCircle className="h-4 w-4 text-success" />
                </div>
                <div className="text-3xl font-bold text-white">{metrics.metrics.timeSaved}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <div className="p-6 border-b border-border">
                <h3 className="font-semibold text-white">Recent Workflow Activity</h3>
              </div>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {metrics.recentActivity?.map((activity) => (
                    <div key={activity.id} className="p-4 flex items-center justify-between hover:bg-card-light transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <div>
                          <p className="text-sm font-medium text-white">{activity.description}</p>
                          <p className="text-xs text-text-secondary">{activity.title || 'System'} • {new Date(activity.created_at).toLocaleTimeString()}</p>
                        </div>
                      </div>
                      <span className="text-xs text-text-secondary bg-background px-2 py-1 rounded">
                        {activity.event_type}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {user?.role === 'USER' && (
        <Card>
          <CardContent className="p-6 text-center py-12">
            <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Welcome to FlowPilot AI</h3>
            <p className="text-text-secondary mb-6">Create a new request and let AI handle the routing.</p>
            <Link to="/requests/new" className="inline-flex items-center justify-center rounded-md bg-primary text-black h-10 px-4 py-2 font-medium hover:bg-primary-hover transition-colors">
              Create New Request
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
