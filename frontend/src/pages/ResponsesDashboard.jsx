import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const ResponsesDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [formRes, responsesRes] = await Promise.all([
          API.get(`/forms/${id}`),
          API.get(`/responses/${id}`)
        ]);
        setForm(formRes.data);
        setResponses(responsesRes.data);
      } catch (err) {
        setError('Failed to fetch responses. Ensure you are the creator of this form.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="container mt-4 text-center">Loading responses...</div>;
  if (error) return <div className="container mt-4 text-center" style={{ color: 'var(--error-color)' }}>{error}</div>;

  // Helper to find answer value for a specific question ID
  const getAnswerValue = (response, questionId) => {
    const answer = response.answers.find(a => a.questionId === questionId);
    if (!answer) return '-';
    
    // Checkboxes send an array
    if (Array.isArray(answer.value)) {
      return answer.value.join(', ');
    }
    return answer.value;
  };

  return (
    <div className="container animate-fade-in" style={{ marginTop: '2rem', paddingBottom: '4rem' }}>
      <button 
        onClick={() => navigate('/dashboard')}
        style={{ background: 'transparent', border: 'none', color: 'var(--primary-color)', fontWeight: 600, marginBottom: '1rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
      >
        &larr; Back to Dashboard
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{form.title}</h1>
          <p style={{ color: 'var(--text-muted)' }}>{responses.length} Total Responses</p>
        </div>
        <button 
          onClick={() => window.print()}
          style={{ background: 'var(--bg-color)', color: 'var(--text-main)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontWeight: 600 }}
        >
          Export / Print
        </button>
      </div>

      {responses.length === 0 ? (
        <div className="card text-center" style={{ padding: '4rem 2rem' }}>
          <h3 style={{ color: 'var(--text-muted)' }}>No responses yet.</h3>
          <p>Share your form link to start collecting data: <code>http://localhost:5173/form/{id}</code></p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--bg-color)', borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '1rem', whiteSpace: 'nowrap' }}>Timestamp</th>
                {form.questions.map(q => (
                  <th key={q.id} style={{ padding: '1rem', minWidth: '150px' }}>{q.text}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {responses.map((res, index) => (
                <tr key={res._id} style={{ borderBottom: '1px solid var(--border-color)', background: index % 2 === 0 ? 'white' : 'var(--bg-color)' }}>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                    {new Date(res.createdAt).toLocaleString()}
                  </td>
                  {form.questions.map(q => (
                    <td key={q.id} style={{ padding: '1rem' }}>
                      {getAnswerValue(res, q.id)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ResponsesDashboard;
