import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { eventsAPI } from '../../services/api';
import { format } from 'date-fns';

const MEDIA = process.env.REACT_APP_MEDIA_URL || 'https://foundation-backend-private.onrender.com';
const imgUrl = u => u ? (u.startsWith('http') ? u : `${MEDIA}${u}`) : null;

export default function EventDetail() {
  const { id } = useParams();
  const [ev, setEv] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { eventsAPI.get(id).then(r => setEv(r.data)).catch(() => {}).finally(() => setLoading(false)); }, [id]);

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;
  if (!ev) return <div style={{ padding: '120px 0', textAlign: 'center' }}>Event not found.</div>;

  return (
    <div>
      <div className="page-hero"><div className="container"><h1>{ev.title}</h1><p>{format(new Date(ev.start_datetime), 'MMMM dd, yyyy')}</p></div></div>
      <section className="section">
        <div className="container" style={{ maxWidth: '860px' }}>
          {imgUrl(ev.featured_image) && <img src={imgUrl(ev.featured_image)} alt={ev.title} style={{ width: '100%', borderRadius: 'var(--rl)', marginBottom: '32px', maxHeight: '420px', objectFit: 'cover' }} />}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '16px', marginBottom: '32px' }}>
            <div style={{ background: 'var(--off)', borderRadius: 'var(--r)', padding: '16px' }}><div style={{ fontSize: '.75rem', fontWeight: 700, color: 'var(--gray)', marginBottom: '4px' }}>DATE</div><div style={{ fontWeight: 700, color: 'var(--navy)' }}>{format(new Date(ev.start_datetime), 'MMM dd, yyyy')}</div></div>
            {ev.location && <div style={{ background: 'var(--off)', borderRadius: 'var(--r)', padding: '16px' }}><div style={{ fontSize: '.75rem', fontWeight: 700, color: 'var(--gray)', marginBottom: '4px' }}>LOCATION</div><div style={{ fontWeight: 700, color: 'var(--navy)' }}>{ev.location}</div></div>}
            {ev.venue && <div style={{ background: 'var(--off)', borderRadius: 'var(--r)', padding: '16px' }}><div style={{ fontSize: '.75rem', fontWeight: 700, color: 'var(--gray)', marginBottom: '4px' }}>VENUE</div><div style={{ fontWeight: 700, color: 'var(--navy)' }}>{ev.venue}</div></div>}
            <div style={{ background: 'var(--off)', borderRadius: 'var(--r)', padding: '16px' }}><div style={{ fontSize: '.75rem', fontWeight: 700, color: 'var(--gray)', marginBottom: '4px' }}>STATUS</div><span className={`badge badge-${ev.status}`}>{ev.status}</span></div>
          </div>
          <div style={{ lineHeight: 1.85, color: 'var(--text)', fontSize: '1rem' }} dangerouslySetInnerHTML={{ __html: ev.description?.replace(/\n/g, '<br/>') }} />
          {ev.registration_link && <a href={ev.registration_link} className="btn btn-primary" target="_blank" rel="noreferrer" style={{ marginTop: '28px' }}>Register Now</a>}
        </div>
      </section>
    </div>
  );
}
