import React, { useState } from 'react';
import { contactAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const change = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await contactAPI.submit(form);
      toast.success('Message sent successfully! We will get back to you soon.');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch { toast.error('Failed to send message. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <div className="page-hero"><div className="container"><h1>Contact Us</h1><p>We'd love to hear from you.</p></div></div>
      <section className="section">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '48px', alignItems: 'start' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '24px' }}>Get In Touch</h2>
            {[
              { icon: '📍', label: 'Address', val: 'Dhaka, Bangladesh' },
              { icon: '📞', label: 'Phone', val: '+880-1838-206509' },
              { icon: '✉️', label: 'Email', val: 'oikyoshoktifoundationcontact@gmail.com' },
              { icon: '🕐', label: 'Office Hours', val: 'Sun–Thu: 9am–5pm' },
            ].map(c => (
              <div key={c.label} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--off)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>{c.icon}</div>
                <div><div style={{ fontSize: '.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--gray)', marginBottom: '2px' }}>{c.label}</div><div style={{ fontWeight: 600, color: 'var(--navy)' }}>{c.val}</div></div>
              </div>
            ))}
          </div>
          <form onSubmit={submit} style={{ background: '#fff', borderRadius: 'var(--rl)', padding: '36px', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ fontWeight: 700, color: 'var(--navy)', marginBottom: '24px' }}>Send a Message</h3>
            <div className="grid-2">
              <div className="form-group"><label>Full Name*</label><input name="name" className="form-control" value={form.name} onChange={change} required placeholder="Your name" /></div>
              <div className="form-group"><label>Email*</label><input name="email" type="email" className="form-control" value={form.email} onChange={change} required placeholder="your@email.com" /></div>
            </div>
            <div className="grid-2">
              <div className="form-group"><label>Phone</label><input name="phone" className="form-control" value={form.phone} onChange={change} placeholder="+880..." /></div>
              <div className="form-group"><label>Subject</label><input name="subject" className="form-control" value={form.subject} onChange={change} placeholder="How can we help?" /></div>
            </div>
            <div className="form-group"><label>Message*</label><textarea name="message" className="form-control" value={form.message} onChange={change} required placeholder="Your message..." rows={5} /></div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>{loading ? 'Sending...' : 'Send Message'}</button>
          </form>
        </div>
      </section>
    </div>
  );
}
