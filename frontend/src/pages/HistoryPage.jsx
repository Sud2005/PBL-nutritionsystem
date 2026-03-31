import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const HistoryPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [comparePlanId, setComparePlanId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/plans/history');
      setPlans(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectedPlan = plans.find(p => p.id === selectedPlanId);
  const comparePlan = plans.find(p => p.id === comparePlanId);

  const renderDiff = () => {
    if (!selectedPlan || !comparePlan) return <p>Select two plans to compare.</p>;
    
    const getFoods = (planStr) => {
      try { return JSON.parse(planStr).map(f => f.name); } catch(e) { return []; }
    };

    const sRec = getFoods(selectedPlan.recommendedFoods);
    const cRec = getFoods(comparePlan.recommendedFoods);

    const added = sRec.filter(x => !cRec.includes(x));
    const removed = cRec.filter(x => !sRec.includes(x));
    const kept = sRec.filter(x => cRec.includes(x));

    return (
      <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <h3 style={{marginBottom: '16px'}}>Changes between {new Date(comparePlan.generatedAt).toLocaleDateString()} and {new Date(selectedPlan.generatedAt).toLocaleDateString()}</h3>
        
        <div style={{display: 'flex', gap: '20px', marginBottom: '20px'}}>
          <div style={{flex: 1, padding: '12px', background: '#ecfdf5', borderRadius: '8px', border: '1px solid #10b981'}}>
            <h4 style={{color: '#047857'}}>Added Items</h4>
            {added.length > 0 ? added.map(i => <div key={i}>+ {i}</div>) : 'None'}
          </div>
          <div style={{flex: 1, padding: '12px', background: '#fef2f2', borderRadius: '8px', border: '1px solid #ef4444'}}>
            <h4 style={{color: '#b91c1c'}}>Removed Items</h4>
            {removed.length > 0 ? removed.map(i => <div key={i}>- {i}</div>) : 'None'}
          </div>
        </div>

        <div>
          <h4>Calorie Shift</h4>
          <p>
            {comparePlan.targetCalories} kcal 
            <span style={{margin: '0 10px'}}>→</span>
            {selectedPlan.targetCalories} kcal
            <span style={{marginLeft: '10px', color: selectedPlan.targetCalories > comparePlan.targetCalories ? '#ef4444' : '#10b981'}}>
              ({selectedPlan.targetCalories - comparePlan.targetCalories > 0 ? '+' : ''}{selectedPlan.targetCalories - comparePlan.targetCalories} kcal)
            </span>
          </p>
        </div>
      </div>
    );
  };

  if (loading) return <div className="container"><p>Loading history...</p></div>;

  return (
    <div style={{padding: '40px 20px', maxWidth: '1000px', margin: '0 auto'}} className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 className="title" style={{margin: 0}}>Diet Plan History</h2>
        <button className="btn" onClick={() => navigate('/dashboard')} style={{ width: 'auto', background: '#e3e8ee', color: '#1a1f36' }}>
          Back to Dashboard
        </button>
      </div>

      <div style={{display: 'flex', gap: '30px'}}>
        {/* Timeline */}
        <div style={{flex: '1', maxWidth: '350px'}}>
          <h3 style={{fontSize: '18px', marginBottom: '20px'}}>Your Timeline</h3>
          {plans.map((p, idx) => (
            <div key={p.id} 
              onClick={() => {
                if (selectedPlanId === p.id) setSelectedPlanId(null);
                else {
                  if (selectedPlanId && !comparePlanId) setComparePlanId(p.id);
                  else setSelectedPlanId(p.id);
                }
              }}
              style={{
              padding: '16px', 
              background: '#fff', 
              borderRadius: '8px',
              borderLeft: selectedPlanId === p.id ? '4px solid #10b981' : comparePlanId === p.id ? '4px solid #3b82f6' : '4px solid #e3e8ee',
              marginBottom: '10px',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}>
              <div style={{fontWeight: 600}}>{new Date(p.generatedAt).toLocaleDateString()}</div>
              <div style={{fontSize: '14px', color: '#697386'}}>{p.targetCalories} kcal Target</div>
            </div>
          ))}
        </div>

        {/* Detail/Diff Area */}
        <div style={{flex: '2'}}>
          {!selectedPlanId && !comparePlanId && (
            <div style={{textAlign: 'center', padding: '60px', color: '#697386', background: '#fff', borderRadius: '12px'}}>
              Select a plan from the timeline to view details, or select two plans to view a Diff.
            </div>
          )}

          {selectedPlanId && !comparePlanId && (
            <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <h3 style={{marginBottom: '20px'}}>Plan from {new Date(selectedPlan.generatedAt).toLocaleDateString()}</h3>
              <p><strong>Target Calories:</strong> {selectedPlan.targetCalories} kcal</p>
              <h4 style={{marginTop: '20px', marginBottom: '10px'}}>Recommended Foods</h4>
              <div className="checkbox-group">
                {JSON.parse(selectedPlan.recommendedFoods || '[]').map((f, i) => (
                  <span key={i} className="checkbox-item" style={{background: '#ecfdf5', borderColor: '#10b981'}}>{f.name}</span>
                ))}
              </div>
            </div>
          )}

          {selectedPlanId && comparePlanId && renderDiff()}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
