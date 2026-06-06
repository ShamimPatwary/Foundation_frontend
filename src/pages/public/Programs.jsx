import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { programsAPI } from '../../services/api';

const MEDIA = process.env.REACT_APP_MEDIA_URL || 'https://foundation-backend-private.onrender.com';
const imgUrl = u => u ? (u.startsWith('http') ? u : `${MEDIA}${u}`) : null;

export default function Programs() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    programsAPI.list({ status: 'published', limit: 50 })
      .then(r => setPrograms(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-hero">
        <div className="container"><h1>Our Programs</h1><p>Transforming lives through sustainable development initiatives.</p></div>
      </div>
      <section className="section">
        <div className="container">
          {loading ? <div className="page-loader"><div className="spinner" /></div> : programs.length === 0 ? (
            <div className="empty"><p>No programs published yet.</p></div>
          ) : (
            <div className="grid-3">
              {programs.map(p => (
                <Link to={`/programs/${p.id}`} className="card" key={p.id} style={{ display: 'block' }}>
                  {imgUrl(p.featured_image) ? <img src={imgUrl(p.featured_image)} alt={p.title} style={{ width: '100%', height: '210px', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '210px', background: 'var(--light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>🌱</div>}
                  <div style={{ padding: '20px' }}>
                    <h3 style={{ color: 'var(--navy)', fontWeight: 700, marginBottom: '8px', fontSize: '1rem' }}>{p.title}</h3>
                    <p style={{ color: 'var(--gray)', fontSize: '.85rem', lineHeight: 1.6, marginBottom: '12px' }}>{p.short_description || p.description?.substring(0, 120)}...</p>
                    {p.beneficiaries_count > 0 && <span style={{ fontSize: '.8rem', color: 'var(--teal)', fontWeight: 600 }}>👥 {p.beneficiaries_count.toLocaleString()} beneficiaries</span>}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
