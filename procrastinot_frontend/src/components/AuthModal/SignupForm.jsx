import { useState } from 'react';
import FormInput from './FormInput';
import SocialAuthButton from './SocialAuthButton';
import authService from '../../services/authService';
import styles from './AuthForm.module.css';

const SignupForm = ({ onModeChange, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms';
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
      await authService.register(formData);
      onClose();
      // Redirect to dashboard
      window.location.href = '/dashboard';
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
          Join the <span className="text-gradient">Warriors</span>
        </h2>
        <p className={`text-base ${styles.subtitle}`}>
          Welcome to the dojo
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <FormInput
          label="Full Name"
          type="text"
          value={formData.fullName}
          error={errors.fullName}
          placeholder="Enter your full name"
          required
          onChange={(value) => handleInputChange('fullName', value)}
          icon="user"
        />

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

        <FormInput
          label="Confirm Password"
          type="password"
          value={formData.confirmPassword}
          error={errors.confirmPassword}
          placeholder="Confirm your password"
          required
          onChange={(value) => handleInputChange('confirmPassword', value)}
          icon="lock"
          showPasswordToggle
        />

        <div className={styles.termsContainer}>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={formData.agreeToTerms}
              onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
            />
            <span className={styles.checkmark}></span>
            <span className={styles.checkboxLabel}>
              By signing up, you agree to our{' '}
              <a href="#terms" className={styles.link}>Terms of Service</a>
              {' '}and{' '}
              <a href="#privacy" className={styles.link}>Privacy Policy</a>
            </span>
          </label>
          {errors.agreeToTerms && (
            <span className={styles.error}>{errors.agreeToTerms}</span>
          )}
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
          {isLoading ? 'Creating Account...' : 'Create Account'}
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
          <span className={styles.switchText}>Already have an account?</span>
          <button 
            type="button" 
            className={styles.switchButton}
            onClick={() => onModeChange('login')}
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;