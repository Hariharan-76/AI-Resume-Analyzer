import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-dark-950">
        <div className="relative h-16 w-16">
          <div className="absolute h-full w-full rounded-full border-4 border-emerald-100 dark:border-emerald-950"></div>
          <div className="absolute h-full w-full rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
