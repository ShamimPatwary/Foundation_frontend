import React, { useEffect, useState } from 'react';
import { teamAPI, uploadAPI } from '../../services/api';
import toast from 'react-hot-toast';

const MEDIA = process.env.REACT_APP_MEDIA_URL || 'https://foundation-backend-private.onrender.com';
const blank = { name: '', designation: '', department: '', bio: '', photo: '', email: '', phone: '', linkedin: '', order_index: 0, is_active: true, is_board_member: false };

export default function AdminTeam() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);

  const load = () => { setLoading(true); teamAPI.list().then(r => setItems(r.data)).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(blank); setModal(true); };
  const openEdit = item => { setEditing(item); setForm({ name: item.name, designation: item.designation, department: item.department || '', bio: item.bio || '', photo: item.photo || '', email: item.email || '', phone: item.phone || '', linkedin: item.linkedin || '', order_index: item.order_index || 0, is_active: item.is_active, is_board_member: item.is_board_member }); setModal(true); };

  const ch = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handlePhoto = async e => {
    const file = e.target.files[0]; if (!file) return;
    try { const r = await uploadAPI.image(file); setForm(f => ({ ...f, photo: r.data.url })); toast.success('Uploaded'); } catch { toast.error('Upload failed'); }
  };

  const save = async e => {
    e.preventDefault(); setSaving(true);
    try {
      editing ? await teamAPI.update(editing.id, form) : await teamAPI.create(form);
      toast.success(editing ? 'Updated!' : 'Created!'); setModal(false); load();
    } catch (err) { toast.error(err.response?.data?.detail || 'Error'); } finally { setSaving(false); }
  };

  const remove = async id => {
    if (!window.confirm('Delete this member?')) return;
    try { await teamAPI.delete(id); toast.success('Deleted'); load(); } catch { toast.error('Error'); }
  };

  return (
    <div>
      <div className="page-head"><h1>Team Members</h1><button className="btn btn-primary" onClick={openCreate}>+ Add Member</button></div>
      {loading ? <div className="page-loader"><div className="spinner" /></div> : (
        <div className="table-wrap"><table>
          <thead><tr><th>Photo</th><th>Name</th><th>Designation</th><th>Department</th><th>Board</th><th>Actions</th></tr></thead>
          <tbody>{items.length === 0 ? <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--gray)' }}>No members yet</td></tr> : items.map(m => (
            <tr key={m.id}>
              <td>{m.photo ? <img src={m.photo.startsWith('http') ? m.photo : `${MEDIA}${m.photo}`} alt={m.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} /> : <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--navy)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{m.name[0]}</div>}</td>
              <td><strong>{m.name}</strong></td>
              <td>{m.designation}</td>
              <td>{m.department || '—'}</td>
              <td>{m.is_board_member ? '✅' : '—'}</td>
              <td><div className="td-actions"><button className="btn-icon" onClick={() => openEdit(m)}>✏️</button><button className="btn-icon danger" onClick={() => remove(m.id)}>🗑️</button></div></td>
            </tr>
          ))}</tbody>
        </table></div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3>{editing ? 'Edit Member' : 'New Member'}</h3><button className="modal-close" onClick={() => setModal(false)}>×</button></div>
            <form onSubmit={save}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group"><label>Name *</label><input name="name" className="form-control" value={form.name} onChange={ch} required /></div>
                  <div className="form-group"><label>Designation *</label><input name="designation" className="form-control" value={form.designation} onChange={ch} required /></div>
                  <div className="form-group"><label>Department</label><input name="department" className="form-control" value={form.department} onChange={ch} /></div>
                  <div className="form-group"><label>Email</label><input name="email" type="email" className="form-control" value={form.email} onChange={ch} /></div>
                  <div className="form-group"><label>Phone</label><input name="phone" className="form-control" value={form.phone} onChange={ch} /></div>
                  <div className="form-group"><label>LinkedIn URL</label><input name="linkedin" className="form-control" value={form.linkedin} onChange={ch} /></div>
                  <div className="form-group"><label>Order Index</label><input name="order_index" type="number" className="form-control" value={form.order_index} onChange={ch} /></div>
                </div>
                <div className="form-group"><label>Bio</label><textarea name="bio" className="form-control" rows={4} value={form.bio} onChange={ch} /></div>
                <div className="form-group"><label>Photo</label>
                  <input type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'block', marginBottom: '8px' }} />
                  {form.photo && <img src={form.photo.startsWith('http') ? form.photo : `${MEDIA}${form.photo}`} alt="" style={{ height: '80px', width: '80px', borderRadius: '50%', objectFit: 'cover' }} />}
                </div>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '.9rem' }}><input type="checkbox" checked={form.is_board_member} onChange={e => setForm(f => ({ ...f, is_board_member: e.target.checked }))} /> Board Member</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '.9rem' }}><input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} /> Active</label>
                </div>
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
