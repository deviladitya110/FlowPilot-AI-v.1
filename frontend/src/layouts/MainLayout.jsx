import React, { useContext } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, FileText, Activity, CheckSquare, BarChart2, Shield, Settings, LogOut, Zap } from 'lucide-react';

export const MainLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Requests', path: '/requests', icon: FileText },
    { name: 'Workflows', path: '/workflows', icon: Activity },
    { name: 'Approvals', path: '/approvals', icon: CheckSquare, hide: user?.role === 'USER' },
    { name: 'Analytics', path: '/analytics', icon: BarChart2, hide: user?.role === 'USER' },
    { name: 'Audit Logs', path: '/audit-logs', icon: Shield },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Zap className="h-6 w-6 text-primary mr-2" />
          <span className="text-lg font-bold text-white tracking-tight">FlowPilot AI</span>
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-1">
          {navItems.filter(i => !i.hide).map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  \`flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors \${
                    isActive 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-text-secondary hover:bg-card-light hover:text-text'
                  }\`
                }
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center mb-4 px-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-black font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-text">{user?.name}</p>
              <p className="text-xs text-text-secondary">{user?.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-text-secondary hover:text-white hover:bg-card-light rounded-md transition-colors"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-8">
          <h1 className="text-xl font-semibold text-text">Workspace</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-text-secondary">Demo Environment</span>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
