import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.detail || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-fadeUp">
        <div className="auth-card__logo">
          <div className="auth-card__title">ClubHub</div>
          <div className="auth-card__subtitle">Sign in to your account</div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email</label>
            <input
              id="login-email"
              className="form-control"
              type="email"
              name="email"
              placeholder="you@college.edu"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              className="form-control"
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          {error && <p className="form-error">{error}</p>}
          <button id="login-submit" className="btn btn--primary" type="submit" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Sign In'}
          </button>
        </form>

        <div className="divider" />
        <p className="text-sm text-muted" style={{ textAlign: 'center' }}>
          Don't have an account?{' '}
          <Link to="/register" className="text-brand">Register</Link>
        </p>

        <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(108,99,255,0.1)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(108,99,255,0.2)' }}>
          <p className="text-xs text-muted">🔧 Dev credentials</p>
          <p className="text-xs" style={{ color: 'var(--color-brand-primary)', marginTop: '0.25rem' }}>
            admin@clubhub.dev / admin1234
          </p>
        </div>
      </div>
    </div>
  );
}
