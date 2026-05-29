import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const FormViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await API.get(`/forms/${id}`);
        setForm(response.data);
      } catch (err) {
        setError('Form not found or is no longer accepting responses.');
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
  }, [id]);

  const handleInputChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleCheckboxChange = (questionId, option, checked) => {
    setAnswers(prev => {
      const current = prev[questionId] || [];
      if (checked) {
        return { ...prev, [questionId]: [...current, option] };
      } else {
        return { ...prev, [questionId]: current.filter(item => item !== option) };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Format answers array for the backend
    const formattedAnswers = Object.keys(answers).map(questionId => ({
      questionId,
      value: answers[questionId]
    }));

    try {
      await API.post('/responses', {
        formId: id,
        answers: formattedAnswers
      });
      setSubmitted(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit form');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="container mt-4 text-center">Loading form...</div>;
  if (error) return <div className="container mt-4 text-center" style={{ color: 'var(--error-color)' }}>{error}</div>;
  if (submitted) return (
    <div className="container mt-4 animate-fade-in" style={{ maxWidth: '600px' }}>
      <div className="card text-center" style={{ borderTop: '8px solid var(--success-color)' }}>
        <h2>Thank you!</h2>
        <p style={{ color: 'var(--text-muted)' }}>Your response has been recorded.</p>
        <button onClick={() => navigate('/')} style={{ background: 'var(--bg-color)', color: 'var(--text-main)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginTop: '1rem' }}>
          Go to Home
        </button>
      </div>
    </div>
  );

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '800px', paddingBottom: '4rem' }}>
      <div className="card" style={{ borderTop: '8px solid var(--primary-color)', marginBottom: '2rem', marginTop: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{form.title}</h1>
        {form.description && <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{form.description}</p>}
      </div>

      <form onSubmit={handleSubmit}>
        {form.questions.map((q, index) => (
          <div key={q.id} className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>
              {index + 1}. {q.text} {q.required && <span style={{ color: 'var(--error-color)' }}>*</span>}
            </h3>

            {q.type === 'short_text' && (
              <input 
                type="text" 
                required={q.required}
                onChange={e => handleInputChange(q.id, e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', outline: 'none' }}
                placeholder="Your answer"
              />
            )}

            {q.type === 'long_text' && (
              <textarea 
                required={q.required}
                rows="4"
                onChange={e => handleInputChange(q.id, e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', outline: 'none', resize: 'vertical' }}
                placeholder="Your answer"
              />
            )}

            {q.type === 'multiple_choice' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {q.options.map((opt, i) => (
                  <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name={`question_${q.id}`} 
                      required={q.required}
                      onChange={() => handleInputChange(q.id, opt)}
                      style={{ transform: 'scale(1.2)' }}
                    />
                    <span style={{ fontSize: '1.1rem' }}>{opt}</span>
                  </label>
                ))}
              </div>
            )}

            {q.type === 'checkboxes' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {q.options.map((opt, i) => (
                  <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      onChange={e => handleCheckboxChange(q.id, opt, e.target.checked)}
                      style={{ transform: 'scale(1.2)' }}
                    />
                    <span style={{ fontSize: '1.1rem' }}>{opt}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
          <button 
            type="submit" 
            disabled={submitting}
            style={{ background: 'var(--primary-color)', color: 'white', padding: '1rem 2rem', borderRadius: 'var(--radius-md)', border: 'none', fontWeight: 600, fontSize: '1.1rem', cursor: submitting ? 'not-allowed' : 'pointer' }}
          >
            {submitting ? 'Submitting...' : 'Submit Form'}
          </button>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Powered by OpenForm</span>
        </div>
      </form>
    </div>
  );
};

export default FormViewer;
