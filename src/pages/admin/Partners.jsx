import React, { useEffect, useState } from 'react';
import { partnersAPI, uploadAPI } from '../../services/api';
import toast from 'react-hot-toast';

const MEDIA = process.env.REACT_APP_MEDIA_URL || 'https://foundation-backend-private.onrender.com';
const blank = { name: '', logo: '', website: '', description: '', order_index: 0, is_active: true };

export default function AdminPartners() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);

  const load = () => { setLoading(true); partnersAPI.list().then(r => setItems(r.data)).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(blank); setModal(true); };
  const openEdit = item => { setEditing(item); setForm({ name: item.name, logo: item.logo || '', website: item.website || '', description: item.description || '', order_index: item.order_index, is_active: item.is_active }); setModal(true); };

  const ch = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleLogo = async e => {
    const file = e.target.files[0]; if (!file) return;
    try { const r = await uploadAPI.image(file); setForm(f => ({ ...f, logo: r.data.url })); toast.success('Uploaded'); } catch { toast.error('Upload failed'); }
  };

  const save = async e => {
    e.preventDefault(); setSaving(true);
    try {
      editing ? await partnersAPI.update(editing.id, form) : await partnersAPI.create(form);
      toast.success(editing ? 'Updated!' : 'Created!'); setModal(false); load();
    } catch (err) { toast.error(err.response?.data?.detail || 'Error'); } finally { setSaving(false); }
  };

  const remove = async id => {
    if (!window.confirm('Delete this partner?')) return;
    try { await partnersAPI.delete(id); toast.success('Deleted'); load(); } catch { toast.error('Error'); }
  };

  return (
    <div>
      <div className="page-head"><h1>Partners</h1><button className="btn btn-primary" onClick={openCreate}>+ Add Partner</button></div>
      {loading ? <div className="page-loader"><div className="spinner" /></div> : (
        <div className="table-wrap"><table>
          <thead><tr><th>Logo</th><th>Name</th><th>Website</th><th>Active</th><th>Actions</th></tr></thead>
          <tbody>{items.length === 0 ? <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--gray)' }}>No partners yet</td></tr> : items.map(p => (
            <tr key={p.id}>
              <td>{p.logo ? <img src={p.logo.startsWith('http') ? p.logo : `${MEDIA}${p.logo}`} alt={p.name} style={{ height: '40px', maxWidth: '100px', objectFit: 'contain' }} /> : '—'}</td>
              <td><strong>{p.name}</strong></td>
              <td>{p.website ? <a href={p.website} target="_blank" rel="noreferrer" style={{ color: 'var(--blue)' }}>Visit</a> : '—'}</td>
              <td>{p.is_active ? '✅' : '❌'}</td>
              <td><div className="td-actions"><button className="btn-icon" onClick={() => openEdit(p)}>✏️</button><button className="btn-icon danger" onClick={() => remove(p.id)}>🗑️</button></div></td>
            </tr>
          ))}</tbody>
        </table></div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3>{editing ? 'Edit Partner' : 'New Partner'}</h3><button className="modal-close" onClick={() => setModal(false)}>×</button></div>
            <form onSubmit={save}>
              <div className="modal-body">
                <div className="form-group"><label>Partner Name *</label><input name="name" className="form-control" value={form.name} onChange={ch} required /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group"><label>Website</label><input name="website" className="form-control" value={form.website} onChange={ch} placeholder="https://..." /></div>
                  <div className="form-group"><label>Order Index</label><input name="order_index" type="number" className="form-control" value={form.order_index} onChange={ch} /></div>
                </div>
                <div className="form-group"><label>Description</label><textarea name="description" className="form-control" rows={3} value={form.description} onChange={ch} /></div>
                <div className="form-group"><label>Logo</label>
                  <input type="file" accept="image/*" onChange={handleLogo} style={{ display: 'block', marginBottom: '8px' }} />
                  {form.logo && <img src={form.logo.startsWith('http') ? form.logo : `${MEDIA}${form.logo}`} alt="" style={{ height: '50px', objectFit: 'contain' }} />}
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '.9rem' }}>
                  <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} /> Active
                </label>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
