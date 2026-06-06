import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../../services/api';
import '../../components/admin/AdminLayout.css';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardAPI.stats().then(r => setStats(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  const cards = [
    { label: 'News Articles', value: stats?.news?.total || 0, sub: `${stats?.news?.published || 0} published`, icon: '📰', color: '#e3f2fd', link: '/admin/news' },
    { label: 'Programs', value: stats?.programs?.total || 0, sub: `${stats?.programs?.active || 0} active`, icon: '🌱', color: '#e8f5e9', link: '/admin/programs' },
    { label: 'Events', value: stats?.events?.total || 0, sub: `${stats?.events?.upcoming || 0} upcoming`, icon: '📅', color: '#fff3e0', link: '/admin/events' },
    { label: 'Total Donations', value: `৳${(stats?.donations?.total_amount || 0).toLocaleString()}`, sub: `${stats?.donations?.total_count || 0} donations`, icon: '💳', color: '#fce4ec', link: '/admin/donations' },
    { label: 'Unread Messages', value: stats?.contacts?.unread || 0, sub: `${stats?.contacts?.total || 0} total`, icon: '✉️', color: '#f3e5f5', link: '/admin/contacts' },
    { label: 'Volunteers', value: stats?.volunteers?.total || 0, sub: `${stats?.volunteers?.pending || 0} pending`, icon: '🤝', color: '#e8f5e9', link: '/admin/volunteers' },
    { label: 'Subscribers', value: stats?.subscribers || 0, sub: 'Newsletter', icon: '📧', color: '#e3f2fd', link: '/admin/subscribers' },
    { label: 'Team Members', value: stats?.team || 0, sub: 'Active members', icon: '👥', color: '#fff8e1', link: '/admin/team' },
  ];

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      <div className="stat-grid">
        {cards.map(c => (
          <Link to={c.link} className="stat-card" key={c.label} style={{ textDecoration: 'none' }}>
            <div className="stat-icon" style={{ background: c.color }}>{c.icon}</div>
            <div className="stat-info">
              <h4>{c.value}</h4>
              <p>{c.label}</p>
              <small style={{ color: 'var(--gray)', fontSize: '.75rem' }}>{c.sub}</small>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div style={{ background: '#fff', borderRadius: 'var(--rl)', padding: '28px', boxShadow: 'var(--shadow)' }}>
          <h3 style={{ fontWeight: 700, color: 'var(--navy)', marginBottom: '20px' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { to: '/admin/news', label: '+ Add News Article', color: 'var(--navy)' },
              { to: '/admin/programs', label: '+ Add Program', color: 'var(--teal)' },
              { to: '/admin/events', label: '+ Add Event', color: 'var(--orange)' },
              { to: '/admin/team', label: '+ Add Team Member', color: 'var(--magenta)' },
            ].map(a => (
              <Link key={a.to} to={a.to} style={{ display: 'block', padding: '12px 16px', borderRadius: '10px', background: 'var(--off)', color: a.color, fontWeight: 600, fontSize: '.9rem', transition: 'var(--t)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--light)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--off)'}>{a.label}</Link>
            ))}
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: 'var(--rl)', padding: '28px', boxShadow: 'var(--shadow)' }}>
          <h3 style={{ fontWeight: 700, color: 'var(--navy)', marginBottom: '20px' }}>Overview</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: 'Published News', val: stats?.news?.published || 0, total: stats?.news?.total || 0, color: 'var(--blue)' },
              { label: 'Active Programs', val: stats?.programs?.active || 0, total: stats?.programs?.total || 0, color: 'var(--teal)' },
              { label: 'Upcoming Events', val: stats?.events?.upcoming || 0, total: stats?.events?.total || 0, color: 'var(--orange)' },
            ].map(o => {
              const pct = o.total ? Math.round((o.val / o.total) * 100) : 0;
              return (
                <div key={o.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '.85rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--navy)' }}>{o.label}</span>
                    <span style={{ color: 'var(--gray)' }}>{o.val}/{o.total}</span>
                  </div>
                  <div style={{ height: '6px', background: 'var(--light)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: o.color, borderRadius: '3px', transition: 'width 1s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
