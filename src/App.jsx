import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import CategoryView from './components/CategoryView';
import QRCodeModal from './components/QRCodeModal';

function App() {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  
  // URL actual para el QR code
  const currentUrl = window.location.origin;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home onOpenQR={() => setIsQRModalOpen(true)} />} />
        <Route path="/categoria/:id" element={<CategoryView onOpenQR={() => setIsQRModalOpen(true)} />} />
      </Routes>

      <QRCodeModal 
        isOpen={isQRModalOpen} 
        onClose={() => setIsQRModalOpen(false)} 
        url={currentUrl} 
      />
    </Router>
  );
}

export default App;
