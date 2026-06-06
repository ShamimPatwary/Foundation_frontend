import React, { useEffect, useState } from 'react';
import { contactAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminContacts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('');

  const load = () => { setLoading(true); contactAPI.list(filter !== '' ? { is_read: filter === 'read' } : {}).then(r => setItems(r.data)).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, [filter]);

  const markRead = async id => {
    try { await contactAPI.markRead(id); toast.success('Marked as read'); load(); if (selected?.id === id) setSelected(s => ({ ...s, is_read: true })); } catch { toast.error('Error'); }
  };

  const remove = async id => {
    if (!window.confirm('Delete this message?')) return;
    try { await contactAPI.delete(id); toast.success('Deleted'); load(); setSelected(null); } catch { toast.error('Error'); }
  };

  return (
    <div>
      <div className="page-head"><h1>Contact Messages</h1></div>
      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
        {[['', 'All'], ['unread', 'Unread'], ['read', 'Read']].map(([v, l]) => (
          <button key={v} className={`btn btn-sm ${filter === v ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter(v)}>{l}</button>
        ))}
      </div>

      {loading ? <div className="page-loader"><div className="spinner" /></div> : (
        <div className="table-wrap"><table>
          <thead><tr><th>Name</th><th>Email</th><th>Subject</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>{items.length === 0 ? <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--gray)' }}>No messages</td></tr> : items.map(m => (
            <tr key={m.id} style={{ fontWeight: m.is_read ? 400 : 700 }}>
              <td style={{ cursor: 'pointer', color: 'var(--navy)' }} onClick={() => { setSelected(m); if (!m.is_read) markRead(m.id); }}>{m.name}</td>
              <td>{m.email}</td>
              <td>{m.subject || '—'}</td>
              <td><span className={`badge ${m.is_read ? 'badge-completed' : 'badge-pending'}`}>{m.is_read ? 'Read' : 'Unread'}</span></td>
              <td>{m.created_at ? new Date(m.created_at).toLocaleDateString() : '—'}</td>
              <td><div className="td-actions">
                {!m.is_read && <button className="btn-icon" onClick={() => markRead(m.id)} title="Mark read">✓</button>}
                <button className="btn-icon danger" onClick={() => remove(m.id)}>🗑️</button>
              </div></td>
            </tr>
          ))}</tbody>
        </table></div>
      )}

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3>Message from {selected.name}</h3><button className="modal-close" onClick={() => setSelected(null)}>×</button></div>
            <div className="modal-body">
              {[['Name', selected.name], ['Email', selected.email], ['Phone', selected.phone], ['Subject', selected.subject]].map(([l, v]) => v ? (
                <div key={l} style={{ marginBottom: '12px' }}><div style={{ fontSize: '.75rem', fontWeight: 700, color: 'var(--gray)', textTransform: 'uppercase', marginBottom: '3px' }}>{l}</div><div>{v}</div></div>
              ) : null)}
              <div style={{ marginTop: '16px', padding: '16px', background: 'var(--off)', borderRadius: 'var(--r)', lineHeight: 1.8 }}>{selected.message}</div>
              <div style={{ marginTop: '12px', fontSize: '.8rem', color: 'var(--gray)' }}>{selected.created_at ? new Date(selected.created_at).toLocaleString() : ''}</div>
            </div>
            <div className="modal-footer">
              <a href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Your message'}`} className="btn btn-primary">Reply via Email</a>
              <button className="btn btn-outline" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
