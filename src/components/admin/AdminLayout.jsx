import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo1.png';
import './AdminLayout.css';

const menu = [
  { to: '/admin', label: 'Dashboard', icon: '⊞', exact: true },
  { to: '/admin/news', label: 'News', icon: '📰' },
  { to: '/admin/programs', label: 'Programs', icon: '🌱' },
  { to: '/admin/events', label: 'Events', icon: '📅' },
  { to: '/admin/team', label: 'Team', icon: '👥' },
  { to: '/admin/gallery', label: 'Gallery', icon: '🖼️' },
  { to: '/admin/donations', label: 'Donations', icon: '💳' },
  { to: '/admin/volunteers', label: 'Volunteers', icon: '🤝' },
  { to: '/admin/contacts', label: 'Messages', icon: '✉️' },
  { to: '/admin/subscribers', label: 'Subscribers', icon: '📧' },
  { to: '/admin/testimonials', label: 'Testimonials', icon: '💬' },
  { to: '/admin/partners', label: 'Partners', icon: '🤝' },
  { to: '/admin/categories', label: 'Categories', icon: '🏷️' },
  { to: '/admin/users', label: 'Users', icon: '👤' },
  { to: '/admin/settings', label: 'Settings', icon: '⚙️' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false); // desktop collapse
  const [open, setOpen] = useState(false);           // mobile open

  const toggleSidebar = () => {
    if (window.innerWidth <= 768) {
      setOpen(v => !v);       // mobile
    } else {
      setCollapsed(v => !v);  // desktop
    }
  };

  const closeMobile = () => setOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className={`admin-wrap ${collapsed ? 'collapsed' : ''} ${open ? 'open' : ''}`}>

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="sidebar-head">
          <img src={logo} alt="Logo" className="sb-logo" />

          {!collapsed && (
            <span className="sb-title">
              ঐক্যশক্তি ফাউন্ডেশন-Oikyoshokti Foundation
            </span>
          )}
        </div>

        <nav className="sb-nav">
          {menu.map(m => (
            <NavLink
              key={m.to}
              to={m.to}
              end={m.exact}
              onClick={closeMobile}
              className={({ isActive }) =>
                `sb-link${isActive ? ' active' : ''}`
              }
            >
              <span className="sb-icon">{m.icon}</span>
              {!collapsed && <span>{m.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-foot">
          {!collapsed && (
            <div className="sb-user">
              <span>{user?.name}</span>
              <small>{user?.role}</small>
            </div>
          )}

          <button className="sb-logout" onClick={handleLogout}>
            ⏻
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="admin-main">

        {/* NAVBAR */}
        <header className="admin-header">

          {/* ☰ BUTTON (NEW) */}
          <button className="nav-toggle" onClick={toggleSidebar}>
            ☰
          </button>

          <div className="ah-left">
            Hello, {user?.name?.split(' ')[0]} 👋
          </div>

          <div className="ah-right">
            <a href="/" target="_blank" className="btn btn-outline btn-sm">
              View Site
            </a>
          </div>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}