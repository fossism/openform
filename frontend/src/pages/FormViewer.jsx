import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const FormViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // -1 means the "Welcome/Intro" screen. 
  // 0 to form.questions.length-1 are the actual questions.
  const [currentIndex, setCurrentIndex] = useState(-1); 
  
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

  // Handle keyboard navigation (Enter to go next)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        // Prevent default to avoid line breaks in textareas when pressing enter to submit
        if (e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          handleNext();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, form, answers]);

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

  const isCurrentQuestionAnswered = () => {
    if (currentIndex === -1) return true;
    const q = form.questions[currentIndex];
    if (!q.required) return true;
    
    const ans = answers[q.id];
    if (q.type === 'checkboxes') return ans && ans.length > 0;
    return ans !== undefined && ans.trim && ans.trim() !== '';
  };

  const handleNext = () => {
    if (currentIndex === -1) {
      setCurrentIndex(0);
      return;
    }
    
    if (!isCurrentQuestionAnswered()) {
      alert("Please answer this required question before proceeding.");
      return;
    }

    if (currentIndex < form.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > -1) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
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

  if (loading) return <div className="container mt-4 text-center">Loading...</div>;
  if (error) return <div className="container mt-4 text-center" style={{ color: 'var(--error-color)' }}>{error}</div>;

  if (submitted) return (
    <div className="container animate-fade-in" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card text-center slide-up" style={{ width: '100%', maxWidth: '600px' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Done!</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>Your response has been securely recorded.</p>
        <button 
          onClick={() => navigate('/')} 
          style={{ background: 'var(--primary-color)', color: 'white', padding: '1rem 2rem', borderRadius: 'var(--radius-lg)', border: 'none', fontSize: '1.1rem', fontWeight: 600 }}
        >
          Create your own OpenForm
        </button>
      </div>
    </div>
  );

  // Progress Bar calculation
  const progress = currentIndex === -1 ? 0 : Math.round(((currentIndex) / form.questions.length) * 100);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Progress Bar */}
      <div style={{ width: '100%', height: '6px', background: 'rgba(255,102,0,0.1)', position: 'fixed', top: 0, left: 0, zIndex: 1000 }}>
        <div style={{ height: '100%', background: 'var(--primary-color)', width: `${progress}%`, transition: 'width 0.4s ease' }}></div>
      </div>

      <div className="container" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        
        {/* Intro Screen */}
        {currentIndex === -1 && (
          <div className="slide-up text-center" style={{ maxWidth: '800px' }}>
            <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', lineHeight: 1.1 }}>{form.title}</h1>
            {form.description && <p style={{ fontSize: '1.5rem', color: 'var(--text-muted)', marginBottom: '3rem' }}>{form.description}</p>}
            <button 
              onClick={handleNext}
              style={{ background: 'var(--primary-color)', color: 'white', padding: '1.25rem 3rem', borderRadius: 'var(--radius-lg)', border: 'none', fontSize: '1.25rem', fontWeight: 700, boxShadow: 'var(--shadow-md)' }}
            >
              Start &rarr;
            </button>
            <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Press Enter</p>
          </div>
        )}

        {/* Question Screens */}
        {currentIndex >= 0 && currentIndex < form.questions.length && (
          <div key={currentIndex} className="slide-up" style={{ width: '100%', maxWidth: '800px' }}>
            {(() => {
              const q = form.questions[currentIndex];
              return (
                <div>
                  <div style={{ color: 'var(--primary-color)', fontWeight: 700, marginBottom: '1rem', letterSpacing: '0.1em' }}>
                    {currentIndex + 1} OF {form.questions.length}
                  </div>
                  <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--text-main)' }}>
                    {q.text} {q.required && <span style={{ color: 'var(--error-color)' }}>*</span>}
                  </h2>

                  {/* Input Rendering based on type */}
                  <div style={{ fontSize: '1.5rem' }}>
                    {q.type === 'short_text' && (
                      <input 
                        type="text" 
                        autoFocus
                        value={answers[q.id] || ''}
                        onChange={e => handleInputChange(q.id, e.target.value)}
                        placeholder="Type your answer here..."
                        style={{ width: '100%', padding: '1rem 0', border: 'none', borderBottom: '2px solid var(--primary-color)', background: 'transparent', fontSize: '2rem', outline: 'none', color: 'var(--text-main)' }}
                      />
                    )}

                    {q.type === 'long_text' && (
                      <textarea 
                        autoFocus
                        rows="4"
                        value={answers[q.id] || ''}
                        onChange={e => handleInputChange(q.id, e.target.value)}
                        placeholder="Type your answer here..."
                        style={{ width: '100%', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '2px solid rgba(255,102,0,0.3)', background: 'rgba(255,255,255,0.6)', fontSize: '1.5rem', outline: 'none', resize: 'vertical' }}
                      />
                    )}

                    {(q.type === 'multiple_choice' || q.type === 'checkboxes') && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {q.options.map((opt, i) => {
                          const isChecked = q.type === 'multiple_choice' 
                            ? answers[q.id] === opt 
                            : (answers[q.id] || []).includes(opt);
                            
                          return (
                            <label 
                              key={i} 
                              style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '1rem', 
                                cursor: 'pointer',
                                padding: '1rem 1.5rem',
                                borderRadius: 'var(--radius-md)',
                                border: `2px solid ${isChecked ? 'var(--primary-color)' : 'rgba(255,102,0,0.2)'}`,
                                background: isChecked ? 'rgba(255,102,0,0.1)' : 'rgba(255,255,255,0.5)',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <input 
                                type={q.type === 'multiple_choice' ? 'radio' : 'checkbox'} 
                                name={`q_${q.id}`}
                                checked={isChecked}
                                onChange={(e) => {
                                  if (q.type === 'multiple_choice') {
                                    handleInputChange(q.id, opt);
                                    // Auto-advance for multiple choice
                                    setTimeout(() => handleNext(), 300);
                                  } else {
                                    handleCheckboxChange(q.id, opt, e.target.checked);
                                  }
                                }}
                                style={{ transform: 'scale(1.5)', accentColor: 'var(--primary-color)' }}
                              />
                              <span>{opt}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Navigation Footer */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '3rem' }}>
                    <button 
                      onClick={handleNext}
                      style={{ background: 'var(--primary-color)', color: 'white', padding: '1rem 2rem', borderRadius: 'var(--radius-lg)', border: 'none', fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: 'var(--shadow-md)' }}
                    >
                      {currentIndex === form.questions.length - 1 ? 'Submit' : 'OK'} &rarr;
                    </button>
                    {currentIndex === form.questions.length - 1 && (
                      <span style={{ color: 'var(--text-muted)' }}>Press Enter to Submit</span>
                    )}
                    {currentIndex < form.questions.length - 1 && (
                      <span style={{ color: 'var(--text-muted)' }}>Press Enter</span>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Floating navigation controls */}
      {currentIndex >= 0 && (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={handlePrevious} 
            disabled={currentIndex === -1}
            style={{ padding: '0.75rem 1rem', background: 'var(--surface-solid)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)', fontWeight: 600 }}
          >
            &uarr; Previous
          </button>
          <button 
            onClick={handleNext}
            style={{ padding: '0.75rem 1rem', background: 'var(--surface-solid)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)', fontWeight: 600 }}
          >
            Next &darr;
          </button>
        </div>
      )}
    </div>
  );
};

export default FormViewer;
