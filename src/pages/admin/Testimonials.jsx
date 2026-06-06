import React, { useEffect, useState } from 'react';
import { testimonialsAPI, uploadAPI } from '../../services/api';
import toast from 'react-hot-toast';

const MEDIA = process.env.REACT_APP_MEDIA_URL || 'https://foundation-backend-private.onrender.com';
const blank = { author_name: '', author_title: '', author_photo: '', content: '', rating: 5, is_active: true, order_index: 0 };

export default function AdminTestimonials() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);

  const load = () => { setLoading(true); testimonialsAPI.list().then(r => setItems(r.data)).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(blank); setModal(true); };
  const openEdit = item => { setEditing(item); setForm({ author_name: item.author_name, author_title: item.author_title || '', author_photo: item.author_photo || '', content: item.content, rating: item.rating, is_active: item.is_active, order_index: item.order_index }); setModal(true); };

  const ch = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handlePhoto = async e => {
    const file = e.target.files[0]; if (!file) return;
    try { const r = await uploadAPI.image(file); setForm(f => ({ ...f, author_photo: r.data.url })); toast.success('Uploaded'); } catch { toast.error('Upload failed'); }
  };

  const save = async e => {
    e.preventDefault(); setSaving(true);
    try {
      editing ? await testimonialsAPI.update(editing.id, form) : await testimonialsAPI.create(form);
      toast.success(editing ? 'Updated!' : 'Created!'); setModal(false); load();
    } catch (err) { toast.error(err.response?.data?.detail || 'Error'); } finally { setSaving(false); }
  };

  const remove = async id => {
    if (!window.confirm('Delete?')) return;
    try { await testimonialsAPI.delete(id); toast.success('Deleted'); load(); } catch { toast.error('Error'); }
  };

  return (
    <div>
      <div className="page-head"><h1>Testimonials</h1><button className="btn btn-primary" onClick={openCreate}>+ Add Testimonial</button></div>
      {loading ? <div className="page-loader"><div className="spinner" /></div> : (
        <div className="table-wrap"><table>
          <thead><tr><th>Author</th><th>Title</th><th>Rating</th><th>Active</th><th>Actions</th></tr></thead>
          <tbody>{items.length === 0 ? <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--gray)' }}>No testimonials</td></tr> : items.map(t => (
            <tr key={t.id}>
              <td><strong>{t.author_name}</strong></td>
              <td>{t.author_title || '—'}</td>
              <td>{'★'.repeat(t.rating)}</td>
              <td>{t.is_active ? '✅' : '❌'}</td>
              <td><div className="td-actions"><button className="btn-icon" onClick={() => openEdit(t)}>✏️</button><button className="btn-icon danger" onClick={() => remove(t.id)}>🗑️</button></div></td>
            </tr>
          ))}</tbody>
        </table></div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3>{editing ? 'Edit Testimonial' : 'New Testimonial'}</h3><button className="modal-close" onClick={() => setModal(false)}>×</button></div>
            <form onSubmit={save}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group"><label>Author Name *</label><input name="author_name" className="form-control" value={form.author_name} onChange={ch} required /></div>
                  <div className="form-group"><label>Title / Position</label><input name="author_title" className="form-control" value={form.author_title} onChange={ch} /></div>
                  <div className="form-group"><label>Rating (1-5)</label><input name="rating" type="number" min={1} max={5} className="form-control" value={form.rating} onChange={ch} /></div>
                  <div className="form-group"><label>Order Index</label><input name="order_index" type="number" className="form-control" value={form.order_index} onChange={ch} /></div>
                </div>
                <div className="form-group"><label>Content *</label><textarea name="content" className="form-control" rows={4} value={form.content} onChange={ch} required /></div>
                <div className="form-group"><label>Author Photo</label>
                  <input type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'block', marginBottom: '8px' }} />
                  {form.author_photo && <img src={form.author_photo.startsWith('http') ? form.author_photo : `${MEDIA}${form.author_photo}`} alt="" style={{ height: '60px', width: '60px', borderRadius: '50%', objectFit: 'cover' }} />}
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
