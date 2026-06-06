import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { eventsAPI } from '../../services/api';
import { format } from 'date-fns';

const MEDIA = process.env.REACT_APP_MEDIA_URL || 'https://foundation-backend-private.onrender.com';
const imgUrl = u => u ? (u.startsWith('http') ? u : `${MEDIA}${u}`) : null;

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    eventsAPI.list({ limit: 50, ...(filter && { status: filter }) })
      .then(r => setEvents(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [filter]);

  return (
    <div>
      <div className="page-hero"><div className="container"><h1>Events</h1><p>Join us and be part of the change.</p></div></div>
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', gap: '10px', marginBottom: '32px', flexWrap: 'wrap' }}>
            {['', 'upcoming', 'ongoing', 'completed'].map(s => (
              <button key={s} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter(s)}>
                {s || 'All'}
              </button>
            ))}
          </div>
          {loading ? <div className="page-loader"><div className="spinner" /></div> : events.length === 0 ? <div className="empty"><p>No events found.</p></div> : (
            <div className="grid-3">
              {events.map(e => (
                <Link to={`/events/${e.id}`} className="card" key={e.id} style={{ display: 'block' }}>
                  {imgUrl(e.featured_image) ? <img src={imgUrl(e.featured_image)} alt={e.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} /> : <div style={{ height: '200px', background: 'var(--light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>📅</div>}
                  <div style={{ padding: '20px' }}>
                    <span className={`badge badge-${e.status}`} style={{ marginBottom: '10px', display: 'inline-block' }}>{e.status}</span>
                    <h3 style={{ color: 'var(--navy)', fontWeight: 700, marginBottom: '8px', fontSize: '.98rem' }}>{e.title}</h3>
                    <p style={{ color: 'var(--gray)', fontSize: '.82rem', marginBottom: '8px' }}>📅 {format(new Date(e.start_datetime), 'MMM dd, yyyy')}</p>
                    {e.location && <p style={{ color: 'var(--gray)', fontSize: '.82rem' }}>📍 {e.location}</p>}
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
