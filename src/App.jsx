import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import CategoryView from './components/CategoryView';
import SubcategoryView from './components/SubcategoryView';
import QRCodeModal from './components/QRCodeModal';
import Login from './components/Login';
import Admin from './components/Admin';

function App() {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const currentUrl = window.location.origin;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home onOpenQR={() => setIsQRModalOpen(true)} />} />
        <Route path="/categoria/:id" element={<CategoryView onOpenQR={() => setIsQRModalOpen(true)} />} />
        <Route path="/categoria/:categoryId/:subcategoryId" element={<SubcategoryView onOpenQR={() => setIsQRModalOpen(true)} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
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
