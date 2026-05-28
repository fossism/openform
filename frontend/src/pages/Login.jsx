import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '400px', marginTop: '4rem' }}>
      <div className="card">
        <h2 className="text-center mb-4" style={{ color: 'var(--primary-color)' }}>Welcome Back</h2>
        
        {error && (
          <div style={{ background: '#fee2e2', color: 'var(--error-color)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
              required 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
              required 
            />
          </div>
          <button type="submit" style={{ background: 'var(--primary-color)', color: 'white', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: 'none', fontWeight: 600, marginTop: '0.5rem' }}>
            Log In
          </button>
        </form>
        <p className="text-center mt-4" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
