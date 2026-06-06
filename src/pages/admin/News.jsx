import React, { useEffect, useState } from 'react';
import { newsAPI, categoriesAPI, tagsAPI, uploadAPI } from '../../services/api';
import toast from 'react-hot-toast';

const MEDIA = process.env.REACT_APP_MEDIA_URL || 'https://foundation-backend-private.onrender.com';

export default function AdminNews() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', slug: '', excerpt: '', content: '', featured_image: '', status: 'draft', is_featured: false, category_id: '', tag_ids: [] });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    newsAPI.list({ limit: 100 }).then(r => setItems(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    categoriesAPI.list().then(r => setCategories(r.data)).catch(() => {});
    tagsAPI.list().then(r => setTags(r.data)).catch(() => {});
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', slug: '', excerpt: '', content: '', featured_image: '', status: 'draft', is_featured: false, category_id: '', tag_ids: [] });
    setModal(true);
  };

  const openEdit = item => {
    setEditing(item);
    setForm({ title: item.title, slug: item.slug, excerpt: item.excerpt || '', content: item.content, featured_image: item.featured_image || '', status: item.status, is_featured: item.is_featured, category_id: item.category?.id || '', tag_ids: item.tags?.map(t => t.id) || [] });
    setModal(true);
  };

  const handleImage = async e => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const r = await uploadAPI.image(file);
      setForm(f => ({ ...f, featured_image: r.data.url }));
      toast.success('Image uploaded');
    } catch { toast.error('Upload failed'); }
  };

  const slugify = title => title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const save = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, category_id: form.category_id || null, tag_ids: form.tag_ids };
      if (editing) await newsAPI.update(editing.id, payload);
      else await newsAPI.create(payload);
      toast.success(editing ? 'Updated!' : 'Created!');
      setModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Error saving');
    } finally { setSaving(false); }
  };

  const remove = async id => {
    if (!window.confirm('Delete this article?')) return;
    try { await newsAPI.delete(id); toast.success('Deleted'); load(); } catch { toast.error('Error deleting'); }
  };

  return (
    <div>
      <div className="page-head">
        <h1>News Articles</h1>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Article</button>
      </div>
      {loading ? <div className="page-loader"><div className="spinner" /></div> : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Title</th><th>Category</th><th>Status</th><th>Views</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {items.length === 0 ? <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--gray)' }}>No articles yet</td></tr> : items.map(n => (
                <tr key={n.id}>
                  <td><strong>{n.title}</strong>{n.is_featured && <span className="badge badge-published" style={{ marginLeft: 8 }}>Featured</span>}</td>
                  <td>{n.category?.name || '—'}</td>
                  <td><span className={`badge badge-${n.status}`}>{n.status}</span></td>
                  <td>{n.views}</td>
                  <td>{n.created_at ? new Date(n.created_at).toLocaleDateString() : '—'}</td>
                  <td><div className="td-actions">
                    <button className="btn-icon" onClick={() => openEdit(n)}>✏️</button>
                    <button className="btn-icon danger" onClick={() => remove(n.id)}>🗑️</button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editing ? 'Edit Article' : 'New Article'}</h3>
              <button className="modal-close" onClick={() => setModal(false)}>×</button>
            </div>
            <form onSubmit={save}>
              <div className="modal-body">
                <div className="form-group"><label>Title *</label><input className="form-control" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value, slug: slugify(e.target.value) }))} required /></div>
                <div className="form-group"><label>Slug *</label><input className="form-control" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} required /></div>
                <div className="form-group"><label>Excerpt</label><textarea className="form-control" rows={2} value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} /></div>
                <div className="form-group"><label>Content *</label><textarea className="form-control" rows={8} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} required /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group"><label>Category</label>
                    <select className="form-control" value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}>
                      <option value="">None</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group"><label>Status</label>
                    <select className="form-control" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>
                <div className="form-group"><label>Tags</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {tags.map(t => (
                      <label key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '.88rem' }}>
                        <input type="checkbox" checked={form.tag_ids.includes(t.id)} onChange={e => setForm(f => ({ ...f, tag_ids: e.target.checked ? [...f.tag_ids, t.id] : f.tag_ids.filter(id => id !== t.id) }))} />
                        {t.name}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="form-group"><label>Featured Image</label>
                  <input type="file" accept="image/*" onChange={handleImage} style={{ marginBottom: '8px', display: 'block' }} />
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
