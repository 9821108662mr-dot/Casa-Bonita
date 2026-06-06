import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { ArrowLeft, QrCode, Settings } from 'lucide-react';

export default function SubcategoryView({ onOpenQR }) {
  const { categoryId, subcategoryId } = useParams();
  const [subcategory, setSubcategory] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const { data: subData } = await supabase.from('subcategories').select('*').eq('id', subcategoryId).single();
      const { data: matData } = await supabase.from('materials').select('*').eq('subcategory_id', subcategoryId);
      if (subData) setSubcategory(subData);
      if (matData) setMaterials(matData);
      setLoading(false);
    }
    fetchData();
  }, [subcategoryId]);

  if (loading) return <div className="container animate-fade-in"><p style={{ textAlign: 'center', marginTop: '4rem' }}>Cargando modelos...</p></div>;

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

      <Link to={`/categoria/${categoryId}`} className="back-button">
        <ArrowLeft size={18} /> Volver a materiales
      </Link>

      <h1 style={{ marginBottom: '0.2rem' }}>{subcategory?.name}</h1>
      <p style={{ marginBottom: '2rem' }}>Modelos disponibles</p>

      {materials.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Aún no hay modelos en este material.</p>
          <p style={{ fontSize: '0.9rem' }}>Entra al <Link to="/login" style={{ color: 'var(--accent-color)' }}>panel de administrador</Link> para agregar.</p>
        </div>
      ) : (
        <div className="grid-container" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
          {materials.map(item => (
            <div key={item.id} className="material-card" onClick={() => setSelected(item)} style={{ cursor: 'pointer' }}>
              <img src={item.image_url} alt={item.name} loading="lazy" />
              <div className="material-card-info">
                <div className="material-type">{item.type}</div>
                <div className="material-name">{item.name}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }} onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelected(null)} style={{ position: 'absolute', top: '-2.5rem', right: 0, zIndex: 10 }}>
              ✕
            </button>
            <img src={selected.image_url} alt={selected.name} style={{ maxWidth: '90vw', maxHeight: '85vh', borderRadius: '16px', objectFit: 'contain' }} />
            <div style={{ textAlign: 'center', marginTop: '1rem', color: 'white' }}>
              <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{selected.name}</div>
              <div style={{ color: 'var(--accent-color)', fontSize: '0.9rem' }}>{selected.type}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
