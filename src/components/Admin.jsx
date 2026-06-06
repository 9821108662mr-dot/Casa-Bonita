import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom';

export default function Admin() {
  const [session, setSession] = useState(null);
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/login');
      } else {
        setSession(session);
        fetchCategories();
      }
    });
  }, [navigate]);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*');
    if (data) {
      setCategories(data);
      if (data.length > 0) setCategoryId(data[0].id);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !name || !type || !categoryId) return;
    
    setLoading(true);
    setMessage('');
    
    // 1. Upload image
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${categoryId}/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('catalog-images')
      .upload(filePath, file);

    if (uploadError) {
      setMessage('Error al subir imagen: ' + uploadError.message);
      setLoading(false);
      return;
    }

    // 2. Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('catalog-images')
      .getPublicUrl(filePath);

    // 3. Insert into database
    const { error: insertError } = await supabase
      .from('materials')
      .insert([
        { name, type, category_id: categoryId, image_url: publicUrl }
      ]);

    if (insertError) {
      setMessage('Error al guardar: ' + insertError.message);
    } else {
      setMessage('¡Material agregado con éxito!');
      setName('');
      setType('');
      setFile(null);
      // Opcional: resetear formulario de archivo
      document.getElementById('file-upload').value = "";
    }
    setLoading(false);
  };

  if (!session) return null;

  return (
    <div className="container animate-fade-in">
      <header className="app-header">
        <Link to="/" className="logo">
          <img src="/logo.png" alt="Casa Bonita GL" className="logo-img" />
        </Link>
        <button className="qr-button" onClick={handleLogout} style={{ background: 'transparent', border: '1px solid #ff6b6b', color: '#ff6b6b' }}>
          Cerrar Sesión
        </button>
      </header>

      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '2rem' }}>Panel de Control</h1>
        
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Agregar Nuevo Material</h2>
          
          {message && (
            <div style={{ padding: '1rem', marginBottom: '1.5rem', borderRadius: '8px', background: message.includes('Error') ? 'rgba(255,0,0,0.1)' : 'rgba(0,255,0,0.1)', color: message.includes('Error') ? '#ff6b6b' : '#4ade80' }}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Categoría</label>
              <select 
                value={categoryId} 
                onChange={e => setCategoryId(e.target.value)}
                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: '#1a1a1c', color: 'white' }}
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Nombre del Material (ej. Mármol Blanco)</label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required
                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Tipo (ej. Cubierta, Piso, Muro)</label>
              <input 
                type="text" 
                value={type} 
                onChange={e => setType(e.target.value)} 
                required
                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Imagen del Material</label>
              <input 
                id="file-upload"
                type="file" 
                accept="image/*"
                onChange={e => setFile(e.target.files[0])} 
                required
                style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--card-border)', borderRadius: '8px' }}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{ marginTop: '1rem', padding: '1rem', borderRadius: '8px', background: 'var(--accent-color)', color: 'white', fontWeight: 'bold', fontSize: '1.1rem' }}
            >
              {loading ? 'Subiendo y Guardando...' : 'Publicar Material'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
