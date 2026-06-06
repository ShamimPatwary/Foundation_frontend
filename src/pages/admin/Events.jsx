import React, { useEffect, useState } from 'react';
import { eventsAPI, uploadAPI } from '../../services/api';
import toast from 'react-hot-toast';

const MEDIA = process.env.REACT_APP_MEDIA_URL || 'https://foundation-backend-private.onrender.com';
const blank = { title: '', slug: '', description: '', featured_image: '', location: '', venue: '', start_datetime: '', end_datetime: '', status: 'upcoming', is_featured: false, registration_link: '' };

export default function AdminEvents() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);

  const load = () => { setLoading(true); eventsAPI.list({ limit: 100 }).then(r => setItems(r.data)).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(blank); setModal(true); };
  const openEdit = item => {
    setEditing(item);
    setForm({ title: item.title, slug: item.slug, description: item.description, featured_image: item.featured_image || '', location: item.location || '', venue: item.venue || '', start_datetime: item.start_datetime ? item.start_datetime.substring(0, 16) : '', end_datetime: item.end_datetime ? item.end_datetime.substring(0, 16) : '', status: item.status, is_featured: item.is_featured, registration_link: item.registration_link || '' });
    setModal(true);
  };

  const slugify = t => t.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const ch = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleImage = async e => {
    const file = e.target.files[0]; if (!file) return;
    try { const r = await uploadAPI.image(file); setForm(f => ({ ...f, featured_image: r.data.url })); toast.success('Uploaded'); } catch { toast.error('Upload failed'); }
  };

  const save = async e => {
    e.preventDefault(); setSaving(true);
    try {
      const payload = { ...form, end_datetime: form.end_datetime || null };
      editing ? await eventsAPI.update(editing.id, payload) : await eventsAPI.create(payload);
      toast.success(editing ? 'Updated!' : 'Created!'); setModal(false); load();
    } catch (err) { toast.error(err.response?.data?.detail || 'Error'); } finally { setSaving(false); }
  };

  const remove = async id => {
    if (!window.confirm('Delete this event?')) return;
    try { await eventsAPI.delete(id); toast.success('Deleted'); load(); } catch { toast.error('Error'); }
  };

  return (
    <div>
      <div className="page-head"><h1>Events</h1><button className="btn btn-primary" onClick={openCreate}>+ Add Event</button></div>
      {loading ? <div className="page-loader"><div className="spinner" /></div> : (
        <div className="table-wrap"><table>
          <thead><tr><th>Title</th><th>Date</th><th>Location</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>{items.length === 0 ? <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--gray)' }}>No events yet</td></tr> : items.map(e => (
            <tr key={e.id}>
              <td><strong>{e.title}</strong></td>
              <td>{e.start_datetime ? new Date(e.start_datetime).toLocaleDateString() : '—'}</td>
              <td>{e.location || '—'}</td>
              <td><span className={`badge badge-${e.status}`}>{e.status}</span></td>
              <td><div className="td-actions"><button className="btn-icon" onClick={() => openEdit(e)}>✏️</button><button className="btn-icon danger" onClick={() => remove(e.id)}>🗑️</button></div></td>
            </tr>
          ))}</tbody>
        </table></div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3>{editing ? 'Edit Event' : 'New Event'}</h3><button className="modal-close" onClick={() => setModal(false)}>×</button></div>
            <form onSubmit={save}>
              <div className="modal-body">
                <div className="form-group"><label>Title *</label><input name="title" className="form-control" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value, slug: slugify(e.target.value) }))} required /></div>
                <div className="form-group"><label>Slug *</label><input name="slug" className="form-control" value={form.slug} onChange={ch} required /></div>
                <div className="form-group"><label>Description *</label><textarea name="description" className="form-control" rows={6} value={form.description} onChange={ch} required /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group"><label>Start Date & Time *</label><input name="start_datetime" type="datetime-local" className="form-control" value={form.start_datetime} onChange={ch} required /></div>
                  <div className="form-group"><label>End Date & Time</label><input name="end_datetime" type="datetime-local" className="form-control" value={form.end_datetime} onChange={ch} /></div>
                  <div className="form-group"><label>Location</label><input name="location" className="form-control" value={form.location} onChange={ch} /></div>
                  <div className="form-group"><label>Venue</label><input name="venue" className="form-control" value={form.venue} onChange={ch} /></div>
                  <div className="form-group"><label>Status</label><select name="status" className="form-control" value={form.status} onChange={ch}><option value="upcoming">Upcoming</option><option value="ongoing">Ongoing</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></div>
                  <div className="form-group"><label>Registration Link</label><input name="registration_link" className="form-control" value={form.registration_link} onChange={ch} /></div>
                </div>
                <div className="form-group"><label>Featured Image</label>
                  <input type="file" accept="image/*" onChange={handleImage} style={{ display: 'block', marginBottom: '8px' }} />
                  {form.featured_image && <img src={form.featured_image.startsWith('http') ? form.featured_image : `${MEDIA}${form.featured_image}`} alt="" style={{ height: '80px', borderRadius: '8px', objectFit: 'cover' }} />}
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '.9rem' }}>
                  <input type="checkbox" checked={form.is_featured} onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))} /> Mark as Featured
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
