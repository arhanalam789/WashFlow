/**
 * Login Page Component
 *
 * Handles user authentication (login and registration).
 */

import { useState } from 'react';
import { authAPI } from '../services/api';

function LoginPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (!isLogin && !formData.name) {
      setError('Please enter your name');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Log what we're sending (for debugging)
    console.log('Sending form data:', formData);

    try {
      if (isLogin) {
        // Login
        const response = await authAPI.login({
          email: formData.email,
          password: formData.password
        });

        if (response.success) {
          onLogin(response.data.user);
        }
      } else {
        // Register
        const response = await authAPI.register(formData);

        if (response.success) {
          onLogin(response.data.user);
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '28px', color: '#1976d2', marginBottom: '5px' }}>WashFlow</h1>
          <p style={{ color: '#666' }}>Laundry Management System</p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-input"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          {!isLogin && (
            <>
              <div className="form-group">
                <label className="form-label" htmlFor="name">Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="form-input"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="role">Role</label>
                <select
                  id="role"
                  name="role"
                  className="form-select"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="student">Student</option>
                  <option value="staff">Laundry Staff</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            className="button button-primary"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
          <span style={{ color: '#666' }}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
          </span>
          <button
            type="button"
            onClick={toggleMode}
            style={{
              background: 'none',
              border: 'none',
              color: '#1976d2',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#999' }}>
          Demo credentials:<br />
          Student: student@test.com / password123<br />
          Staff: staff@test.com / password123<br />
          Admin: admin@test.com / password123
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
