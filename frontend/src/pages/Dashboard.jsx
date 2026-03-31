import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  // DEMO MODE: Hardcoded mock data
  const user = { message: 'Welcome, Demo User!', role: 'ROLE_ADMIN' };
  const profile = {
    bmi: 24.2, bmiCategory: 'Normal', bmr: 1654, tdee: 2282,
    age: 25, gender: 'MALE', heightCm: 175, weightKg: 74,
    activityLevel: 'MODERATELY_ACTIVE', healthConditions: 'Diabetes',
    dietaryPreference: 'VEG', allergies: 'Gluten'
  };

  const getGaugeColor = (cat) => {
    if (cat === 'Underweight') return 'color-underweight';
    if (cat === 'Normal') return 'color-normal';
    if (cat === 'Overweight') return 'color-overweight';
    return 'color-obese';
  };

  const getGaugeWidth = (bmi) => {
    const p = ((bmi - 15) / 25) * 100;
    return Math.max(0, Math.min(100, p)) + '%';
  };

  return (
    <div className="container animate-fade-in">
      <div className="card" style={{maxWidth: '900px', width: '100%'}}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h2 className="title" style={{textAlign: 'left', marginBottom: '4px', fontSize: '28px'}}>{user.message}</h2>
            <p style={{color: 'var(--text-muted)', margin: 0, fontSize: '14px'}}>
              Role: <span style={{fontWeight: 600, color: 'var(--accent-purple)'}}>{user.role}</span>
            </p>
          </div>
          <button className="action-btn ghost" onClick={() => alert('Demo Mode')}>Logout</button>
        </div>

        {/* Navigation Actions */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
          <button className="action-btn red" onClick={() => navigate('/admin')}>🛡️ Admin Controls</button>
          <button className="action-btn blue" onClick={() => navigate('/nutritionist')}>🩺 Nutritionist Hub</button>
          <button className="action-btn green" onClick={() => navigate('/history')}>📊 Plan History</button>
          <button className="action-btn purple" onClick={() => navigate('/chat')}>👩‍⚕️ Ask Priya AI</button>
          <button className="action-btn dark" onClick={() => navigate('/diet')}>🥗 Diet Engine</button>
          <button className="action-btn ghost" onClick={() => navigate('/profile')}>⚙️ Update Profile</button>
        </div>

        {/* Section Label */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{fontSize: '16px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px'}}>
            Health Insights
          </h3>
        </div>

        {/* Stat Tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>

          {/* BMI */}
          <div className="stat-tile">
            <p className="stat-label">Body Mass Index</p>
            <div style={{display: 'flex', alignItems: 'baseline', gap: '8px'}}>
              <span className="stat-value">{profile.bmi}</span>
              <span style={{fontSize: '14px', fontWeight: 600, color: 'var(--accent-green)'}}>{profile.bmiCategory}</span>
            </div>
            <div className="gauge-container" style={{marginTop: '14px'}}>
              <div className={`gauge-fill ${getGaugeColor(profile.bmiCategory)}`} style={{width: getGaugeWidth(profile.bmi)}}></div>
            </div>
          </div>

          {/* BMR */}
          <div className="stat-tile">
            <p className="stat-label">Basal Metabolic Rate</p>
            <div style={{display: 'flex', alignItems: 'baseline', gap: '6px'}}>
              <span className="stat-value">{profile.bmr}</span>
              <span className="stat-unit">kcal/day</span>
            </div>
            <p className="stat-sub">Calories burned at rest</p>
          </div>

          {/* TDEE */}
          <div className="stat-tile">
            <p className="stat-label">Total Energy Expenditure</p>
            <div style={{display: 'flex', alignItems: 'baseline', gap: '6px'}}>
              <span className="stat-value">{profile.tdee}</span>
              <span className="stat-unit">kcal/day</span>
            </div>
            <p className="stat-sub">Calories burned total</p>
          </div>

        </div>

        {/* Profile Summary */}
        <div style={{ marginTop: '24px', padding: '20px', background: 'var(--glass-bg)', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
          <p style={{fontSize: '12px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px', fontWeight: 600}}>Profile Summary</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {[
              { label: 'Age', value: `${profile.age} yrs` },
              { label: 'Height', value: `${profile.heightCm} cm` },
              { label: 'Weight', value: `${profile.weightKg} kg` },
              { label: 'Activity', value: profile.activityLevel.replace('_', ' ') },
              { label: 'Diet', value: profile.dietaryPreference },
              { label: 'Conditions', value: profile.healthConditions },
              { label: 'Allergies', value: profile.allergies },
            ].map((item, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{fontSize: '11px', color: 'var(--text-dim)', display: 'block', marginBottom: '2px'}}>{item.label}</span>
                <span style={{fontSize: '13px', color: 'var(--text-color)', fontWeight: 600}}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
