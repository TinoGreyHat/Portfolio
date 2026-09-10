import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { isAdminAuthenticated } from '../../services/apiService';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(isAdminAuthenticated());

  // Check auth status occasionally or when component mounts
  useEffect(() => {
    setIsAuthenticated(isAdminAuthenticated());
  }, []);

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <Routes>
      <Route path="/" element={<AdminDashboard onLogout={() => setIsAuthenticated(false)} />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
