import React, { useEffect, useState } from 'react';
import { teamAPI } from '../../services/api';

const MEDIA = process.env.REACT_APP_MEDIA_URL || 'https://foundation-backend-private.onrender.com';
const imgUrl = u => u ? (u.startsWith('http') ? u : `${MEDIA}${u}`) : null;

export default function Team() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { teamAPI.list().then(r => setTeam(r.data)).catch(() => {}).finally(() => setLoading(false)); }, []);

  const board = team.filter(m => m.is_board_member);
  const staff = team.filter(m => !m.is_board_member);

  return (
    <div>
      <div className="page-hero"><div className="container"><h1>Our Team</h1><p>Meet the dedicated people behind our mission.</p></div></div>
      <section className="section">
        <div className="container">
          {loading ? <div className="page-loader"><div className="spinner" /></div> : (
            <>
              {board.length > 0 && (<>
                <div className="section-head"><div className="label">Leadership</div><h2>Board of Directors</h2></div>
                <div className="grid-3" style={{ marginBottom: '64px' }}>
                  {board.map(m => <MemberCard key={m.id} m={m} />)}
                </div>
              </>)}
              {staff.length > 0 && (<>
                <div className="section-head"><div className="label">Staff</div><h2>Our Team</h2></div>
                <div className="grid-4">
                  {staff.map(m => <MemberCard key={m.id} m={m} small />)}
                </div>
              </>)}
              {team.length === 0 && <div className="empty"><p>No team members added yet.</p></div>}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

function MemberCard({ m, small }) {
  const img = m.photo ? (m.photo.startsWith('http') ? m.photo : `${process.env.REACT_APP_MEDIA_URL || 'https://foundation-backend-private.onrender.com'}${m.photo}`) : null;
  return (
    <div className="card" style={{ textAlign: 'center' }}>
      {img ? <img src={img} alt={m.name} style={{ width: '100%', height: small ? '180px' : '240px', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: small ? '180px' : '240px', background: 'linear-gradient(135deg,var(--navy),var(--magenta))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: small ? '2rem' : '3rem', color: '#fff', fontWeight: 800 }}>{m.name[0]}</div>}
      <div style={{ padding: '18px 16px' }}>
        <h4 style={{ fontWeight: 700, color: 'var(--navy)', marginBottom: '4px', fontSize: small ? '.9rem' : '1rem' }}>{m.name}</h4>
        <span style={{ fontSize: '.78rem', color: 'var(--magenta)', fontWeight: 700 }}>{m.designation}</span>
        {!small && m.bio && <p style={{ fontSize: '.82rem', color: 'var(--gray)', marginTop: '8px', lineHeight: 1.6 }}>{m.bio.substring(0, 100)}...</p>}
      </div>
    </div>
  );
}
