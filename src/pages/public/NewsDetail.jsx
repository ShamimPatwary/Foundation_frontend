import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { newsAPI } from '../../services/api';
import { format } from 'date-fns';

const MEDIA = process.env.REACT_APP_MEDIA_URL || 'https://foundation-backend-private.onrender.com';
const imgUrl = u => u ? (u.startsWith('http') ? u : `${MEDIA}${u}`) : null;

export default function NewsDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    newsAPI.get(id).then(r => setArticle(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;
  if (!article) return <div style={{ padding: '120px 0', textAlign: 'center' }}>Article not found.</div>;

  return (
    <div>
      <div className="page-hero"><div className="container"><h1>{article.title}</h1>{article.published_at && <p>{format(new Date(article.published_at), 'MMMM dd, yyyy')}</p>}</div></div>
      <section className="section">
        <div className="container" style={{ maxWidth: '860px' }}>
          {imgUrl(article.featured_image) && <img src={imgUrl(article.featured_image)} alt={article.title} style={{ width: '100%', borderRadius: 'var(--rl)', marginBottom: '32px', maxHeight: '460px', objectFit: 'cover' }} />}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
            {article.category && <span style={{ background: 'rgba(192,24,110,.1)', color: 'var(--magenta)', padding: '4px 12px', borderRadius: '20px', fontSize: '.78rem', fontWeight: 700 }}>{article.category.name}</span>}
            {article.author && <span style={{ background: 'var(--off)', color: 'var(--navy)', padding: '4px 12px', borderRadius: '20px', fontSize: '.78rem', fontWeight: 600 }}>By {article.author.name}</span>}
            {article.tags?.map(t => <span key={t.id} style={{ background: 'var(--light)', color: 'var(--gray)', padding: '4px 12px', borderRadius: '20px', fontSize: '.78rem' }}>#{t.name}</span>)}
          </div>
          <div style={{ lineHeight: 1.9, color: 'var(--text)', fontSize: '1rem' }} dangerouslySetInnerHTML={{ __html: article.content?.replace(/\n/g, '<br/>') }} />
        </div>
      </section>
    </div>
  );
}
