import React, { useState } from 'react';
import { volunteersAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function Volunteer() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', skills: '', motivation: '', availability: '' });
  const [loading, setLoading] = useState(false);

  const change = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await volunteersAPI.apply(form);
      toast.success('Application submitted! We will contact you soon.');
      setForm({ name: '', email: '', phone: '', address: '', skills: '', motivation: '', availability: '' });
    } catch { toast.error('Error submitting. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <div className="page-hero"><div className="container"><h1>Volunteer</h1><p>Join our team and make a difference.</p></div></div>
      <section className="section">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '48px', alignItems: 'start' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '16px' }}>Why Volunteer?</h2>
            {['Make a real impact in communities', 'Gain valuable experience', 'Connect with like-minded people', 'Develop leadership skills', 'Be part of something bigger'].map(b => (
              <div key={b} style={{ display: 'flex', gap: '10px', marginBottom: '14px', alignItems: 'center' }}>
                <span style={{ color: 'var(--teal)', fontWeight: 800, fontSize: '1.1rem' }}>✓</span>
                <span style={{ color: 'var(--text)', fontSize: '.93rem' }}>{b}</span>
              </div>
            ))}
          </div>
          <form onSubmit={submit} style={{ background: '#fff', borderRadius: 'var(--rl)', padding: '36px', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ fontWeight: 700, color: 'var(--navy)', marginBottom: '24px' }}>Volunteer Application</h3>
            <div className="grid-2">
              <div className="form-group"><label>Full Name*</label><input name="name" className="form-control" value={form.name} onChange={change} required /></div>
              <div className="form-group"><label>Email*</label><input name="email" type="email" className="form-control" value={form.email} onChange={change} required /></div>
            </div>
            <div className="grid-2">
              <div className="form-group"><label>Phone</label><input name="phone" className="form-control" value={form.phone} onChange={change} /></div>
              <div className="form-group"><label>Availability</label><select name="availability" className="form-control" value={form.availability} onChange={change}><option value="">Select...</option><option value="weekdays">Weekdays</option><option value="weekends">Weekends</option><option value="fulltime">Full-time</option><option value="flexible">Flexible</option></select></div>
            </div>
            <div className="form-group"><label>Address</label><input name="address" className="form-control" value={form.address} onChange={change} /></div>
            <div className="form-group"><label>Your Skills</label><textarea name="skills" className="form-control" value={form.skills} onChange={change} rows={3} placeholder="e.g. teaching, medical, IT, communications..." /></div>
            <div className="form-group"><label>Why do you want to volunteer?*</label><textarea name="motivation" className="form-control" value={form.motivation} onChange={change} required rows={4} /></div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>{loading ? 'Submitting...' : 'Submit Application'}</button>
          </form>
        </div>
      </section>
    </div>
  );
}
