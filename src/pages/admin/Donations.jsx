import React, { useEffect, useState } from 'react';
import { donationsAPI } from '../../services/api';
import toast from 'react-hot-toast';

const blank = { donor_name: '', donor_email: '', donor_phone: '', amount: '', currency: 'BDT', payment_method: 'cash', transaction_id: '', note: '', status: 'pending' };

export default function AdminDonations() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');

  const load = () => { setLoading(true); donationsAPI.list(statusFilter ? { status: statusFilter } : {}).then(r => setItems(r.data)).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, [statusFilter]);

  const ch = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const save = async e => {
    e.preventDefault(); setSaving(true);
    try {
      const donor = await donationsAPI.createDonor({ name: form.donor_name, email: form.donor_email || null, phone: form.donor_phone || null });
      await donationsAPI.create({ donor_id: donor.data.id, amount: parseFloat(form.amount), currency: form.currency, payment_method: form.payment_method, transaction_id: form.transaction_id || null, note: form.note || null, status: form.status });
      toast.success('Donation recorded!'); setModal(false); setForm(blank); load();
    } catch (err) { toast.error(err.response?.data?.detail || 'Error'); } finally { setSaving(false); }
  };

  const updateStatus = async (id, status) => {
    try { await donationsAPI.update(id, { status }); toast.success('Status updated'); load(); } catch { toast.error('Error'); }
  };

  const remove = async id => {
    if (!window.confirm('Delete this donation?')) return;
    try { await donationsAPI.delete(id); toast.success('Deleted'); load(); } catch { toast.error('Error'); }
  };

  const total = items.filter(i => i.status === 'completed').reduce((s, i) => s + i.amount, 0);

  return (
    <div>
      <div className="page-head"><h1>Donations</h1><button className="btn btn-primary" onClick={() => { setForm(blank); setModal(true); }}>+ Record Donation</button></div>

      <div style={{ background: 'linear-gradient(135deg,var(--teal),#136b5e)', borderRadius: 'var(--rl)', padding: '24px 28px', marginBottom: '24px', color: '#fff', display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        <div><div style={{ fontSize: '.8rem', opacity: .7, marginBottom: '4px' }}>TOTAL RECEIVED</div><div style={{ fontSize: '2rem', fontWeight: 800 }}>৳{total.toLocaleString()}</div></div>
        <div><div style={{ fontSize: '.8rem', opacity: .7, marginBottom: '4px' }}>TOTAL DONATIONS</div><div style={{ fontSize: '2rem', fontWeight: 800 }}>{items.length}</div></div>
        <div><div style={{ fontSize: '.8rem', opacity: .7, marginBottom: '4px' }}>PENDING</div><div style={{ fontSize: '2rem', fontWeight: 800 }}>{items.filter(i => i.status === 'pending').length}</div></div>
      </div>

      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {['', 'pending', 'completed', 'failed', 'refunded'].map(s => (
          <button key={s} className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-outline'}`} onClick={() => setStatusFilter(s)}>{s || 'All'}</button>
        ))}
      </div>

      {loading ? <div className="page-loader"><div className="spinner" /></div> : (
        <div className="table-wrap"><table>
          <thead><tr><th>Donor</th><th>Email</th><th>Phone</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>{items.length === 0 ? <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--gray)' }}>No donations yet</td></tr> : items.map(d => (
            <tr key={d.id}>
              <td><strong>{d.donor?.name || '—'}</strong></td>
              <td><small>{d.donor?.email || '—'}</small></td>
              <td><small>{d.donor?.phone || '—'}</small></td>
              <td><strong>৳{d.amount?.toLocaleString()}</strong> <small>{d.currency}</small></td>
              <td>{d.payment_method || '—'}</td>
              <td>
                <select value={d.status} onChange={e => updateStatus(d.id, e.target.value)} style={{ padding: '4px 8px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '.8rem', cursor: 'pointer' }}>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </td>
              <td>{d.donated_at ? new Date(d.donated_at).toLocaleDateString() : '—'}</td>
              <td><button className="btn-icon danger" onClick={() => remove(d.id)}>🗑️</button></td>
            </tr>
          ))}</tbody>
        </table></div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3>Record Donation</h3><button className="modal-close" onClick={() => setModal(false)}>×</button></div>
            <form onSubmit={save}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group"><label>Donor Name *</label><input name="donor_name" className="form-control" value={form.donor_name} onChange={ch} required /></div>
                  <div className="form-group"><label>Donor Email</label><input name="donor_email" type="email" className="form-control" value={form.donor_email} onChange={ch} /></div>
                  <div className="form-group"><label>Donor Phone</label><input name="donor_phone" className="form-control" value={form.donor_phone} onChange={ch} /></div>
                  <div className="form-group"><label>Amount *</label><input name="amount" type="number" step="0.01" className="form-control" value={form.amount} onChange={ch} required /></div>
                  <div className="form-group"><label>Currency</label><select name="currency" className="form-control" value={form.currency} onChange={ch}><option value="BDT">BDT</option><option value="USD">USD</option></select></div>
                  <div className="form-group"><label>Payment Method</label><select name="payment_method" className="form-control" value={form.payment_method} onChange={ch}><option value="cash">Cash</option><option value="bkash">bKash</option><option value="nagad">Nagad</option><option value="bank">Bank Transfer</option></select></div>
                  <div className="form-group"><label>Transaction ID</label><input name="transaction_id" className="form-control" value={form.transaction_id} onChange={ch} /></div>
                  <div className="form-group"><label>Status</label><select name="status" className="form-control" value={form.status} onChange={ch}><option value="pending">Pending</option><option value="completed">Completed</option><option value="failed">Failed</option></select></div>
                </div>
                <div className="form-group"><label>Note</label><textarea name="note" className="form-control" rows={3} value={form.note} onChange={ch} /></div>
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