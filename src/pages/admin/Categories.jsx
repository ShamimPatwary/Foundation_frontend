import React, { useEffect, useState } from 'react';
import { categoriesAPI, tagsAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminCategories() {
  const [cats, setCats] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [catModal, setCatModal] = useState(false);
  const [tagModal, setTagModal] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [catForm, setCatForm] = useState({ name: '', slug: '', description: '' });
  const [tagForm, setTagForm] = useState({ name: '', slug: '' });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([categoriesAPI.list(), tagsAPI.list()]).then(([c, t]) => { setCats(c.data); setTags(t.data); }).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const slugify = t => t.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const saveCat = async e => {
    e.preventDefault(); setSaving(true);
    try {
      editingCat ? await categoriesAPI.update(editingCat.id, catForm) : await categoriesAPI.create(catForm);
      toast.success(editingCat ? 'Updated!' : 'Created!'); setCatModal(false); load();
    } catch (err) { toast.error(err.response?.data?.detail || 'Error'); } finally { setSaving(false); }
  };

  const removeCat = async id => {
    if (!window.confirm('Delete category?')) return;
    try { await categoriesAPI.delete(id); toast.success('Deleted'); load(); } catch { toast.error('Error'); }
  };

  const saveTag = async e => {
    e.preventDefault(); setSaving(true);
    try { await tagsAPI.create(tagForm); toast.success('Tag created!'); setTagModal(false); setTagForm({ name: '', slug: '' }); load(); }
    catch (err) { toast.error(err.response?.data?.detail || 'Error'); } finally { setSaving(false); }
  };

  const removeTag = async id => {
    if (!window.confirm('Delete tag?')) return;
    try { await tagsAPI.delete(id); toast.success('Deleted'); load(); } catch { toast.error('Error'); }
  };

  return (
    <div>
      <h1 className="page-title">Categories & Tags</h1>
      {loading ? <div className="page-loader"><div className="spinner" /></div> : (
        <div className="grid-2">
          {/* Categories */}
          <div>
            <div className="page-head" style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy)' }}>Categories ({cats.length})</h2>
              <button className="btn btn-primary btn-sm" onClick={() => { setEditingCat(null); setCatForm({ name: '', slug: '', description: '' }); setCatModal(true); }}>+ Add</button>
            </div>
            <div className="table-wrap"><table>
              <thead><tr><th>Name</th><th>Slug</th><th>Actions</th></tr></thead>
              <tbody>{cats.length === 0 ? <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--gray)' }}>None yet</td></tr> : cats.map(c => (
                <tr key={c.id}>
                  <td><strong>{c.name}</strong></td>
                  <td><code style={{ fontSize: '.8rem', background: 'var(--off)', padding: '2px 6px', borderRadius: '4px' }}>{c.slug}</code></td>
                  <td><div className="td-actions">
                    <button className="btn-icon" onClick={() => { setEditingCat(c); setCatForm({ name: c.name, slug: c.slug, description: c.description || '' }); setCatModal(true); }}>✏️</button>
                    <button className="btn-icon danger" onClick={() => removeCat(c.id)}>🗑️</button>
                  </div></td>
                </tr>
              ))}</tbody>
            </table></div>
          </div>

          {/* Tags */}
          <div>
            <div className="page-head" style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy)' }}>Tags ({tags.length})</h2>
              <button className="btn btn-primary btn-sm" onClick={() => { setTagForm({ name: '', slug: '' }); setTagModal(true); }}>+ Add</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {tags.length === 0 ? <p style={{ color: 'var(--gray)' }}>No tags yet</p> : tags.map(t => (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--off)', borderRadius: '20px', padding: '6px 14px', fontSize: '.85rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--navy)' }}>{t.name}</span>
                  <button onClick={() => removeTag(t.id)} style={{ background: 'none', border: 'none', color: 'var(--gray)', cursor: 'pointer', fontSize: '.9rem', padding: '0 2px', lineHeight: 1 }}>×</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {catModal && (
        <div className="modal-overlay" onClick={() => setCatModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3>{editingCat ? 'Edit Category' : 'New Category'}</h3><button className="modal-close" onClick={() => setCatModal(false)}>×</button></div>
            <form onSubmit={saveCat}>
              <div className="modal-body">
                <div className="form-group"><label>Name *</label><input className="form-control" value={catForm.name} onChange={e => setCatForm(f => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))} required /></div>
                <div className="form-group"><label>Slug *</label><input className="form-control" value={catForm.slug} onChange={e => setCatForm(f => ({ ...f, slug: e.target.value }))} required /></div>
                <div className="form-group"><label>Description</label><textarea className="form-control" rows={3} value={catForm.description} onChange={e => setCatForm(f => ({ ...f, description: e.target.value }))} /></div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setCatModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {tagModal && (
        <div className="modal-overlay" onClick={() => setTagModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3>New Tag</h3><button className="modal-close" onClick={() => setTagModal(false)}>×</button></div>
            <form onSubmit={saveTag}>
              <div className="modal-body">
                <div className="form-group"><label>Name *</label><input className="form-control" value={tagForm.name} onChange={e => setTagForm(f => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))} required /></div>
                <div className="form-group"><label>Slug *</label><input className="form-control" value={tagForm.slug} onChange={e => setTagForm(f => ({ ...f, slug: e.target.value }))} required /></div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setTagModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
