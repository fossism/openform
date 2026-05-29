import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Trash2, Save } from 'lucide-react';
import API from '../api/axios';

const FormBuilder = () => {
  const [title, setTitle] = useState('Untitled Form');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const addQuestion = (type) => {
    const newQuestion = {
      id: crypto.randomUUID(),
      type: type,
      text: '',
      options: type === 'multiple_choice' || type === 'checkboxes' || type === 'dropdown' ? ['Option 1'] : [],
      required: false
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id, field, value) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const updateOption = (questionId, optionIndex, value) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newOptions = [...q.options];
        newOptions[optionIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const addOption = (questionId) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return { ...q, options: [...q.options, `Option ${q.options.length + 1}`] };
      }
      return q;
    }));
  };

  const removeOption = (questionId, optionIndex) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return { ...q, options: q.options.filter((_, i) => i !== optionIndex) };
      }
      return q;
    }));
  };

  const removeQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const saveForm = async () => {
    if (!title.trim() || questions.length === 0) {
      alert("Please provide a title and at least one question.");
      return;
    }

    // Basic validation
    const invalidQuestions = questions.filter(q => !q.text.trim());
    if (invalidQuestions.length > 0) {
      alert("All questions must have a title.");
      return;
    }

    setLoading(true);
    try {
      const payload = { title, description, questions };
      await API.post('/forms', payload);
      alert('Form created successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to save form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '800px', paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', marginTop: '1rem' }}>
        <h2>Form Builder</h2>
        <button 
          onClick={saveForm}
          disabled={loading}
          style={{ background: 'var(--success-color)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', border: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Save size={18} /> {loading ? 'Saving...' : 'Save Form'}
        </button>
      </div>

      {/* Form Header Card */}
      <div className="card" style={{ borderTop: '8px solid var(--primary-color)', marginBottom: '2rem' }}>
        <input 
          type="text" 
          value={title} 
          onChange={e => setTitle(e.target.value)}
          placeholder="Form Title"
          style={{ width: '100%', fontSize: '2rem', border: 'none', borderBottom: '1px solid var(--border-color)', marginBottom: '1rem', paddingBottom: '0.5rem', outline: 'none', fontWeight: 'bold' }}
        />
        <input 
          type="text" 
          value={description} 
          onChange={e => setDescription(e.target.value)}
          placeholder="Form Description (Optional)"
          style={{ width: '100%', fontSize: '1rem', border: 'none', outline: 'none', color: 'var(--text-muted)' }}
        />
      </div>

      {/* Questions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {questions.map((q, index) => (
          <div key={q.id} className="card" style={{ position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <input 
                type="text" 
                value={q.text} 
                onChange={e => updateQuestion(q.id, 'text', e.target.value)}
                placeholder={`Question ${index + 1}`}
                style={{ width: '60%', padding: '0.5rem', fontSize: '1.1rem', border: 'none', borderBottom: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-color)' }}
              />
              <select 
                value={q.type} 
                onChange={e => updateQuestion(q.id, 'type', e.target.value)}
                style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
              >
                <option value="short_text">Short Text</option>
                <option value="long_text">Paragraph</option>
                <option value="multiple_choice">Multiple Choice</option>
                <option value="checkboxes">Checkboxes</option>
              </select>
            </div>

            {/* Options Rendering */}
            <div style={{ paddingLeft: '1rem', marginTop: '1rem' }}>
              {(q.type === 'short_text' || q.type === 'long_text') && (
                <div style={{ color: 'var(--text-muted)', padding: '0.5rem 0', borderBottom: '1px dotted var(--border-color)', width: '50%' }}>
                  {q.type === 'short_text' ? 'Short answer text' : 'Long answer text'}
                </div>
              )}

              {(q.type === 'multiple_choice' || q.type === 'checkboxes') && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {q.options.map((opt, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{q.type === 'multiple_choice' ? '○' : '□'}</span>
                      <input 
                        type="text" 
                        value={opt} 
                        onChange={e => updateOption(q.id, i, e.target.value)}
                        style={{ border: 'none', borderBottom: '1px solid var(--border-color)', outline: 'none', padding: '0.25rem' }}
                      />
                      {q.options.length > 1 && (
                        <button onClick={() => removeOption(q.id, i)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}>&times;</button>
                      )}
                    </div>
                  ))}
                  <button onClick={() => addOption(q.id)} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: 'var(--primary-color)', marginTop: '0.5rem' }}>
                    + Add Option
                  </button>
                </div>
              )}
            </div>

            {/* Question Footer Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem', marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                <input 
                  type="checkbox" 
                  checked={q.required} 
                  onChange={e => updateQuestion(q.id, 'required', e.target.checked)}
                />
                Required
              </label>
              <button onClick={() => removeQuestion(q.id)} style={{ background: 'none', border: 'none', color: 'var(--error-color)', display: 'flex', alignItems: 'center' }}>
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Add Menu */}
      <div className="card" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <span style={{ fontWeight: 600, alignSelf: 'center' }}>Add Question:</span>
        <button onClick={() => addQuestion('short_text')} style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary-color)', background: 'transparent', color: 'var(--primary-color)' }}>Short Text</button>
        <button onClick={() => addQuestion('multiple_choice')} style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary-color)', background: 'transparent', color: 'var(--primary-color)' }}>Multiple Choice</button>
        <button onClick={() => addQuestion('checkboxes')} style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary-color)', background: 'transparent', color: 'var(--primary-color)' }}>Checkboxes</button>
      </div>
    </div>
  );
};

export default FormBuilder;
