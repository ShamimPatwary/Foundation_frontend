import React, { useEffect, useState } from 'react';
import { usersAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const blank = { name: '', email: '', password: '', role: 'editor', is_active: true };

export default function AdminUsers() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);
  const { user: me } = useAuth();

  const load = () => { setLoading(true); usersAPI.list().then(r => setItems(r.data)).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(blank); setModal(true); };
  const openEdit = item => { setEditing(item); setForm({ name: item.name, email: item.email, password: '', role: item.role, is_active: item.is_active }); setModal(true); };

  const ch = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const save = async e => {
    e.preventDefault(); setSaving(true);
    try {
      const payload = { ...form };
      if (!payload.password) delete payload.password;
      editing ? await usersAPI.update(editing.id, payload) : await usersAPI.create(payload);
      toast.success(editing ? 'Updated!' : 'Created!'); setModal(false); load();
    } catch (err) { toast.error(err.response?.data?.detail || 'Error'); } finally { setSaving(false); }
  };

  const remove = async id => {
    if (id === me?.id) return toast.error("You can't delete yourself");
    if (!window.confirm('Delete this user?')) return;
    try { await usersAPI.delete(id); toast.success('Deleted'); load(); } catch { toast.error('Error'); }
  };

  const roleBadge = r => ({ super_admin: 'badge-cancelled', admin: 'badge-upcoming', editor: 'badge-draft' })[r] || 'badge-draft';

  return (
    <div>
      <div className="page-head"><h1>Users</h1><button className="btn btn-primary" onClick={openCreate}>+ Add User</button></div>
      {loading ? <div className="page-loader"><div className="spinner" /></div> : (
        <div className="table-wrap"><table>
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
          <tbody>{items.length === 0 ? <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--gray)' }}>No users</td></tr> : items.map(u => (
            <tr key={u.id}>
              <td><strong>{u.name}</strong>{u.id === me?.id && <span style={{ marginLeft: 8, fontSize: '.72rem', color: 'var(--gray)' }}>(you)</span>}</td>
              <td>{u.email}</td>
              <td><span className={`badge ${roleBadge(u.role)}`}>{u.role}</span></td>
              <td><span className={`badge ${u.is_active ? 'badge-published' : 'badge-cancelled'}`}>{u.is_active ? 'Active' : 'Inactive'}</span></td>
              <td>{u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}</td>
              <td><div className="td-actions">
                <button className="btn-icon" onClick={() => openEdit(u)}>✏️</button>
                {u.id !== me?.id && <button className="btn-icon danger" onClick={() => remove(u.id)}>🗑️</button>}
              </div></td>
            </tr>
          ))}</tbody>
        </table></div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3>{editing ? 'Edit User' : 'New User'}</h3><button className="modal-close" onClick={() => setModal(false)}>×</button></div>
            <form onSubmit={save}>
              <div className="modal-body">
                <div className="form-group"><label>Name *</label><input name="name" className="form-control" value={form.name} onChange={ch} required /></div>
                <div className="form-group"><label>Email *</label><input name="email" type="email" className="form-control" value={form.email} onChange={ch} required /></div>
                <div className="form-group"><label>{editing ? 'New Password (leave blank to keep)' : 'Password *'}</label><input name="password" type="password" className="form-control" value={form.password} onChange={ch} {...(!editing && { required: true })} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group"><label>Role</label>
                    <select name="role" className="form-control" value={form.role} onChange={ch}>
                      <option value="editor">Editor</option>
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ paddingTop: '28px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} /> Active
                    </label>
                  </div>
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
