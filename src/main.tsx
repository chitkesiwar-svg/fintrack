import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global Fetch Interceptor for Multi-Tenant Auth
const originalFetch = window.fetch;
window.fetch = async (input, init) => {
  if (typeof input === 'string' && input.startsWith('/api/')) {
    const userStr = localStorage.getItem('fintrack_user');
    const user = userStr ? JSON.parse(userStr) : null;
    if (user && user.id) {
      init = init || {};
      init.headers = {
        ...init.headers,
        'X-User-Id': user.id
      };
    }
  }
  return originalFetch(input, init);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
