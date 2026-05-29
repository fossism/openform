import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FormBuilder from './pages/FormBuilder';

// Placeholder Pages
const Home = () => (
  <div className="container text-center mt-4 animate-fade-in">
    <h1>Welcome to OpenForm</h1>
    <p>A robust open-source alternative to Google Forms.</p>
  </div>
);
const FormViewer = () => <div className="container mt-4"><h2>Form Viewer</h2></div>;

function Navigation() {
  const { user, logout } = React.useContext(AuthContext);
  return (
    <header style={{ padding: '1rem', background: 'var(--surface-color)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <a href="/" style={{ color: 'var(--primary-color)', margin: 0, fontSize: '1.5rem', fontWeight: 700, textDecoration: 'none' }}>OpenForm</a>
      <nav>
        {user ? (
          <>
            <span style={{ marginRight: '1rem', color: 'var(--text-muted)' }}>Hello, {user.name}</span>
            <a href="/dashboard" style={{ marginRight: '1rem' }}>Dashboard</a>
            <button onClick={logout} style={{ background: 'transparent', border: 'none', color: 'var(--error-color)', fontWeight: 600 }}>Logout</button>
          </>
        ) : (
          <>
            <a href="/login" style={{ marginRight: '1rem' }}>Login</a>
            <a href="/register">Register</a>
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
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
