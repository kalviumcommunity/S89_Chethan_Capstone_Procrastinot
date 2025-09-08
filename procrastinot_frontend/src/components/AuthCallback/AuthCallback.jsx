import { useEffect } from 'react';
import authService from '../../services/authService';

const AuthCallback = () => {
  useEffect(() => {
    const handleCallback = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      
      if (token) {
        // Extract userId from token (decode JWT)
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          authService.setAuth(token, payload.id);
          window.location.href = '/dashboard';
        } catch (error) {
          console.error('Invalid token:', error);
          window.location.href = '/';
        }
      } else {
        // No token, redirect to home
        window.location.href = '/';
      }
    };

    handleCallback();
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔄</div>
        <p>Processing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;