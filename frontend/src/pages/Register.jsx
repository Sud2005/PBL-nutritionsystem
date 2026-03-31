import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'USER' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data || 'Failed to register');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="title">Create Account</h2>
        <p className="subtitle">Join us and start your journey</p>
        {error && <p style={{color: 'red', textAlign: 'center', marginBottom: '10px'}}>{error}</p>}
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Full Name</label>
            <input name="name" type="text" className="form-control" required onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Email address</label>
            <input name="email" type="email" className="form-control" required onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" className="form-control" required onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select name="role" className="form-control" onChange={handleChange} value={formData.role}>
              <option value="USER">User</option>
              <option value="NUTRITIONIST">Nutritionist</option>
            </select>
          </div>
          <button type="submit" className="btn">Sign up</button>
        </form>
        <Link to="/login" className="link">Already have an account? Sign in</Link>
      </div>
    </div>
  );
};

export default Register;
