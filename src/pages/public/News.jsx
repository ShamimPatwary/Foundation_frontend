import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { newsAPI } from '../../services/api';
import { format } from 'date-fns';

const MEDIA = process.env.REACT_APP_MEDIA_URL || 'https://foundation-backend-private.onrender.com';
const imgUrl = u => u ? (u.startsWith('http') ? u : `${MEDIA}${u}`) : null;

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    newsAPI.list({ status: 'published', limit: 50 })
      .then(r => setNews(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-hero"><div className="container"><h1>News & Stories</h1><p>Updates from our programs and communities.</p></div></div>
      <section className="section">
        <div className="container">
          {loading ? <div className="page-loader"><div className="spinner" /></div> : news.length === 0 ? <div className="empty"><p>No news yet.</p></div> : (
            <div className="grid-3">
              {news.map(n => (
                <Link to={`/news/${n.id}`} className="card" key={n.id} style={{ display: 'block' }}>
                  {imgUrl(n.featured_image) ? <img src={imgUrl(n.featured_image)} alt={n.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} /> : <div style={{ height: '200px', background: 'var(--light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>📰</div>}
                  <div style={{ padding: '20px' }}>
                    {n.category && <span style={{ fontSize: '.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--magenta)', marginBottom: '8px', display: 'block' }}>{n.category.name}</span>}
                    <h3 style={{ color: 'var(--navy)', fontWeight: 700, marginBottom: '8px', fontSize: '.98rem', lineHeight: 1.4 }}>{n.title}</h3>
                    <p style={{ color: 'var(--gray)', fontSize: '.85rem', lineHeight: 1.6, marginBottom: '10px' }}>{n.excerpt || n.content?.substring(0, 100)}...</p>
                    <div style={{ fontSize: '.78rem', color: 'var(--gray)' }}>{n.published_at ? format(new Date(n.published_at), 'MMM dd, yyyy') : ''}</div>
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
