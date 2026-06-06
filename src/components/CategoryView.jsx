import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { ArrowLeft, QrCode } from 'lucide-react';

export default function CategoryView({ onOpenQR }) {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: catData } = await supabase.from('categories').select('*').eq('id', id).single();
      const { data: matData } = await supabase.from('materials').select('*').eq('category_id', id);
      
      if (catData) setCategory(catData);
      if (matData) setMaterials(matData);
      setLoading(false);
    }
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="container animate-fade-in">
        <p style={{ textAlign: 'center', marginTop: '2rem' }}>Cargando materiales...</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container animate-fade-in">
        <header className="app-header">
          <Link to="/" className="logo">
            <img src="/logo.png" alt="Casa Bonita GL" className="logo-img" />
          </Link>
        </header>
        <h1>Categoría no encontrada</h1>
        <Link to="/" className="back-button"><ArrowLeft size={18} /> Volver al inicio</Link>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in">
      <header className="app-header">
        <Link to="/" className="logo">
          <img src="/logo.png" alt="Casa Bonita GL" className="logo-img" />
        </Link>
        <button className="qr-button" onClick={onOpenQR}>
          <QrCode size={18} />
          <span>Generar QR</span>
        </button>
      </header>

      <Link to="/" className="back-button">
        <ArrowLeft size={18} /> Volver a categorías
      </Link>

      <h1 style={{ marginBottom: '0.2rem' }}>{category.title}</h1>
      <p style={{ marginBottom: '2rem' }}>Explora los materiales disponibles</p>

      {materials.length === 0 ? (
        <p>Aún no hay materiales en esta categoría.</p>
      ) : (
        <div className="grid-container" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
          {materials.map(item => (
            <div key={item.id} className="material-card">
              <img src={item.image_url} alt={item.name} loading="lazy" />
              <div className="material-card-info">
                <div className="material-type">{item.type}</div>
                <div className="material-name">{item.name}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
