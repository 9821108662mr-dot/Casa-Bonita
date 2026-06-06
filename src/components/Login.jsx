import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'casabonita2024';

export default function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', 'true');
      navigate('/admin');
    } else {
      setError('Contraseña incorrecta. Intenta de nuevo.');
    }
    setLoading(false);
  };

  return (
    <div className="container animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="glass-panel" style={{ padding: '2.5rem', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <img src="/logo.png" alt="Casa Bonita GL" style={{ height: '80px', marginBottom: '1.5rem' }} />
        <h2 style={{ marginBottom: '0.5rem' }}>Panel de Administrador</h2>
        <p style={{ marginBottom: '2rem', fontSize: '0.9rem' }}>Ingresa la contraseña para continuar</p>

        {error && (
          <p style={{ color: '#ff6b6b', marginBottom: '1rem', fontSize: '0.9rem', background: 'rgba(255,107,107,0.1)', padding: '0.8rem', borderRadius: '8px' }}>
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoFocus
            style={{
              width: '100%',
              padding: '0.9rem',
              borderRadius: '10px',
              border: '1px solid var(--card-border)',
              background: 'rgba(255,255,255,0.05)',
              color: 'white',
              fontSize: '1rem',
              textAlign: 'center',
              letterSpacing: '0.2em'
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.9rem',
              borderRadius: '10px',
              background: 'var(--accent-color)',
              color: '#000',
              fontWeight: 'bold',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            {loading ? 'Verificando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
