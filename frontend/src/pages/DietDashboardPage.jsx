import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import api from '../api';

const DietDashboardPage = () => {
  const [profile, setProfile] = useState(null);
  const [dietPlan, setDietPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [weightLogs, setWeightLogs] = useState([]);
  const [newWeight, setNewWeight] = useState('');
  const [generating, setGenerating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const pRes = await api.get('/profile');
      setProfile(pRes.data);
      
      try {
        const dRes = await api.get('/diet/latest');
        setDietPlan(dRes.data);
      } catch (err) {}
      
      try {
        const wRes = await api.get('/weight-log');
        setWeightLogs(wRes.data.reverse()); // chronological order for chart
      } catch (err) {}
      
    } catch (err) {
      if (err.response && err.response.status === 404) {
        navigate('/profile'); // force profile creation
      }
    } finally {
      setLoading(false);
    }
  };

  const generatePlan = async () => {
    setGenerating(true);
    try {
      const res = await api.post('/diet/generate');
      setDietPlan(res.data);
    } catch (err) {
      alert("Failed to generate plan");
    } finally {
      setGenerating(false);
    }
  };

  const logWeight = async () => {
    if (!newWeight) return;
    try {
      await api.post('/weight-log', { weightKg: parseFloat(newWeight) });
      setNewWeight('');
      fetchData(); // refresh
    } catch (err) {
      alert("Failed to log weight");
    }
  };

  if (loading) return <div className="container"><p>Loading...</p></div>;

  const chartColors = ['#10b981', '#e3e8ee']; 
  const macroColors = ['#3b82f6', '#f59e0b', '#ef4444'];

  const renderFoodCards = (foodsJson, borderColor) => {
    try {
      const foods = JSON.parse(foodsJson);
      return foods.map((f, i) => (
        <div key={i} style={{
          padding: '12px', background: '#fff', borderLeft: `4px solid ${borderColor}`,
          borderRadius: '6px', marginBottom: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
          fontSize: '14px'
        }}>
          <div style={{fontWeight: 600, color: '#1a1f36'}}>{f.name}</div>
          <div style={{fontSize: '12px', color: '#697386'}}>{f.category} • {f.calories100g} kcal/100g</div>
        </div>
      ));
    } catch (e) {
      return <p>Error loading</p>;
    }
  };

  const renderMeals = () => {
    if (!dietPlan || !dietPlan.mealBreakdown) return null;
    try {
      const meals = JSON.parse(dietPlan.mealBreakdown);
      return ['Breakfast', 'Lunch', 'Snacks', 'Dinner'].map(mealName => {
        const items = meals[mealName] || [];
        const totalCal = items.reduce((sum, i) => sum + i.calories, 0);
        return (
          <div key={mealName} style={{marginBottom: '20px', background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0'}}>
            <h4 style={{marginBottom: '12px', color: '#0f172a', display: 'flex', justifyContent: 'space-between'}}>
              {mealName} <span>{totalCal} kcal</span>
            </h4>
            {items.map((item, idx) => (
              <div key={idx} style={{display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: idx < items.length - 1 ? '1px solid #e3e8ee' : 'none', fontSize: '14px'}}>
                <div>
                  <span style={{fontWeight: 500, color: '#1a1f36'}}>{item.name}</span>
                  <span style={{color: '#697386', marginLeft: '8px'}}>{item.portionGrams}g</span>
                </div>
                <div style={{color: '#3c4257'}}>{item.calories} kcal</div>
              </div>
            ))}
          </div>
        );
      });
    } catch (e) { return null; }
  };

  return (
    <div style={{padding: '40px 20px', maxWidth: '1200px', margin: '0 auto'}} className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 className="title" style={{margin: 0}}>Indian Diet Engine</h2>
        <button className="btn" onClick={() => navigate('/dashboard')} style={{ width: 'auto', background: '#e3e8ee', color: '#1a1f36' }}>
          Back to Dashboard
        </button>
      </div>

      {!dietPlan ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <h3 style={{marginBottom: '10px'}}>Ready to generate your plan?</h3>
          <p style={{color: '#64748b', marginBottom: '24px'}}>Our rule engine will customize an Indian diet matching your Phase 2 health profile.</p>
          <button className="btn" style={{width: 'auto', padding: '12px 32px'}} onClick={generatePlan} disabled={generating}>
            {generating ? 'Engine Running...' : 'Generate New Plan'}
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          
          {/* Calorie & Weight Tracker Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <h3 style={{fontSize: '16px', marginBottom: '16px', color: '#1a1f36'}}>Daily Target</h3>
              <div style={{height: '200px', position: 'relative'}}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={[{value: dietPlan.targetCalories}, {value: profile.tdee > dietPlan.targetCalories ? profile.tdee - dietPlan.targetCalories : 0}]} 
                         cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value" stroke="none">
                      <Cell fill={chartColors[0]} />
                      <Cell fill={chartColors[1]} />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center'}}>
                  <div style={{fontSize: '24px', fontWeight: 700, color: '#10b981'}}>{Math.round(dietPlan.targetCalories)}</div>
                  <div style={{fontSize: '12px', color: '#697386'}}>kcal / day</div>
                </div>
              </div>
              <p style={{textAlign: 'center', fontSize: '13px', color: '#64748b', marginTop: '10px'}}>
                Adjusted automatically based on BMI and Weight Logs.
              </p>
            </div>

            <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <h3 style={{fontSize: '16px', marginBottom: '16px', color: '#1a1f36'}}>Weekly Weight Adaptation</h3>
              <div style={{display: 'flex', gap: '10px', marginBottom: '20px'}}>
                <input type="number" className="form-control" placeholder="Today's Weight (kg)" value={newWeight} onChange={e => setNewWeight(e.target.value)} />
                <button className="btn" style={{margin: 0, width: 'auto'}} onClick={logWeight}>Log</button>
              </div>
              <div style={{height: '150px'}}>
                {weightLogs.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weightLogs}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="loggedAt" tickFormatter={(v) => new Date(v).getDate()} fontSize={12} />
                      <YAxis domain={['dataMin - 2', 'dataMax + 2']} fontSize={12} />
                      <Tooltip />
                      <Line type="monotone" dataKey="weightKg" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '13px'}}>No data yet</div>
                )}
              </div>
            </div>
            
            <button className="btn" style={{background: '#f8fafc', color: '#1a1f36', border: '1px dashed #cbd5e1'}} onClick={generatePlan}>
              Recalculate Plan
            </button>
          </div>

          {/* Classification Column */}
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h3 style={{fontSize: '16px', marginBottom: '16px', color: '#1a1f36'}}>Food Classification</h3>
            
            <h4 style={{fontSize: '14px', color: '#10b981', marginBottom: '10px'}}>Recommended</h4>
            <div style={{marginBottom: '20px', maxHeight: '180px', overflowY: 'auto'}} className="scroll-area">
              {renderFoodCards(dietPlan.recommendedFoods, '#10b981')}
            </div>

            <h4 style={{fontSize: '14px', color: '#f59e0b', marginBottom: '10px'}}>Limited (Portion Control)</h4>
            <div style={{marginBottom: '20px', maxHeight: '120px', overflowY: 'auto'}} className="scroll-area">
              {renderFoodCards(dietPlan.limitedFoods, '#f59e0b')}
            </div>

            <h4 style={{fontSize: '14px', color: '#ef4444', marginBottom: '10px'}}>Avoid</h4>
            <div style={{maxHeight: '120px', overflowY: 'auto'}} className="scroll-area">
              {renderFoodCards(dietPlan.avoidFoods, '#ef4444')}
            </div>
          </div>

          {/* Meals Column */}
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h3 style={{fontSize: '16px', marginBottom: '16px', color: '#1a1f36'}}>Generated Meal Plan</h3>
            <div style={{maxHeight: '600px', overflowY: 'auto'}} className="scroll-area">
              {renderMeals()}
            </div>
          </div>

        </div>
      )}
      <style>{`
        .scroll-area::-webkit-scrollbar { width: 6px; }
        .scroll-area::-webkit-scrollbar-track { background: #f1f5f9; }
        .scroll-area::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
      `}</style>
    </div>
  );
};

export default DietDashboardPage;
