import React, { useEffect, useState } from 'react';
import { subscribersAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminSubscribers() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = () => { setLoading(true); subscribersAPI.list().then(r => setItems(r.data)).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const remove = async id => {
    if (!window.confirm('Remove this subscriber?')) return;
    try { await subscribersAPI.delete(id); toast.success('Removed'); load(); } catch { toast.error('Error'); }
  };

  const filtered = items.filter(s => s.email.toLowerCase().includes(search.toLowerCase()) || (s.name || '').toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="page-head">
        <h1>Subscribers <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--gray)' }}>({items.length})</span></h1>
      </div>
      <div style={{ marginBottom: '16px' }}>
        <input className="form-control" style={{ maxWidth: '320px' }} placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      {loading ? <div className="page-loader"><div className="spinner" /></div> : (
        <div className="table-wrap"><table>
          <thead><tr><th>#</th><th>Email</th><th>Name</th><th>Subscribed On</th><th>Actions</th></tr></thead>
          <tbody>{filtered.length === 0 ? <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--gray)' }}>No subscribers</td></tr> : filtered.map((s, i) => (
            <tr key={s.id}>
              <td>{i + 1}</td>
              <td>{s.email}</td>
              <td>{s.name || '—'}</td>
              <td>{s.subscribed_at ? new Date(s.subscribed_at).toLocaleDateString() : '—'}</td>
              <td><button className="btn-icon danger" onClick={() => remove(s.id)}>🗑️</button></td>
            </tr>
          ))}</tbody>
        </table></div>
      )}
    </div>
  );
}
