'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Home, Image as ImageIcon, MessageSquare, Award, Menu, X } from 'lucide-react';
import GalleryPostManage from '@/components/backend-integration/nk-pol-config/GalleryPostManage';
import ClientLogoManage from '@/components/backend-integration/nk-pol-config/ClientLogoManage';
import TestimonyManage from '@/components/backend-integration/nk-pol-config/TestimonyManage';

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('gallery-posts');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

      const token = localStorage.getItem('auth-token');
      const headers = {
        'Content-Type': 'application/json'
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/admin/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-black rounded-full animate-pulse" />
            </div>
          </div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'gallery-posts', name: 'Gallery Posts', icon: ImageIcon },
    { id: 'testimonies', name: 'Testimonies', icon: MessageSquare },
    { id: 'client-logos', name: 'Client Logos', icon: Award },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-red-100 to-red-50 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-gray-200 to-gray-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gray-100 rounded-full blur-3xl opacity-30" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90">
        <div className="container-custom">
          <div className="flex justify-between items-center h-20">
            {/* Title */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Admin Panel</h1>
              <p className="text-sm text-gray-600 mt-0.5">Welcome back, <span className="font-semibold text-gray-900">{user?.username}</span></p>
            </div>

            {/* Desktop Actions */}
            <div className="hidden sm:flex items-center gap-3">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-900 border-2 border-gray-200 rounded-xl font-semibold text-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-sm hover:shadow-md transform active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
              <button
                onClick={() => router.push('/')}
                className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-xl font-semibold text-sm hover:bg-gray-800 transition-all duration-300 shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/20 transform active:scale-95"
              >
                <Home className="w-4 h-4" />
                Back to Home
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="sm:hidden pb-4 border-t border-gray-100 space-y-2 pt-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-gray-900 border-2 border-gray-200 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-black text-white rounded-xl font-semibold text-sm hover:bg-gray-800 transition-all duration-300"
              >
                <Home className="w-4 h-4" />
                Back to Home
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="sticky top-20 z-20 bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="container-custom">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-6 py-4 border-b-3 font-semibold text-sm whitespace-nowrap
                    transition-all duration-300 relative group
                    ${activeTab === tab.id
                      ? 'border-black text-black bg-gray-50/50'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50/30'
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-105'}`} />
                  <span className="hidden sm:inline">{tab.name}</span>
                  <span className="sm:hidden">{tab.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Error Alert */}
      {error && (
        <div className="container-custom pt-6">
          <div
            className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 shadow-sm"
            style={{ animation: 'slideDown 0.3s ease-out' }}
          >
            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-red-800 text-sm flex-1 font-medium">{error}</p>
            <button
              onClick={() => setError('')}
              className="text-red-600 hover:text-red-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 container-custom py-6 md:py-8">
        <div
          className="bg-white rounded-2xl border-2 border-gray-200 shadow-2xl shadow-black/10"
          style={{ animation: 'fadeInUp 0.5s ease-out' }}
        >
          <div className="p-6 sm:p-8 lg:p-10">
            {activeTab === 'gallery-posts' && <GalleryPostManage />}
            {activeTab === 'testimonies' && <TestimonyManage />}
            {activeTab === 'client-logos' && <ClientLogoManage />}
          </div>
        </div>
      </main>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes expandWidth {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}