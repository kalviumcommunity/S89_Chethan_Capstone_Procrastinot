import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const { name, email, sub: googleId } = decoded;

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/users/google-login`, {
        username: name,
        email,
        googleId,
      });

      // Store token and handle successful login
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.userId);
      navigate('/dashboard');
    } catch (err) {
      console.error('Google login failed:', err);
      setError(err.response?.data?.message || 'Failed to login with Google');
    }
  };

  const handleError = () => {
    setError('Google login failed. Please try again.');
  };

  return (
    <div className="mt-4">
      <GoogleLogin 
        onSuccess={handleSuccess} 
        onError={handleError}
        useOneTap
        theme="outline"
        shape="pill"
        size="large"
        locale="en"
      />
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default GoogleLoginButton;
