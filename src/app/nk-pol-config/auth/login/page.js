'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Lock, User, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkExistingAuth = async () => {
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
          cache: 'no-store',
          headers
        });
        
        if (response.ok) {
          router.push('/nk-pol-config');
        } else {
          localStorage.removeItem('auth-token');
        }
      } catch (error) {
        console.log('Not authenticated, staying on login page');
        localStorage.removeItem('auth-token');
      }
    };

    checkExistingAuth();
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
        cache: 'no-store'
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful!');

        if (data.token) {
          localStorage.setItem('auth-token', data.token);
          console.log('Token stored in localStorage');

          window.location.href = '/nk-pol-config';
        } else {
          setError('Login succeeded but no token received.');
        }
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-20 pb-4 px-4">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="grid lg:grid-cols-2 min-h-[600px]">
          
          {/* Left Section - Login Form */}
          <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16">
            {/* Logo */}
            <div className="mb-8">
              <Image
                src="/images/assets/logo.png"
                alt="NK POL Logo"
                width={140}
                height={45}
                priority
                className="object-contain"
              />
            </div>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-black mb-3">
                Selamat Datang
              </h1>
              <p className="text-gray-600 text-base">
                Masuk ke dashboard admin NK POL
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-black mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-200"
                    placeholder="Masukkan username"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-black mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="block w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-200"
                    placeholder="Masukkan password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memproses...
                  </span>
                ) : (
                  'Masuk'
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8">
              <p className="text-xs text-gray-500">
                © 2025 NK POL. All rights reserved.
              </p>
            </div>
          </div>

          {/* Right Section - Image */}
          <div className="hidden lg:block relative">
            <div className="absolute inset-0">
              <Image
                src="/images/home.jpeg"
                alt="NK POL Exhibition"
                fill
                className="object-cover"
                priority
                quality={90}
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-transparent" />
            </div>
            
            {/* Overlay Content */}
            <div className="relative h-full flex flex-col justify-end p-12 text-white">
              <h2 className="text-3xl font-bold mb-3">
                Admin Panel
              </h2>
              <p className="text-lg text-gray-200 leading-relaxed">
                Kelola konten, portfolio, dan testimoni dengan mudah
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}