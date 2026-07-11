import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 transition-colors duration-200 dark:bg-dark-950">
      <Navbar />
      
      {/* Background Decorators for Premium Feel */}
      <div className="relative flex-grow overflow-hidden">
        <div className="absolute left-1/3 top-10 h-72 w-72 rounded-full bg-emerald-500/5 blur-[120px] dark:bg-emerald-500/3"></div>
        <div className="absolute right-1/4 bottom-10 h-96 w-96 rounded-full bg-indigo-500/5 blur-[150px] dark:bg-indigo-500/3"></div>
        
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default DashboardLayout;
