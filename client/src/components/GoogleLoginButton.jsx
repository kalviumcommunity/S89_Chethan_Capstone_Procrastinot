import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSuccess = async (credentialResponse) => {
    try {
      setIsLoading(true);
      setError('');
      const decoded = jwtDecode(credentialResponse.credential);
      const { name, email, sub: googleId } = decoded;

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/google-login`, {
        username: name,
        email,
        googleId,
      });

      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userId', res.data.userId);
        navigate('/dashboard');
      } else {
        throw new Error('No token received');
      }
    } catch (err) {
      console.error('Google login failed:', err);
      setError(err.response?.data?.message || 'Failed to login with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = () => {
    setError('Google login failed. Please try again.');
    setIsLoading(false);
  };

  return (
    <div className="mt-4">
      {isLoading ? (
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
          <span className="text-gray-600">Connecting...</span>
        </div>
      ) : (
        <GoogleLogin 
          onSuccess={handleSuccess} 
          onError={handleError}
          useOneTap
          theme="outline"
          shape="pill"
          size="large"
          locale="en"
          text="continue_with"
          context="signin"
        />
      )}
      {error && (
        <p className="text-red-500 text-sm mt-2 bg-red-50 p-2 rounded-lg">
          {error}
        </p>
      )}
    </div>
  );
};

export default GoogleLoginButton;
