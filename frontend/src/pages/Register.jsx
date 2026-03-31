import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'USER' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container">
      <div className="card" style={{maxWidth: '420px'}}>
        {/* Header */}
        <div style={{textAlign: 'center', marginBottom: '32px'}}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px',
            background: 'linear-gradient(135deg, var(--accent-green), var(--accent-blue))',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px', marginBottom: '16px',
            boxShadow: '0 4px 20px rgba(0, 210, 160, 0.3)'
          }}>🌿</div>
          <h2 className="title">Create Account</h2>
          <p className="subtitle">Start your personalized nutrition journey</p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(255, 107, 107, 0.1)', border: '1px solid rgba(255, 107, 107, 0.2)',
            borderRadius: '10px', padding: '10px 14px', marginBottom: '18px',
            color: 'var(--accent-red)', fontSize: '13px', textAlign: 'center'
          }}>{typeof error === 'string' ? error : JSON.stringify(error)}</div>
        )}

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Full Name</label>
            <input name="name" type="text" className="form-control" placeholder="John Doe"
              required onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input name="email" type="email" className="form-control" placeholder="you@example.com"
              required onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" className="form-control" placeholder="Min. 6 characters"
              required minLength={6} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Account Type</label>
            <select name="role" className="form-control" onChange={handleChange} value={formData.role}>
              <option value="USER">🧑 Regular User</option>
              <option value="NUTRITIONIST">🩺 Nutritionist</option>
            </select>
          </div>
          <button type="submit" className="btn" disabled={loading} style={{marginTop: '8px'}}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <Link to="/login" className="link">Already have an account? Sign in →</Link>
      </div>
    </div>
  );
};

export default Register;
