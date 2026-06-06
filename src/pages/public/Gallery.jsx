import React, { useEffect, useState } from 'react';
import { galleryAPI } from '../../services/api';

const MEDIA = process.env.REACT_APP_MEDIA_URL || 'https://foundation-backend-private.onrender.com';
const imgUrl = u => u ? (u.startsWith('http') ? u : `${MEDIA}${u}`) : null;

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => { galleryAPI.list().then(r => setItems(r.data)).catch(() => {}).finally(() => setLoading(false)); }, []);

  return (
    <div>
      <div className="page-hero"><div className="container"><h1>Gallery</h1><p>Moments from our programs and events.</p></div></div>
      <section className="section">
        <div className="container">
          {loading ? <div className="page-loader"><div className="spinner" /></div> : items.length === 0 ? <div className="empty"><p>No images yet.</p></div> : (
            <div className="grid-4">
              {items.map(g => (
                <div key={g.id} onClick={() => setSelected(g)} style={{ cursor: 'pointer', borderRadius: 'var(--r)', overflow: 'hidden', boxShadow: 'var(--shadow)', transition: 'var(--t)' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                  <img src={imgUrl(g.image_url)} alt={g.alt_text || g.title || ''} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div style={{ maxWidth: '900px', width: '100%' }} onClick={e => e.stopPropagation()}>
            <img src={imgUrl(selected.image_url)} alt={selected.alt_text || ''} style={{ width: '100%', borderRadius: 'var(--rl)' }} />
            {selected.title && <p style={{ color: '#fff', textAlign: 'center', marginTop: '12px', fontWeight: 600 }}>{selected.title}</p>}
            <button onClick={() => setSelected(null)} style={{ display: 'block', margin: '12px auto 0', background: 'rgba(255,255,255,.2)', border: 'none', color: '#fff', padding: '8px 24px', borderRadius: '8px', cursor: 'pointer' }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
