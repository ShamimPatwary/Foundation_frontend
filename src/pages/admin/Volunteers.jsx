import React, { useEffect, useState } from 'react';
import { volunteersAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminVolunteers() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState(null);

  const load = () => { setLoading(true); volunteersAPI.list(statusFilter ? { status: statusFilter } : {}).then(r => setItems(r.data)).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, [statusFilter]);

  const updateStatus = async (id, status) => {
    try { await volunteersAPI.update(id, { status }); toast.success('Status updated'); load(); setSelected(null); } catch { toast.error('Error'); }
  };

  const remove = async id => {
    if (!window.confirm('Delete this application?')) return;
    try { await volunteersAPI.delete(id); toast.success('Deleted'); load(); setSelected(null); } catch { toast.error('Error'); }
  };

  return (
    <div>
      <div className="page-head"><h1>Volunteers</h1></div>

      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {['', 'pending', 'approved', 'rejected'].map(s => (
          <button key={s} className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-outline'}`} onClick={() => setStatusFilter(s)}>{s || 'All'}</button>
        ))}
      </div>

      {loading ? <div className="page-loader"><div className="spinner" /></div> : (
        <div className="table-wrap"><table>
          <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Availability</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>{items.length === 0 ? <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--gray)' }}>No applications</td></tr> : items.map(v => (
            <tr key={v.id}>
              <td><strong style={{ cursor: 'pointer', color: 'var(--navy)' }} onClick={() => setSelected(v)}>{v.name}</strong></td>
              <td>{v.email}</td>
              <td>{v.phone || '—'}</td>
              <td>{v.availability || '—'}</td>
              <td><span className={`badge badge-${v.status}`}>{v.status}</span></td>
              <td>{v.created_at ? new Date(v.created_at).toLocaleDateString() : '—'}</td>
              <td><div className="td-actions">
                {v.status === 'pending' && <>
                  <button className="btn btn-sm btn-success" onClick={() => updateStatus(v.id, 'approved')}>Approve</button>
                  <button className="btn btn-sm btn-danger" onClick={() => updateStatus(v.id, 'rejected')}>Reject</button>
                </>}
                <button className="btn-icon danger" onClick={() => remove(v.id)}>🗑️</button>
              </div></td>
            </tr>
          ))}</tbody>
        </table></div>
      )}

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3>Volunteer Details</h3><button className="modal-close" onClick={() => setSelected(null)}>×</button></div>
            <div className="modal-body">
              {[['Name', selected.name], ['Email', selected.email], ['Phone', selected.phone], ['Address', selected.address], ['Availability', selected.availability]].map(([l, v]) => v ? (
                <div key={l} style={{ marginBottom: '14px' }}><div style={{ fontSize: '.78rem', fontWeight: 700, color: 'var(--gray)', textTransform: 'uppercase', marginBottom: '3px' }}>{l}</div><div style={{ fontSize: '.92rem' }}>{v}</div></div>
              ) : null)}
              {selected.skills && <div style={{ marginBottom: '14px' }}><div style={{ fontSize: '.78rem', fontWeight: 700, color: 'var(--gray)', textTransform: 'uppercase', marginBottom: '3px' }}>Skills</div><div style={{ fontSize: '.92rem' }}>{selected.skills}</div></div>}
              {selected.motivation && <div style={{ marginBottom: '14px' }}><div style={{ fontSize: '.78rem', fontWeight: 700, color: 'var(--gray)', textTransform: 'uppercase', marginBottom: '3px' }}>Motivation</div><div style={{ fontSize: '.92rem', lineHeight: 1.7 }}>{selected.motivation}</div></div>}
            </div>
            <div className="modal-footer">
              {selected.status === 'pending' && <>
                <button className="btn btn-success" onClick={() => updateStatus(selected.id, 'approved')}>Approve</button>
                <button className="btn btn-danger" onClick={() => updateStatus(selected.id, 'rejected')}>Reject</button>
              </>}
              <button className="btn btn-outline" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
