import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'casabonita2024';

export default function Admin() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [tab, setTab] = useState('material'); // 'material' | 'subcategory'

  // Form: Nueva subcategoría
  const [subName, setSubName] = useState('');
  const [subDesc, setSubDesc] = useState('');
  const [subCategoryId, setSubCategoryId] = useState('');
  const [subFile, setSubFile] = useState(null);

  // Form: Nuevo material
  const [matName, setMatName] = useState('');
  const [matType, setMatType] = useState('');
  const [matSubcategoryId, setMatSubcategoryId] = useState('');
  const [matFile, setMatFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const isAuth = sessionStorage.getItem('admin_auth');
    if (!isAuth) { navigate('/login'); return; }
    fetchAll();
  }, [navigate]);

  const fetchAll = async () => {
    const { data: cats } = await supabase.from('categories').select('*');
    const { data: subs } = await supabase.from('subcategories').select('*');
    if (cats) { setCategories(cats); if (cats.length > 0) setSubCategoryId(cats[0].id); }
    if (subs) { setSubcategories(subs); if (subs.length > 0) setMatSubcategoryId(subs[0].id); }
  };

  const uploadImage = async (file, folder) => {
    const ext = file.name.split('.').pop();
    const path = `${folder}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('catalog-images').upload(path, file);
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage.from('catalog-images').getPublicUrl(path);
    return publicUrl;
  };

  const handleAddSubcategory = async (e) => {
    e.preventDefault();
    setLoading(true); setMessage('');
    try {
      let imageUrl = null;
      if (subFile) imageUrl = await uploadImage(subFile, `subcategories/${subCategoryId}`);
      const { error } = await supabase.from('subcategories').insert([{ category_id: subCategoryId, name: subName, description: subDesc, image_url: imageUrl }]);
      if (error) throw error;
      setMessage('✅ ¡Material creado con éxito!');
      setSubName(''); setSubDesc(''); setSubFile(null);
      document.getElementById('sub-file').value = '';
      fetchAll();
    } catch (err) {
      setMessage('Error: ' + err.message);
    }
    setLoading(false);
  };

  const handleAddMaterial = async (e) => {
    e.preventDefault();
    setLoading(true); setMessage('');
    try {
      const imageUrl = await uploadImage(matFile, `materials/${matSubcategoryId}`);
      const { error } = await supabase.from('materials').insert([{ subcategory_id: matSubcategoryId, name: matName, type: matType, image_url: imageUrl }]);
      if (error) throw error;
      setMessage('✅ ¡Modelo publicado con éxito!');
      setMatName(''); setMatType(''); setMatFile(null);
      document.getElementById('mat-file').value = '';
    } catch (err) {
      setMessage('Error: ' + err.message);
    }
    setLoading(false);
  };

  const inputStyle = { width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '1rem' };
  const selectStyle = { ...inputStyle, background: '#1a1a1c' };
  const labelStyle = { display: 'block', marginBottom: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.9rem' };

  return (
    <div className="container animate-fade-in">
      <header className="app-header">
        <Link to="/" className="logo">
          <img src="/logo.png" alt="Casa Bonita GL" className="logo-img" />
        </Link>
        <button className="qr-button" onClick={() => { sessionStorage.removeItem('admin_auth'); navigate('/'); }} style={{ borderColor: '#ff6b6b', color: '#ff6b6b' }}>
          Cerrar Sesión
        </button>
      </header>

      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Panel de Control</h1>
        <p style={{ marginBottom: '2rem' }}>Administra el catálogo de Casa Bonita</p>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem' }}>
          <button
            onClick={() => { setTab('subcategory'); setMessage(''); }}
            style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', background: tab === 'subcategory' ? 'var(--accent-color)' : 'var(--card-bg)', color: tab === 'subcategory' ? '#000' : 'white', fontWeight: tab === 'subcategory' ? '600' : '400', border: '1px solid var(--card-border)' }}
          >
            + Agregar Material
          </button>
          <button
            onClick={() => { setTab('material'); setMessage(''); }}
            style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', background: tab === 'material' ? 'var(--accent-color)' : 'var(--card-bg)', color: tab === 'material' ? '#000' : 'white', fontWeight: tab === 'material' ? '600' : '400', border: '1px solid var(--card-border)' }}
          >
            + Subir Modelo/Imagen
          </button>
        </div>

        {message && (
          <div style={{ padding: '1rem', marginBottom: '1.5rem', borderRadius: '8px', background: message.includes('Error') ? 'rgba(255,0,0,0.1)' : 'rgba(0,200,100,0.1)', color: message.includes('Error') ? '#ff6b6b' : '#4ade80', fontWeight: '500' }}>
            {message}
          </div>
        )}

        {/* Tab: Nueva Subcategoría (ej. Mármol dentro de Cocinas) */}
        {tab === 'subcategory' && (
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Agregar Material a una Categoría</h2>
            <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>Ejemplo: agrega "Mármol" dentro de "Cocinas"</p>
            <form onSubmit={handleAddSubcategory} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label style={labelStyle}>Categoría (Espacio)</label>
                <select value={subCategoryId} onChange={e => setSubCategoryId(e.target.value)} style={selectStyle}>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.title}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Nombre del Material (ej. Mármol, Alambrín)</label>
                <input type="text" value={subName} onChange={e => setSubName(e.target.value)} placeholder="Ej: Mármol Blanco" required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Descripción (opcional)</label>
                <input type="text" value={subDesc} onChange={e => setSubDesc(e.target.value)} placeholder="Ej: Acabado pulido de alta gama" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Imagen de portada del material (opcional)</label>
                <input id="sub-file" type="file" accept="image/*" onChange={e => setSubFile(e.target.files[0])} style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--card-border)', borderRadius: '8px', color: 'var(--text-secondary)' }} />
              </div>
              <button type="submit" disabled={loading} style={{ padding: '1rem', borderRadius: '10px', background: 'var(--accent-color)', color: '#000', fontWeight: 'bold', fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Guardando...' : 'Crear Material'}
              </button>
            </form>
          </div>
        )}

        {/* Tab: Nuevo Modelo/Imagen */}
        {tab === 'material' && (
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Subir Modelo o Imagen de Producto</h2>
            <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>Sube fotos específicas dentro de un material (ej. Modelo A de Mármol)</p>
            <form onSubmit={handleAddMaterial} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label style={labelStyle}>Material (ej. Mármol, Alambrín)</label>
                <select value={matSubcategoryId} onChange={e => setMatSubcategoryId(e.target.value)} style={selectStyle}>
                  {subcategories.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Nombre del Modelo</label>
                <input type="text" value={matName} onChange={e => setMatName(e.target.value)} placeholder="Ej: Carrara White 60x60" required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Código o Referencia</label>
                <input type="text" value={matType} onChange={e => setMatType(e.target.value)} placeholder="Ej: CBM-001" required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Foto del modelo</label>
                <input id="mat-file" type="file" accept="image/*" onChange={e => setMatFile(e.target.files[0])} required style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--card-border)', borderRadius: '8px', color: 'var(--text-secondary)' }} />
              </div>
              <button type="submit" disabled={loading} style={{ padding: '1rem', borderRadius: '10px', background: 'var(--accent-color)', color: '#000', fontWeight: 'bold', fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Subiendo...' : 'Publicar Modelo'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
