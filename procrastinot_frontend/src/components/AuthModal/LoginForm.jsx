import { useState } from 'react';
import FormInput from './FormInput';
import SocialAuthButton from './SocialAuthButton';
import authService from '../../services/authService';
import styles from './AuthForm.module.css';

const LoginForm = ({ onModeChange, onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      await authService.login({
        email: formData.email,
        password: formData.password
      });
      onClose();
      // Redirect to success page
      window.location.href = '/success';
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = 'https://s89-chethan-capstone-procrastinot-1.onrender.com/api/users/google';
  };

  return (
    <div className={styles.authForm}>
      <div className={styles.header}>
        <h2 className={`heading-lg ${styles.title}`}>
          Welcome <span className="text-gradient">Back</span>
        </h2>
        <p className={`text-base ${styles.subtitle}`}>
          Ready to master your productivity?
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <FormInput
          label="Email"
          type="email"
          value={formData.email}
          error={errors.email}
          placeholder="Enter your email"
          required
          onChange={(value) => handleInputChange('email', value)}
          icon="mail"
        />

        <FormInput
          label="Password"
          type="password"
          value={formData.password}
          error={errors.password}
          placeholder="Enter your password"
          required
          onChange={(value) => handleInputChange('password', value)}
          icon="lock"
          showPasswordToggle
        />

        <div className={styles.formOptions}>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={formData.rememberMe}
              onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
            />
            <span className={styles.checkmark}></span>
            <span className={styles.checkboxLabel}>Remember me</span>
          </label>
          
          <button type="button" className={styles.forgotPassword}>
            Forgot Password?
          </button>
        </div>

        {errors.submit && (
          <div className={styles.errorMessage}>
            {errors.submit}
          </div>
        )}

        <button 
          type="submit" 
          className={`btn btn-auth-primary ${styles.submitButton}`}
          disabled={isLoading}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>

        <div className={styles.divider}>
          <span className={styles.dividerText}>Or continue with</span>
        </div>

        <SocialAuthButton 
          provider="google"
          onClick={handleGoogleAuth}
          isLoading={isLoading}
        />

        <div className={styles.switchMode}>
          <span className={styles.switchText}>Don't have an account?</span>
          <button 
            type="button" 
            className={styles.switchButton}
            onClick={() => onModeChange('signup')}
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;