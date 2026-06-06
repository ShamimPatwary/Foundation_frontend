import React, { useState } from 'react';
import { donationsAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function Donate() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', amount: '', payment_method: 'bkash', note: '' });
  const [loading, setLoading] = useState(false);
  const amounts = [500, 1000, 2500, 5000, 10000];

  const change = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const donor = await donationsAPI.createDonor({ name: form.name, email: form.email, phone: form.phone });
      await donationsAPI.create({ donor_id: donor.data.id, amount: parseFloat(form.amount), payment_method: form.payment_method, note: form.note, currency: 'BDT' });
      toast.success('Thank you for your donation! We will contact you shortly.');
      setForm({ name: '', email: '', phone: '', amount: '', payment_method: 'bkash', note: '' });
    } catch { toast.error('Something went wrong. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <div className="page-hero"><div className="container"><h1>Donate</h1><p>Your generosity transforms lives.</p></div></div>
      <section className="section">
        <div className="container" style={{ maxWidth: '720px' }}>
          <div style={{ background: '#fff', borderRadius: 'var(--rl)', padding: '40px', boxShadow: 'var(--shadow)' }}>
            <h2 style={{ fontWeight: 800, color: 'var(--navy)', marginBottom: '8px' }}>Make a Donation</h2>
            <p style={{ color: 'var(--gray)' }}>100% of your donation goes directly to our programs.</p>
            <p style={{ color: 'var(--gray)', marginBottom: '28px' }}>Our Admin will contact you as early as possible to collect the donation.</p>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontWeight: 700, fontSize: '.88rem', color: 'var(--navy)', display: 'block', marginBottom: '10px' }}>Select Amount (BDT)</label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {amounts.map(a => <button key={a} type="button" className={`btn btn-sm ${form.amount == a ? 'btn-primary' : 'btn-outline'}`} onClick={() => setForm(f => ({ ...f, amount: a }))}>{a.toLocaleString()}</button>)}
              </div>
            </div>
            <form onSubmit={submit}>
              <div className="grid-2">
                <div className="form-group"><label>Full Name*</label><input name="name" className="form-control" value={form.name} onChange={change} required placeholder="Your name" /></div>
                <div className="form-group"><label>Email</label><input name="email" type="email" className="form-control" value={form.email} onChange={change} placeholder="your@email.com" /></div>
              </div>
              <div className="grid-2">
                <div className="form-group"><label>Phone*</label><input name="phone" className="form-control" value={form.phone} onChange={change} required placeholder="+880..." /></div>
                <div className="form-group"><label>Amount (BDT)*</label><input name="amount" type="number" className="form-control" value={form.amount} onChange={change} required min="10" placeholder="e.g. 1000" /></div>
              </div>
              <div className="form-group">
                <label>Payment Method</label>
                <select name="payment_method" className="form-control" value={form.payment_method} onChange={change}>
                  <option value="bkash">bKash</option>
                  <option value="nagad">Nagad</option>
                  <option value="rocket">Rocket</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="cash">Cash</option>
                </select>
              </div>
              <div className="form-group"><label>Message (Optional)</label><textarea name="note" className="form-control" value={form.note} onChange={change} rows={3} placeholder="Any message for us?" /></div>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', background: 'var(--magenta)' }}>{loading ? 'Processing...' : '❤️ Donate Now'}</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
