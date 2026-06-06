import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { ArrowLeft, QrCode, Settings } from 'lucide-react';

export default function CategoryView({ onOpenQR }) {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: catData } = await supabase.from('categories').select('*').eq('id', id).single();
      const { data: subData } = await supabase.from('subcategories').select('*').eq('category_id', id);
      if (catData) setCategory(catData);
      if (subData) setSubcategories(subData);
      setLoading(false);
    }
    fetchData();
  }, [id]);

  if (loading) return <div className="container animate-fade-in"><p style={{ textAlign: 'center', marginTop: '4rem' }}>Cargando...</p></div>;

  if (!category) return (
    <div className="container animate-fade-in">
      <header className="app-header">
        <Link to="/" className="logo"><img src="/logo.png" alt="Casa Bonita GL" className="logo-img" /></Link>
      </header>
      <Link to="/" className="back-button"><ArrowLeft size={18} /> Volver al inicio</Link>
      <h1>Categoría no encontrada</h1>
    </div>
  );

  return (
    <div className="container animate-fade-in">
      <header className="app-header">
        <Link to="/" className="logo">
          <img src="/logo.png" alt="Casa Bonita GL" className="logo-img" />
        </Link>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button className="qr-button" onClick={onOpenQR}>
            <QrCode size={18} /><span>Generar QR</span>
          </button>
          <Link to="/login" className="qr-button" style={{ textDecoration: 'none' }}>
            <Settings size={18} /><span>Admin</span>
          </Link>
        </div>
      </header>

      <Link to="/" className="back-button"><ArrowLeft size={18} /> Volver a categorías</Link>

      <h1 style={{ marginBottom: '0.2rem' }}>{category.title}</h1>
      <p style={{ marginBottom: '2rem' }}>Selecciona un material para ver los modelos disponibles</p>

      {subcategories.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Aún no hay materiales en esta categoría.</p>
          <p style={{ fontSize: '0.9rem' }}>Entra al <Link to="/login" style={{ color: 'var(--accent-color)' }}>panel de administrador</Link> para agregar.</p>
        </div>
      ) : (
        <div className="grid-container" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
          {subcategories.map(sub => (
            <Link to={`/categoria/${id}/${sub.id}`} key={sub.id} className="category-card" style={{ aspectRatio: '1/1' }}>
              {sub.image_url
                ? <img src={sub.image_url} alt={sub.name} loading="lazy" />
                : <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #1a1a1c, #2a2a2c)' }} />
              }
              <div className="overlay"></div>
              <div className="category-card-content">
                <h2 style={{ color: '#fff', fontSize: '1.2rem' }}>{sub.name}</h2>
                {sub.description && <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: 0 }}>{sub.description}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
