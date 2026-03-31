import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="title">Sign In</h2>
        <p className="subtitle">Welcome back to the platform</p>
        {error && <p style={{color: 'red', textAlign: 'center', marginBottom: '10px'}}>{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email address</label>
            <input type="email" className="form-control" required value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-control" required value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn">Sign in</button>
        </form>
        <Link to="/register" className="link">Don't have an account? Sign up</Link>
      </div>
    </div>
  );
};

export default Login;
