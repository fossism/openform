import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FormBuilder from './pages/FormBuilder';
import FormViewer from './pages/FormViewer';
import ResponsesDashboard from './pages/ResponsesDashboard';

// Placeholder Pages
const Home = () => (
  <div className="container text-center mt-4 animate-fade-in">
    <h1>Welcome to OpenForm</h1>
    <p>A robust open-source alternative to Google Forms.</p>
  </div>
);

function Navigation() {
  const { user, logout } = React.useContext(AuthContext);
  return (
    <header style={{ 
      padding: '1.5rem', 
      background: 'var(--surface-color)', 
      backdropFilter: 'var(--glass-blur)',
      WebkitBackdropFilter: 'var(--glass-blur)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.4)', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <a href="/" style={{ color: 'var(--primary-color)', margin: 0, fontSize: '1.75rem', fontWeight: 800, textDecoration: 'none', letterSpacing: '-0.05em' }}>openform</a>
      <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {user ? (
          <>
            <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Hi, {user.name}</span>
            <a href="/dashboard">Dashboard</a>
            <button onClick={logout} style={{ 
              background: 'rgba(239, 68, 68, 0.1)', 
              border: '1px solid rgba(239, 68, 68, 0.3)', 
              color: 'var(--error-color)', 
              fontWeight: 600,
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)'
            }}>Logout</button>
          </>
        ) : (
          <>
            <a href="/login">Login</a>
            <a href="/register" style={{
              background: 'var(--primary-color)',
              color: 'white',
              padding: '0.5rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600
            }}>Register</a>
          </>
        )}
      </nav>
    </header>
  );
}

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Navigation />
        <main style={{ padding: '2rem 0' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/form/builder" element={<FormBuilder />} />
            <Route path="/form/:id" element={<FormViewer />} />
            <Route path="/responses/:id" element={<ResponsesDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
