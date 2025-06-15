import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  
  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');
    
    if (error) {
      setError(decodeURIComponent(error));
      setTimeout(() => navigate('/login'), 3000);
      return;
    }

    if (token) {
      try {
        localStorage.setItem('token', token);
        navigate('/dashboard');
      } catch (err) {
        console.error('Error storing token:', err);
        setError('Failed to complete authentication');
        setTimeout(() => navigate('/login'), 3000);
      }
    } else {
      setError('No authentication token received');
      setTimeout(() => navigate('/login'), 3000);
    }
  }, [navigate, searchParams]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="card-modern p-8 max-w-md w-full">
          <div className="text-red-500 text-center">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg font-semibold">Authentication Failed</p>
            <p className="mt-2 text-sm text-gray-600">{error}</p>
            <p className="mt-4 text-sm text-gray-500">Redirecting to login page...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="card-modern p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gradient font-semibold">Completing login...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
