import React from 'react';
import { Link } from 'react-router-dom';
import { catalogData } from '../data/catalog';
import { QrCode } from 'lucide-react';

export default function Home({ onOpenQR }) {
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

      <div className="grid-container">
        {catalogData.map((category) => (
          <Link to={`/categoria/${category.id}`} key={category.id} className="category-card">
            <img src={category.image} alt={category.title} loading="lazy" />
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
    </div>
  );
}
