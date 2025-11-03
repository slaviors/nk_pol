export async function fetchWithAuth(url, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    ...options,
    headers,
    credentials: 'include'   };
  
  const response = await fetch(url, config);

  if (response.status === 401 && typeof window !== 'undefined') {
    localStorage.removeItem('auth-token');
  }
  
  return response;
}

export function getAuthToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth-token');
  }
  return null;
}

export function setAuthToken(token) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth-token', token);
  }
}

export function clearAuthToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth-token');
  }
}
