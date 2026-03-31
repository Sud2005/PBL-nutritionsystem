import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{maxWidth: '420px'}}>
        {/* Logo / Header */}
        <div style={{textAlign: 'center', marginBottom: '32px'}}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px',
            background: 'linear-gradient(135deg, var(--primary-color), var(--accent-green))',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px', marginBottom: '16px',
            boxShadow: '0 4px 20px var(--primary-glow)'
          }}>🥗</div>
          <h2 className="title">Welcome Back</h2>
          <p className="subtitle">Sign in to your nutrition dashboard</p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(255, 107, 107, 0.1)', border: '1px solid rgba(255, 107, 107, 0.2)',
            borderRadius: '10px', padding: '10px 14px', marginBottom: '18px',
            color: 'var(--accent-red)', fontSize: '13px', textAlign: 'center'
          }}>{error}</div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" className="form-control" placeholder="you@example.com"
              required value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-control" placeholder="••••••••"
              required value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn" disabled={loading} style={{marginTop: '8px'}}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <Link to="/register" className="link">Don't have an account? Sign up →</Link>
      </div>
    </div>
  );
};

export default Login;
