import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { catalogData } from '../data/catalog';
import { ArrowLeft, QrCode } from 'lucide-react';

export default function CategoryView({ onOpenQR }) {
  const { id } = useParams();
  const category = catalogData.find(c => c.id === id);

  if (!category) {
    return (
      <div className="container animate-fade-in">
        <header className="app-header">
          <Link to="/" className="logo">Casa Bonita</Link>
        </header>
        <h1>Categoría no encontrada</h1>
        <Link to="/" className="back-button"><ArrowLeft size={18} /> Volver al inicio</Link>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in">
      <header className="app-header">
        <Link to="/" className="logo">Casa Bonita</Link>
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

      <div className="grid-container" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
        {category.items.map(item => (
          <div key={item.id} className="material-card">
            <img src={item.image} alt={item.name} loading="lazy" />
            <div className="material-card-info">
              <div className="material-type">{item.type}</div>
              <div className="material-name">{item.name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
