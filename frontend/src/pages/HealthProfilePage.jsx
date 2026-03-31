import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bluetooth, CheckCircle } from 'lucide-react';
import api from '../api';

const HealthProfilePage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: '',
    gender: 'MALE',
    heightCm: '',
    weightKg: '',
    bodyFatPercent: '',
    activityLevel: 'SEDENTARY',
    dietaryPreference: 'VEG',
    allergies: [],
    healthConditions: []
  });
  const [deviceConnecting, setDeviceConnecting] = useState(false);
  const [deviceConnected, setDeviceConnected] = useState(false);
  const navigate = useNavigate();

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMultiSelect = (field, value) => {
    let current = [...formData[field]];
    if (value === 'None') {
      current = ['None'];
    } else {
      current = current.filter(i => i !== 'None');
      if (current.includes(value)) {
        current = current.filter(i => i !== value);
      } else {
        current.push(value);
      }
    }
    setFormData({ ...formData, [field]: current });
  };

  const connectDevice = async () => {
    setDeviceConnecting(true);
    try {
      await new Promise(r => setTimeout(r, 2000));
      const res = await api.get('/device/simulate');
      setFormData({
        ...formData,
        weightKg: res.data.weightKg,
        bodyFatPercent: res.data.bodyFatPercent
      });
      setDeviceConnected(true);
    } catch (err) {
      alert("Failed to connect device");
    } finally {
      setDeviceConnecting(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        age: parseInt(formData.age, 10),
        heightCm: parseFloat(formData.heightCm),
        weightKg: parseFloat(formData.weightKg),
        bodyFatPercent: parseFloat(formData.bodyFatPercent) || 0,
        allergies: JSON.stringify(formData.allergies),
        healthConditions: JSON.stringify(formData.healthConditions)
      };
      await api.post('/profile', payload);
      navigate('/dashboard');
    } catch (err) {
      alert('Failed to save profile');
    }
  };

  return (
    <div className="container">
      <div className="card" style={{maxWidth: '500px'}}>
        <h2 className="title">Your Health Profile</h2>
        <div className="step-indicator">
          <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>Basics</div>
          <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>Device</div>
          <div className={`step ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>Habits</div>
          <div className={`step ${step >= 4 ? 'active' : ''}`}>Health</div>
        </div>

        {step === 1 && (
          <div className="animate-fade-in">
            <div className="form-group">
              <label>Age</label>
              <input type="number" name="age" className="form-control" value={formData.age} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select name="gender" className="form-control" value={formData.gender} onChange={handleChange}>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>
            <div className="form-group">
              <label>Height (cm)</label>
              <input type="number" name="heightCm" className="form-control" value={formData.heightCm} onChange={handleChange} />
            </div>
            <button className="btn" onClick={handleNext} disabled={!formData.age || !formData.heightCm}>Next Step</button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <div className="device-simulation">
              {!deviceConnected && !deviceConnecting && (
                <>
                  <Bluetooth size={48} color="#697386" style={{margin: '0 auto', marginBottom: '10px'}} />
                  <p style={{marginBottom: '16px'}}>Xiaomi Smart Scale v2</p>
                  <button className="btn" onClick={connectDevice} style={{width: 'auto', padding: '10px 24px'}}>Connect Device</button>
                  <p style={{marginTop: '16px', fontSize: '12px', color:'#697386'}}>Or enter manually below</p>
                </>
              )}
              
              {deviceConnecting && (
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                  <Bluetooth size={48} color="#3b82f6" className="animate-pulse" style={{margin: '0 auto', marginBottom: '10px'}} />
                  <p>Connecting...</p>
                </div>
              )}

              {deviceConnected && (
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#10b981'}}>
                  <CheckCircle size={48} style={{margin: '0 auto', marginBottom: '10px'}} />
                  <p style={{fontWeight: 600, fontSize: '18px'}}>Connected</p>
                  <div style={{display: 'flex', gap: '20px', marginTop: '16px', color: '#1a1f36'}}>
                    <div style={{textAlign: 'center'}}>
                      <div style={{fontSize: '24px', fontWeight: 700}}>{formData.weightKg} kg</div>
                      <div style={{fontSize: '12px', color: '#697386'}}>Weight</div>
                    </div>
                    <div style={{textAlign: 'center'}}>
                      <div style={{fontSize: '24px', fontWeight: 700}}>{formData.bodyFatPercent}%</div>
                      <div style={{fontSize: '12px', color: '#697386'}}>Body Fat</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Weight (kg)</label>
              <input type="number" name="weightKg" className="form-control" value={formData.weightKg} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Body Fat (%)</label>
              <input type="number" name="bodyFatPercent" className="form-control" value={formData.bodyFatPercent} onChange={handleChange} />
            </div>
            <div style={{display: 'flex', gap: '10px'}}>
              <button className="btn" style={{background: '#e3e8ee', color: '#1a1f36'}} onClick={handlePrev}>Back</button>
              <button className="btn" onClick={handleNext} disabled={!formData.weightKg}>Next Step</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in">
            <div className="form-group">
              <label>Activity Level</label>
              <select name="activityLevel" className="form-control" value={formData.activityLevel} onChange={handleChange}>
                <option value="SEDENTARY">Sedentary (Little to no exercise)</option>
                <option value="LIGHTLY_ACTIVE">Lightly Active (1-3 days/week)</option>
                <option value="MODERATELY_ACTIVE">Moderately Active (3-5 days/week)</option>
                <option value="VERY_ACTIVE">Very Active (6-7 days/week)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Dietary Preference</label>
              <select name="dietaryPreference" className="form-control" value={formData.dietaryPreference} onChange={handleChange}>
                <option value="VEG">Vegetarian</option>
                <option value="NON_VEG">Non-Vegetarian</option>
                <option value="JAIN">Jain</option>
                <option value="VEGAN">Vegan</option>
              </select>
            </div>
            <div className="form-group">
              <label>Allergies</label>
              <div className="checkbox-group">
                {['Dairy', 'Gluten', 'Nuts', 'Shellfish', 'Soy', 'Eggs', 'None'].map(item => (
                  <div 
                    key={item} 
                    className="checkbox-item"
                    style={{borderColor: formData.allergies.includes(item) ? 'var(--primary-color)' : ''}}
                    onClick={() => handleMultiSelect('allergies', item)}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div style={{display: 'flex', gap: '10px'}}>
              <button className="btn" style={{background: '#e3e8ee', color: '#1a1f36'}} onClick={handlePrev}>Back</button>
              <button className="btn" onClick={handleNext}>Next Step</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-fade-in">
            <div className="form-group">
              <label>Health Conditions</label>
              <div className="checkbox-group">
                {['Diabetes Type 2', 'Hypertension', 'PCOS', 'High Cholesterol', 'Thyroid', 'None'].map(item => (
                  <div 
                    key={item} 
                    className="checkbox-item"
                    style={{borderColor: formData.healthConditions.includes(item) ? 'var(--primary-color)' : ''}}
                    onClick={() => handleMultiSelect('healthConditions', item)}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div style={{display: 'flex', gap: '10px', marginTop: '24px'}}>
              <button className="btn" style={{background: '#e3e8ee', color: '#1a1f36'}} onClick={handlePrev}>Back</button>
              <button className="btn" onClick={handleSubmit}>Complete Profile</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthProfilePage;
