import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import api from '../api';

const NutritionistDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [patientDetails, setPatientDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await api.get('/nutritionist/patients');
      setPatients(res.data);
    } catch(err) {
      if (err.response && err.response.status === 403) {
        alert("Unauthorized.");
        navigate('/dashboard');
      }
    } finally { setLoading(false); }
  };

  const fetchPatientDetails = async (id) => {
    setSelectedPatientId(id);
    setLoadingDetails(true);
    try {
      const res = await api.get(`/nutritionist/patients/${id}/profile`);
      setPatientDetails(res.data);
    } catch(err) {
      alert("Failed to load patient details.");
    } finally { setLoadingDetails(false); }
  };

  if (loading) return <div className="container"><p>Loading Nutritionist Hub...</p></div>;

  return (
    <div style={{padding: '40px 20px', maxWidth: '1200px', margin: '0 auto'}} className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 className="title" style={{margin: 0}}>Nutritionist Dashboard</h2>
        <button className="btn" onClick={() => navigate('/dashboard')} style={{ width: 'auto', background: '#e3e8ee', color: '#1a1f36' }}>
          Exit Hub
        </button>
      </div>

      <div style={{ display: 'flex', gap: '30px' }}>
        
        {/* Patient Roster */}
        <div style={{ width: '300px', flexShrink: 0 }}>
          <h3 style={{fontSize: '18px', marginBottom: '16px', color: '#1a1f36'}}>Assigned Patients</h3>
          {patients.length === 0 ? (
            <div style={{background: '#fff', padding: '20px', borderRadius: '8px', color: '#64748b'}}>No patients assigned.</div>
          ) : (
            patients.map(p => (
              <div key={p.id} 
                onClick={() => fetchPatientDetails(p.id)}
                style={{
                  background: '#fff', padding: '16px', borderRadius: '12px', marginBottom: '12px',
                  cursor: 'pointer', border: selectedPatientId === p.id ? '2px solid var(--primary-color)' : '1px solid #e3e8ee',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}>
                <div style={{fontWeight: 600, fontSize: '15px'}}>{p.name}</div>
                <div style={{fontSize: '13px', color: '#697386', marginTop: '4px'}}>{p.email}</div>
              </div>
            ))
          )}
        </div>

        {/* Detail Canvas */}
        <div style={{ flex: 1 }}>
          {loadingDetails && <p>Loading demographics...</p>}
          {!loadingDetails && !patientDetails && (
            <div style={{background: '#fff', padding: '100px 20px', textAlign: 'center', borderRadius: '12px', color: '#64748b'}}>
              Select a patient to view their Health Profile & Diet Metrics.
            </div>
          )}
          {!loadingDetails && patientDetails && (
            <div className="animate-fade-in" style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
              
              {/* Top Meta Stats */}
              <div style={{display: 'flex', gap: '20px'}}>
                <div style={{flex: 1, background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'}}>
                  <h3 style={{fontSize: '14px', color: '#64748b', marginBottom: '10px'}}>Patient Profile</h3>
                  <div style={{fontSize: '24px', fontWeight: 700}}>{patientDetails.user.name}</div>
                  <div style={{fontSize: '14px', color: '#3c4257', marginTop: '10px'}}>
                    {patientDetails.healthProfile?.age}Y • {patientDetails.healthProfile?.gender} • {patientDetails.healthProfile?.weightKg}kg • {patientDetails.healthProfile?.heightCm}cm
                  </div>
                </div>
                
                <div style={{flex: 1, background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'}}>
                  <h3 style={{fontSize: '14px', color: '#64748b', marginBottom: '10px'}}>Active Plan Guidelines</h3>
                  {patientDetails.latestDietPlan ? (
                    <div>
                      <div style={{fontSize: '24px', fontWeight: 700, color: '#10b981'}}>{patientDetails.latestDietPlan.targetCalories} kcal</div>
                      <div style={{fontSize: '12px', color: '#94a3b8', marginTop: '4px'}}>Generated: {new Date(patientDetails.latestDietPlan.generatedAt).toLocaleDateString()}</div>
                    </div>
                  ) : <p>No Active Plan</p>}
                </div>
              </div>

              {/* Diet Breakdown Preview */}
              <div style={{background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'}}>
                <h3 style={{fontSize: '16px', color: '#1a1f36', marginBottom: '16px'}}>Condition & Dietary Overview</h3>
                <div style={{display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px'}}>
                  {JSON.parse(patientDetails.healthProfile?.healthConditions || '[]').map((cond, i) => (
                    <span key={i} style={{background: '#fef2f2', color: '#ef4444', padding: '4px 12px', borderRadius: '100px', fontSize: '13px', fontWeight: 600}}>! {cond}</span>
                  ))}
                  <span style={{background: '#f8fafc', border: '1px solid #e2e8f0', color: '#334155', padding: '4px 12px', borderRadius: '100px', fontSize: '13px'}}>Pref: {patientDetails.healthProfile?.dietaryPreference}</span>
                </div>
                
                {patientDetails.latestDietPlan && (
                  <div>
                    <h4 style={{fontSize: '14px', color: '#64748b', marginBottom: '8px'}}>Assigned Restricted Limits</h4>
                    <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                      {JSON.parse(patientDetails.latestDietPlan.avoidFoods || '[]').map((f, i) => (
                         <span key={i} style={{background: '#fff', border: '1px solid #ef4444', color: '#ef4444', padding: '2px 8px', borderRadius: '6px', fontSize: '12px'}}>{f.name}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default NutritionistDashboard;
