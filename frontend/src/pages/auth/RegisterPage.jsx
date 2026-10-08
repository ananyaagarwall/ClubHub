import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('Passwords do not match');
    setLoading(true);
    try {
      await register(form.email, form.password, form.full_name);
      navigate('/login?registered=1');
    } catch (err) {
      setError(err?.response?.data?.detail || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-fadeUp">
        <div className="auth-card__logo">
          <div className="auth-card__title">ClubHub</div>
          <div className="auth-card__subtitle">Create your student account</div>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-name">Full Name</label>
            <input id="reg-name" className="form-control" type="text" name="full_name"
              placeholder="Your name" value={form.full_name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Email</label>
            <input id="reg-email" className="form-control" type="email" name="email"
              placeholder="you@college.edu" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-pass">Password</label>
            <input id="reg-pass" className="form-control" type="password" name="password"
              placeholder="Min 8 characters" value={form.password} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-confirm">Confirm Password</label>
            <input id="reg-confirm" className="form-control" type="password" name="confirm"
              placeholder="Repeat password" value={form.confirm} onChange={handleChange} required />
          </div>
          {error && <p className="form-error">{error}</p>}
          <button id="register-submit" className="btn btn--primary" type="submit" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Create Account'}
          </button>
        </form>
        <div className="divider" />
        <p className="text-sm text-muted" style={{ textAlign: 'center' }}>
          Already have an account? <Link to="/login" className="text-brand">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
