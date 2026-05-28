import React from 'react';

const Dashboard = () => {
  const dummyForms = [
    { id: 1, title: 'Midterm Feedback', responses: 45, status: 'Active' },
    { id: 2, title: 'Hackathon Registration', responses: 120, status: 'Closed' }
  ];

  return (
    <div className="container animate-fade-in" style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>My Forms</h2>
        <button style={{ background: 'var(--secondary-color)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', border: 'none', fontWeight: 600 }}>
          + Create New Form
        </button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {dummyForms.map(form => (
          <div key={form.id} className="card">
            <h3 style={{ marginBottom: '0.5rem' }}>{form.title}</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{form.responses} Responses &bull; {form.status}</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button style={{ flex: 1, background: 'var(--bg-color)', color: 'var(--text-main)', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>Edit</button>
              <button style={{ flex: 1, background: 'var(--primary-color)', color: 'white', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: 'none' }}>View Data</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
