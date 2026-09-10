import { useState } from 'react';
import { Shield, Lock } from 'lucide-react';
import { loginAdmin } from '../../services/apiService';

export default function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await loginAdmin(username, password);
      onLogin();
    } catch (err) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark)' }}>
      <div className="glass-panel" style={{ padding: '40px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <Shield size={48} color="var(--cyan)" style={{ marginBottom: 20 }} />
        <h2 style={{ color: 'var(--text-light)', marginBottom: 30, fontFamily: 'var(--font-mono)' }}>SECURE ACCESS</h2>
        
        {error && <div style={{ color: 'var(--red)', marginBottom: 20, fontSize: '0.9rem', fontFamily: 'var(--font-mono)' }}>? {error}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="form-group-cyber" style={{ textAlign: 'left' }}>
            <label className="form-label-cyber">Username</label>
            <input 
              className="form-input-cyber" 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          
          <div className="form-group-cyber" style={{ textAlign: 'left' }}>
            <label className="form-label-cyber">Password</label>
            <input 
              className="form-input-cyber" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          
          <button type="submit" className="cyber-btn" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 10 }}>
            <Lock size={16} style={{ marginRight: 8 }} />
            {loading ? 'AUTHENTICATING...' : 'LOGIN'}
          </button>
        </form>
      </div>
    </div>
  );
}
