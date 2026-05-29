import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await API.get('/forms');
        setForms(response.data);
      } catch (error) {
        console.error('Failed to fetch forms', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchForms();
    }
  }, [user]);

  return (
    <div className="container animate-fade-in" style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>My Forms</h2>
        <button 
          onClick={() => navigate('/form/builder')}
          style={{ background: 'var(--secondary-color)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', border: 'none', fontWeight: 600 }}
        >
          + Create New Form
        </button>
      </div>
      
      {loading ? (
        <p>Loading your forms...</p>
      ) : forms.length === 0 ? (
        <div className="card text-center" style={{ padding: '4rem 2rem' }}>
          <h3 style={{ color: 'var(--text-muted)' }}>You haven't created any forms yet.</h3>
          <p>Click "Create New Form" to get started.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {forms.map(form => (
            <div key={form._id} className="card">
              <h3 style={{ marginBottom: '0.5rem' }}>{form.title}</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                {form.questions?.length || 0} Questions &bull; {new Date(form.createdAt).toLocaleDateString()}
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  onClick={() => navigate(`/form/${form._id}`)}
                  style={{ flex: 1, background: 'var(--bg-color)', color: 'var(--text-main)', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                >
                  View Public Form
                </button>
                <button 
                  onClick={() => navigate(`/responses/${form._id}`)}
                  style={{ flex: 1, background: 'var(--primary-color)', color: 'white', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: 'none' }}
                >
                  View Results
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
