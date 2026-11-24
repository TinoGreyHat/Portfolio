import { useState } from 'react';
import { useI18n } from '../../contexts/I18nContext';
import { Shield, Lock } from 'lucide-react';
import { loginAdmin } from '../../services/apiService';

export default function AdminLogin({ onLogin }) {
  const { t } = useI18n();
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
      setError(err.message || t('admin.login.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: 'var(--bg-cyber)' }}>
      <div className="glass-panel" style={{ padding: '40px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <Shield size={48} color="var(--cyan)" style={{ marginBottom: 20 }} />
        <h2 style={{ color: 'var(--text-main)', marginBottom: 30, fontFamily: 'var(--font-mono)' }}>{t('admin.loginTitle')}</h2>

        {error && <div style={{ color: 'var(--red)', marginBottom: 20, fontSize: '0.9rem', fontFamily: 'var(--font-mono)' }}>? {error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="form-group-cyber" style={{ textAlign: 'left' }}>
            <label className="form-label-cyber">{t('admin.username')}</label>
            <input
              className="form-input-cyber"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder={t('admin.loginUsername')}
            />
          </div>

          <div className="form-group-cyber" style={{ textAlign: 'left' }}>
            <label className="form-label-cyber">{t('admin.password')}</label>
            <input
              className="form-input-cyber"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder={t('admin.loginPassword')}
            />
          </div>

          <button type="submit" className="cyber-btn" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 10 }}>
            <Lock size={16} style={{ marginRight: 8 }} />
            {loading ? t('admin.authenticating') : t('admin.loginBtn')}
          </button>
        </form>
      </div>
    </div>
  );
}