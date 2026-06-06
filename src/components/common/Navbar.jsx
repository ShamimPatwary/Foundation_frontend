import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo1.png';
import './Navbar.css';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/programs', label: 'Programs' },
  { to: '/news', label: 'News' },
  { to: '/events', label: 'Events' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/team', label: 'Team' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => setOpen(false), [loc]);

  const isHome = loc.pathname === '/';

  return (
    <nav className={`nav${scrolled || !isHome ? ' scrolled' : ''}`}>
      <div className="container nav-inner">
        <Link to="/" className="nav-brand">
          <img src={logo} alt="Logo" className="nav-logo" />
          <span className="nav-name bangla">ঐক্যশক্তি ফাউন্ডেশন-Oikyoshokti Foundation</span>
        </Link>
        <ul className={`nav-links${open ? ' open' : ''}`}>
          {links.map(l => (
            <li key={l.to}>
              <Link to={l.to} className={loc.pathname === l.to ? 'active' : ''}>{l.label}</Link>
            </li>
          ))}
          <li><Link to="/donate" className="nav-donate">Donate Now</Link></li>
        </ul>
        <button className="nav-toggle" onClick={() => setOpen(o => !o)}>
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}
