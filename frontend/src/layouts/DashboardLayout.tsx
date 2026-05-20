import { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { ToastContainer } from '../components/Toast';

export const DashboardLayout = () => {
  const { token, initialized, fetchMe, user } = useAuthStore();

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  // If there is no token in localStorage, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Show a full page skeleton loader during initialization
  if (!initialized) {
    return (
      <div className="flex h-screen bg-slate-50">
        <div className="w-64 bg-white border-r border-slate-200 animate-pulse flex flex-col p-6 space-y-6">
          <div className="h-10 bg-slate-100 rounded w-3/4"></div>
          <div className="h-8 bg-slate-100 rounded"></div>
          <div className="h-8 bg-slate-100 rounded w-5/6"></div>
          <div className="h-8 bg-slate-100 rounded"></div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="h-16 bg-white border-b border-slate-200 animate-pulse"></div>
          <div className="p-8 space-y-6 flex-1">
            <div className="h-32 bg-white border border-slate-200 rounded animate-pulse"></div>
            <div className="h-96 bg-white border border-slate-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // If initialization completes but no user profile is returned, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};
export default DashboardLayout;
