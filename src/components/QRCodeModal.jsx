import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X } from 'lucide-react';

export default function QRCodeModal({ isOpen, onClose, url }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose}>
          <X size={24} />
        </button>
        <h2>Escanea este código</h2>
        <p>Para ver el catálogo en tu dispositivo móvil</p>
        
        <div className="qr-container">
          <QRCodeSVG 
            value={url} 
            size={200}
            bgColor={"#ffffff"}
            fgColor={"#000000"}
            level={"H"}
            includeMargin={false}
          />
        </div>
        
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          {url}
        </p>
      </div>
    </div>
  );
}
