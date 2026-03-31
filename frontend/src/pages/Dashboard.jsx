import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const userRes = await api.get('/dashboard');
        setUser(userRes.data);
        
        try {
          const profileRes = await api.get('/profile');
          setProfile(profileRes.data);
        } catch (err) {
          if (err.response && err.response.status === 404) {
            setProfile(null);
          }
        }
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const getGaugeColor = (cat) => {
    if (cat === 'Underweight') return 'color-underweight';
    if (cat === 'Normal') return 'color-normal';
    if (cat === 'Overweight') return 'color-overweight';
    return 'color-obese';
  };

  const getGaugeWidth = (bmi) => {
    const min = 15;
    const max = 40;
    const p = ((bmi - min) / (max - min)) * 100;
    return Math.max(0, Math.min(100, p)) + '%';
  };

  if (loading) return <div className="container"><p>Loading...</p></div>;

  return (
    <div className="container animate-fade-in">
      <div className="card" style={{maxWidth: '800px', width: '100%'}}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h2 className="title" style={{marginBottom: '5px'}}>{user ? user.message : 'Dashboard'}</h2>
            <p style={{color: '#697386', margin: 0}}>Role: <span style={{fontWeight: 600, color: 'var(--primary-color)'}}>{user?.role}</span></p>
          </div>
          <button className="btn" onClick={handleLogout} style={{ width: 'auto', background: '#e3e8ee', color: '#1a1f36' }}>
            Logout
          </button>
        </div>

        {!profile ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
            <h3 style={{marginBottom: '10px', color: '#0f172a'}}>Incomplete Health Profile</h3>
            <p style={{color: '#64748b', marginBottom: '20px'}}>Calculate your BMI, BMR, and TDEE by submitting your health data.</p>
            <button className="btn" onClick={() => navigate('/profile')} style={{width: 'auto', padding: '10px 24px'}}>Set Up Health Profile</button>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{fontSize: '20px', color: '#1a1f36'}}>Your Health Insights</h3>
              <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'flex-end'}}>
                {user?.role === 'ROLE_ADMIN' && (
                  <button className="btn" onClick={() => navigate('/admin')} style={{ width: 'auto', padding: '6px 16px', background: '#ef4444', color: '#fff', fontSize: '14px', margin: 0 }}>
                    Admin Controls
                  </button>
                )}
                {user?.role === 'ROLE_NUTRITIONIST' && (
                  <button className="btn" onClick={() => navigate('/nutritionist')} style={{ width: 'auto', padding: '6px 16px', background: '#3b82f6', color: '#fff', fontSize: '14px', margin: 0 }}>
                    Nutritionist Hub
                  </button>
                )}
                <button className="btn" onClick={() => navigate('/history')} style={{ width: 'auto', padding: '6px 16px', background: '#10b981', color: '#fff', fontSize: '14px', margin: 0 }}>
                  Plan History
                </button>
                <button className="btn" onClick={() => navigate('/diet')} style={{ width: 'auto', padding: '6px 16px', background: 'var(--primary-color)', color: '#fff', fontSize: '14px', margin: 0 }}>
                  Indian Diet Engine
                </button>
                <button className="btn" onClick={() => navigate('/profile')} style={{ width: 'auto', padding: '6px 16px', background: '#e3e8ee', color: '#1a1f36', fontSize: '14px', margin: 0 }}>
                  Update Profile
                </button>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              
              <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <p style={{color: '#64748b', fontSize: '14px', marginBottom: '5px'}}>Body Mass Index (BMI)</p>
                <div style={{display: 'flex', alignItems: 'baseline', gap: '8px'}}>
                  <span style={{fontSize: '32px', fontWeight: 700, color: '#0f172a'}}>{profile.bmi}</span>
                  <span style={{fontSize: '14px', fontWeight: 600, color: '#64748b'}}>{profile.bmiCategory}</span>
                </div>
                <div className="gauge-container">
                  <div className={`gauge-fill ${getGaugeColor(profile.bmiCategory)}`} style={{width: getGaugeWidth(profile.bmi)}}></div>
                </div>
              </div>

              <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <p style={{color: '#64748b', fontSize: '14px', marginBottom: '5px'}}>Basal Metabolic Rate</p>
                <div style={{display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '5px'}}>
                  <span style={{fontSize: '32px', fontWeight: 700, color: '#0f172a'}}>{profile.bmr}</span>
                  <span style={{fontSize: '14px', fontWeight: 600, color: '#64748b'}}>kcal / day</span>
                </div>
                <p style={{fontSize: '12px', color: '#94a3b8'}}>Calories burned at rest</p>
              </div>

              <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <p style={{color: '#64748b', fontSize: '14px', marginBottom: '5px'}}>Total Daily Energy Expediture</p>
                <div style={{display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '5px'}}>
                  <span style={{fontSize: '32px', fontWeight: 700, color: '#0f172a'}}>{profile.tdee}</span>
                  <span style={{fontSize: '14px', fontWeight: 600, color: '#64748b'}}>kcal / day</span>
                </div>
                <p style={{fontSize: '12px', color: '#94a3b8'}}>Calories burned total</p>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
