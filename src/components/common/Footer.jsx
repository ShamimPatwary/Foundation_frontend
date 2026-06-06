import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { subscribersAPI } from '../../services/api';
import toast from 'react-hot-toast';
import logo from '../../assets/logo1.png';
import './Footer.css';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await subscribersAPI.subscribe({ email });
      toast.success('Subscribed successfully!');
      setEmail('');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Error subscribing');
    } finally { setLoading(false); }
  };

  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="container footer-grid">
          <div className="f-brand">
            <img src={logo} alt="Logo" className="f-logo" />
            <h3 className="bangla">ঐক্যশক্তি ফাউন্ডেশন-Oikyoshokti Foundation</h3>
            <p>Empowering communities through education, health, and sustainable development across Bangladesh.</p>
            <div className="f-social">
              <a href="https://www.facebook.com/share/18m9iUCrBA/" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
              <a href="#" aria-label="Twitter"><svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg></a>
              <a href="https://www.youtube.com" aria-label="YouTube"><svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.41 19.1C5.12 19.56 12 19.56 12 19.56s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.34z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#0062ff"/></svg></a>
            </div>
          </div>
          <div className="f-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/programs">Our Programs</Link></li>
              <li><Link to="/news">News & Stories</Link></li>
              <li><Link to="/events">Events</Link></li>
              <li><Link to="/gallery">Gallery</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>
          <div className="f-col">
            <h4>Get Involved</h4>
            <ul>
              <li><Link to="/donate">Donate</Link></li>
              <li><Link to="/volunteer">Volunteer</Link></li>
              <li><Link to="/contact">Partner With Us</Link></li>
            </ul>
            <h4 style={{marginTop:'24px'}}>Contact</h4>
            <ul>
              <li>Dhaka, Bangladesh</li>
              <li>oikyoshoktifoundationcontact@gmail.com</li>
              <li>+880-1838-206509</li>
            </ul>
          </div>
          <div className="f-col f-newsletter">
            <h4>Newsletter</h4>
            <p>Stay updated with our latest impact stories.</p>
            <form onSubmit={submit} className="f-sub-form">
              <input type="email" placeholder="Your email" value={email} onChange={e => setEmail(e.target.value)} required />
              <button type="submit" disabled={loading}>{loading ? '...' : 'Subscribe'}</button>
            </form>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container f-bottom-inner">
          <p>© {new Date().getFullYear()} ঐক্যশক্তি ফাউন্ডেশন. All rights reserved.</p>
          <p>Developed by Md. Shamim Patwary<br />
          <a href="mailto:shamimpatwary002@gmail.com">shamimpatwary002@gmail.com</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
