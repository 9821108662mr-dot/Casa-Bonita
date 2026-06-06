import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom';

export default function Admin() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const isAuth = sessionStorage.getItem('admin_auth');
    if (!isAuth) {
      navigate('/login');
      return;
    }
    fetchCategories();
  }, [navigate]);

  const fetchCategories = async () => {
    if (!supabase) return;
    const { data } = await supabase.from('categories').select('*');
    if (data) {
      setCategories(data);
      if (data.length > 0) setCategoryId(data[0].id);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !name || !type || !categoryId) return;
    if (!supabase) { setMessage('Error: Supabase no está configurado.'); return; }

    setLoading(true);
    setMessage('');

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${categoryId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('catalog-images')
      .upload(filePath, file);

    if (uploadError) {
      setMessage('Error al subir imagen: ' + uploadError.message);
      setLoading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('catalog-images')
      .getPublicUrl(filePath);

    const { error: insertError } = await supabase
      .from('materials')
      .insert([{ name, type, category_id: categoryId, image_url: publicUrl }]);

    if (insertError) {
      setMessage('Error al guardar: ' + insertError.message);
    } else {
      setMessage('✅ ¡Material publicado con éxito!');
      setName('');
      setType('');
      setFile(null);
      document.getElementById('file-upload').value = '';
    }
    setLoading(false);
  };

  return (
    <div className="container animate-fade-in">
      <header className="app-header">
        <Link to="/" className="logo">
          <img src="/logo.png" alt="Casa Bonita GL" className="logo-img" />
        </Link>
        <button
          className="qr-button"
          onClick={handleLogout}
          style={{ borderColor: '#ff6b6b', color: '#ff6b6b' }}
        >
          Cerrar Sesión
        </button>
      </header>

      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Panel de Control</h1>
        <p style={{ marginBottom: '2rem' }}>Agrega nuevos materiales a tu catálogo</p>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Nuevo Material</h2>

          {message && (
            <div style={{
              padding: '1rem',
              marginBottom: '1.5rem',
              borderRadius: '8px',
              background: message.includes('Error') ? 'rgba(255,0,0,0.1)' : 'rgba(0,200,100,0.1)',
              color: message.includes('Error') ? '#ff6b6b' : '#4ade80',
              fontWeight: '500'
            }}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Categoría</label>
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: '#1a1a1c', color: 'white', fontSize: '1rem' }}
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Nombre del Material</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ej: Mármol Blanco Carrara"
                required
                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '1rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Tipo</label>
              <input
                type="text"
                value={type}
                onChange={e => setType(e.target.value)}
                placeholder="Ej: Cubierta, Piso, Muro"
                required
                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '1rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Imagen del Material</label>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={e => setFile(e.target.files[0])}
                required
                style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--card-border)', borderRadius: '8px', color: 'var(--text-secondary)' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '0.5rem',
                padding: '1rem',
                borderRadius: '10px',
                background: 'var(--accent-color)',
                color: '#000',
                fontWeight: 'bold',
                fontSize: '1.05rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Subiendo imagen y guardando...' : '+ Publicar Material'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
