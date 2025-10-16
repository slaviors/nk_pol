'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import GalleryPostManage from '@/components/backend-integration/nk-pol-config/GalleryPostManage';
import ClientLogoManage from '@/components/backend-integration/nk-pol-config/ClientLogoManage';
import TestimonyManage from '@/components/backend-integration/nk-pol-config/TestimonyManage';

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('gallery');
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    try {

      const token = localStorage.getItem('auth-token');
      
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch('/api/admin/auth/me', {
        credentials: 'include',
        headers
      });
      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
      } else {
        console.log('Auth check failed:', data.error);
        localStorage.removeItem('auth-token');
        router.push('/nk-pol-config/auth/login');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('auth-token');
      router.push('/nk-pol-config/auth/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLogout = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/auth/logout', {
        method: 'POST',
        credentials: 'include' 
      });

      if (response.ok) {

        localStorage.removeItem('auth-token');
        setUser(null); 
        router.push('/nk-pol-config/auth/login');
      } else {
        setError('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      setError('Network error during logout');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-2">
          <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">NK Pol Admin Panel</h1>
              <p className="text-sm text-gray-600">Welcome back, {user?.username}</p>
            </div>
            <button
              onClick={handleLogout}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              {loading ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'gallery-posts', name: 'Gallery Posts', count: '' },
              { id: 'testimonies', name: 'Testimonies', count: '' },
              { id: 'client-logos', name: 'Client Logos', count: '' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
                {tab.count && <span className="ml-1 text-xs text-gray-400">({tab.count})</span>}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
            <button 
              onClick={() => setError('')}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            {activeTab === 'gallery-posts' && <GalleryPostManage />}
            {activeTab === 'testimonies' && <TestimonyManage />}
            {activeTab === 'client-logos' && <ClientLogoManage />}
          </div>
        </div>
      </main>
    </div>
  );
}