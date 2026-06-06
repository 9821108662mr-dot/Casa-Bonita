import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { QrCode } from 'lucide-react';

export default function Home({ onOpenQR }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      if (!supabase) {
        setLoading(false);
        return;
      }
      const { data } = await supabase.from('categories').select('*');
      if (data) setCategories(data);
      setLoading(false);
    }
    fetchCategories();
  }, []);

  if (!supabase) {
    return (
      <div className="container animate-fade-in" style={{ textAlign: 'center', marginTop: '5rem' }}>
        <h2 style={{ color: '#ff6b6b' }}>Error de Configuración</h2>
        <p>Las variables de entorno de Supabase no están configuradas.</p>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Si estás en local, reinicia el servidor. Si estás en Vercel, agrega las variables y dale a Redeploy.</p>
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

      <h1>Catálogo de Acabados</h1>
      <p>Selecciona un espacio para explorar nuestras opciones premium.</p>

      {loading ? (
        <p style={{ marginTop: '2rem', textAlign: 'center' }}>Cargando catálogo...</p>
      ) : (
        <div className="grid-container">
          {categories.map((category) => (
            <Link to={`/categoria/${category.id}`} key={category.id} className="category-card">
              <img src={category.image_url} alt={category.title} loading="lazy" />
              <div className="overlay"></div>
              <div className="category-card-content">
                <h2 style={{ color: '#fff' }}>{category.title}</h2>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', marginBottom: 0 }}>
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
