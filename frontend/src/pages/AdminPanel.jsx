import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const AdminPanel = () => {
  const [foods, setFoods] = useState([]);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [fRes, rRes] = await Promise.all([
        api.get('/admin/food'),
        api.get('/admin/rules')
      ]);
      setFoods(fRes.data);
      setRules(rRes.data);
    } catch(err) {
      console.error(err);
      if (err.response && err.response.status === 403) {
        alert("Unauthorized. Admin access required.");
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteRule = async (id) => {
    if(!window.confirm("Delete rule?")) return;
    try {
      await api.delete(`/admin/rules/${id}`);
      fetchData();
    } catch(err) { alert("Delete failed"); }
  };

  if (loading) return <div className="container"><p>Loading Admin Panel...</p></div>;

  return (
    <div style={{padding: '40px 20px', maxWidth: '1200px', margin: '0 auto'}} className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 className="title" style={{margin: 0}}>Admin Control Panel</h2>
        <button className="btn" onClick={() => navigate('/dashboard')} style={{ width: 'auto', background: '#e3e8ee', color: '#1a1f36' }}>
          Exit Admin
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) minmax(400px, 1fr)', gap: '30px' }}>
        
        {/* Rules Section */}
        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
            <h3 style={{fontSize: '18px'}}>Dietary Rules</h3>
            <button className="btn" style={{width: 'auto', margin: 0, padding: '6px 12px', fontSize: '12px'}}>+ New Rule</button>
          </div>
          
          <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '14px'}}>
            <thead>
              <tr style={{borderBottom: '2px solid #e3e8ee', textAlign: 'left'}}>
                <th style={{padding: '10px 0', color: '#697386'}}>Condition</th>
                <th style={{padding: '10px 0', color: '#697386'}}>Action</th>
                <th style={{padding: '10px 0', color: '#697386'}}>Priority</th>
                <th style={{padding: '10px 0', color: '#697386'}}>Tools</th>
              </tr>
            </thead>
            <tbody>
              {rules.map(r => (
                <tr key={r.id} style={{borderBottom: '1px solid #e3e8ee'}}>
                  <td style={{padding: '12px 0', fontWeight: 500}}>{r.condition}</td>
                  <td style={{padding: '12px 0'}}><span style={{background: '#fef2f2', color: '#ef4444', padding: '2px 6px', borderRadius: '4px', fontSize: '12px'}}>{r.action}</span></td>
                  <td style={{padding: '12px 0'}}>{r.priority}</td>
                  <td style={{padding: '12px 0'}}>
                    <button style={{background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 600}} onClick={() => deleteRule(r.id)}>Del</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rules.length === 0 && <p style={{textAlign:'center', padding: '20px', color: '#94a3b8'}}>No dynamic rules configured.</p>}
        </div>

        {/* Food Section */}
        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
            <h3 style={{fontSize: '18px'}}>Food Database Data</h3>
          </div>
          <div style={{maxHeight: '400px', overflowY: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '14px'}}>
              <thead>
                <tr style={{borderBottom: '2px solid #e3e8ee', textAlign: 'left'}}>
                  <th style={{padding: '10px 0', color: '#697386'}}>Name</th>
                  <th style={{padding: '10px 0', color: '#697386'}}>Category</th>
                  <th style={{padding: '10px 0', color: '#697386'}}>Kcal/100g</th>
                </tr>
              </thead>
              <tbody>
                {foods.map(f => (
                  <tr key={f.id} style={{borderBottom: '1px solid #e3e8ee'}}>
                    <td style={{padding: '12px 0', fontWeight: 500}}>{f.name}</td>
                    <td style={{padding: '12px 0'}}>{f.category}</td>
                    <td style={{padding: '12px 0'}}>{f.calories100g}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminPanel;
