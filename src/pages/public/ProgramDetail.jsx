import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { programsAPI, galleryAPI } from '../../services/api';

const MEDIA = process.env.REACT_APP_MEDIA_URL || 'https://foundation-backend-private.onrender.com';
const imgUrl = u => u ? (u.startsWith('http') ? u : `${MEDIA}${u}`) : null;

export default function ProgramDetail() {
  const { id } = useParams();
  const [prog, setProg] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    programsAPI.get(id).then(r => {
      setProg(r.data);
      galleryAPI.list({ program_id: id }).then(g => setGallery(g.data)).catch(() => {});
    }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;
  if (!prog) return <div style={{ padding: '120px 0', textAlign: 'center' }}>Program not found.</div>;

  return (
    <div>
      <div className="page-hero">
        <div className="container"><h1>{prog.title}</h1></div>
      </div>
      <section className="section">
        <div className="container" style={{ maxWidth: '900px' }}>
          {imgUrl(prog.featured_image) && <img src={imgUrl(prog.featured_image)} alt={prog.title} style={{ width: '100%', borderRadius: 'var(--rl)', marginBottom: '32px', maxHeight: '420px', objectFit: 'cover' }} />}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
            {prog.beneficiaries_count > 0 && <span style={{ background: 'var(--off)', padding: '8px 16px', borderRadius: '8px', fontSize: '.85rem', fontWeight: 600, color: 'var(--navy)' }}>👥 {prog.beneficiaries_count.toLocaleString()} beneficiaries</span>}
            {prog.location && <span style={{ background: 'var(--off)', padding: '8px 16px', borderRadius: '8px', fontSize: '.85rem', fontWeight: 600, color: 'var(--navy)' }}>📍 {prog.location}</span>}
          </div>
          <div style={{ lineHeight: 1.85, color: 'var(--text)', fontSize: '.97rem' }} dangerouslySetInnerHTML={{ __html: prog.description?.replace(/\n/g, '<br/>') }} />
          {gallery.length > 0 && (
            <div style={{ marginTop: '40px' }}>
              <h3 style={{ color: 'var(--navy)', fontWeight: 700, marginBottom: '16px' }}>Gallery</h3>
              <div className="grid-3" style={{ gap: '12px' }}>
                {gallery.map(g => <img key={g.id} src={imgUrl(g.image_url)} alt={g.alt_text || ''} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: 'var(--r)' }} />)}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
