import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Layouts
import { AuthLayout } from './layouts/AuthLayout';
import { MainLayout } from './layouts/MainLayout';

// Pages
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Requests } from './pages/Requests';
import { NewRequest } from './pages/NewRequest';
import { RequestDetails } from './pages/RequestDetails';
import { WorkflowBuilder } from './pages/WorkflowBuilder';
import { Approvals } from './pages/Approvals';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-white">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      
      <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        
        <Route path="requests" element={<Requests />} />
        <Route path="requests/new" element={<NewRequest />} />
        <Route path="requests/:id" element={<RequestDetails />} />
        
        <Route path="workflows" element={<WorkflowBuilder />} />
        <Route path="approvals" element={<Approvals />} />
        
        {/* Placeholders */}
        <Route path="analytics" element={<div className="text-white">Analytics Page (Coming Soon)</div>} />
        <Route path="audit-logs" element={<div className="text-white">Audit Logs Page (Coming Soon)</div>} />
        <Route path="settings" element={<div className="text-white">Settings Page</div>} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster 
          position="top-right" 
          toastOptions={{
            style: {
              background: '#151515',
              color: '#fff',
              border: '1px solid #262626'
            },
            success: {
              iconTheme: { primary: '#22c55e', secondary: '#151515' }
            }
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
