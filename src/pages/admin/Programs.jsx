import React, { useEffect, useState } from 'react';
import { programsAPI, categoriesAPI, uploadAPI } from '../../services/api';
import toast from 'react-hot-toast';

const MEDIA = process.env.REACT_APP_MEDIA_URL || 'https://foundation-backend-private.onrender.com';

const blank = { title: '', slug: '', short_description: '', description: '', featured_image: '', status: 'draft', is_featured: false, category_id: '', location: '', beneficiaries_count: 0, start_date: '', end_date: '' };

export default function AdminPrograms() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);

  const load = () => { setLoading(true); programsAPI.list({ limit: 100 }).then(r => setItems(r.data)).catch(() => {}).finally(() => setLoading(false)); };

  useEffect(() => { load(); categoriesAPI.list().then(r => setCategories(r.data)).catch(() => {}); }, []);

  const openCreate = () => { setEditing(null); setForm(blank); setModal(true); };
  const openEdit = item => {
    setEditing(item);
    setForm({ title: item.title, slug: item.slug, short_description: item.short_description || '', description: item.description, featured_image: item.featured_image || '', status: item.status, is_featured: item.is_featured, category_id: item.category?.id || '', location: item.location || '', beneficiaries_count: item.beneficiaries_count || 0, start_date: item.start_date ? item.start_date.substring(0, 10) : '', end_date: item.end_date ? item.end_date.substring(0, 10) : '' });
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
      const payload = { ...form, category_id: form.category_id || null, beneficiaries_count: parseInt(form.beneficiaries_count) || 0, start_date: form.start_date || null, end_date: form.end_date || null, tag_ids: [] };
      editing ? await programsAPI.update(editing.id, payload) : await programsAPI.create(payload);
      toast.success(editing ? 'Updated!' : 'Created!'); setModal(false); load();
    } catch (err) { toast.error(err.response?.data?.detail || 'Error'); } finally { setSaving(false); }
  };

  const remove = async id => {
    if (!window.confirm('Delete this program?')) return;
    try { await programsAPI.delete(id); toast.success('Deleted'); load(); } catch { toast.error('Error'); }
  };

  return (
    <div>
      <div className="page-head"><h1>Programs</h1><button className="btn btn-primary" onClick={openCreate}>+ Add Program</button></div>
      {loading ? <div className="page-loader"><div className="spinner" /></div> : (
        <div className="table-wrap"><table>
          <thead><tr><th>Title</th><th>Category</th><th>Status</th><th>Beneficiaries</th><th>Actions</th></tr></thead>
          <tbody>{items.length === 0 ? <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--gray)' }}>No programs yet</td></tr> : items.map(p => (
            <tr key={p.id}>
              <td><strong>{p.title}</strong>{p.is_featured && <span className="badge badge-published" style={{ marginLeft: 8 }}>Featured</span>}</td>
              <td>{p.category?.name || '—'}</td>
              <td><span className={`badge badge-${p.status}`}>{p.status}</span></td>
              <td>{p.beneficiaries_count?.toLocaleString() || 0}</td>
              <td><div className="td-actions"><button className="btn-icon" onClick={() => openEdit(p)}>✏️</button><button className="btn-icon danger" onClick={() => remove(p.id)}>🗑️</button></div></td>
            </tr>
          ))}</tbody>
        </table></div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3>{editing ? 'Edit Program' : 'New Program'}</h3><button className="modal-close" onClick={() => setModal(false)}>×</button></div>
            <form onSubmit={save}>
              <div className="modal-body">
                <div className="form-group"><label>Title *</label><input name="title" className="form-control" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value, slug: slugify(e.target.value) }))} required /></div>
                <div className="form-group"><label>Slug *</label><input name="slug" className="form-control" value={form.slug} onChange={ch} required /></div>
                <div className="form-group"><label>Short Description</label><textarea name="short_description" className="form-control" rows={2} value={form.short_description} onChange={ch} /></div>
                <div className="form-group"><label>Description *</label><textarea name="description" className="form-control" rows={7} value={form.description} onChange={ch} required /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group"><label>Category</label><select name="category_id" className="form-control" value={form.category_id} onChange={ch}><option value="">None</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                  <div className="form-group"><label>Status</label><select name="status" className="form-control" value={form.status} onChange={ch}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></div>
                  <div className="form-group"><label>Location</label><input name="location" className="form-control" value={form.location} onChange={ch} /></div>
                  <div className="form-group"><label>Beneficiaries Count</label><input name="beneficiaries_count" type="number" className="form-control" value={form.beneficiaries_count} onChange={ch} /></div>
                  <div className="form-group"><label>Start Date</label><input name="start_date" type="date" className="form-control" value={form.start_date} onChange={ch} /></div>
                  <div className="form-group"><label>End Date</label><input name="end_date" type="date" className="form-control" value={form.end_date} onChange={ch} /></div>
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
