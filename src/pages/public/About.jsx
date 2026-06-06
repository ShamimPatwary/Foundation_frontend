import React, { useEffect, useState } from 'react';
import { settingsAPI, teamAPI } from '../../services/api';
import logo from '../../assets/logo1.png';
import './About.css';

const MEDIA = process.env.REACT_APP_MEDIA_URL || 'https://foundation-backend-private.onrender.com';
const imgUrl = u => u ? (u.startsWith('http') ? u : `${MEDIA}${u}`) : null;

export default function About() {
  const [settings, setSettings] = useState({});
  const [team, setTeam] = useState([]);

  useEffect(() => {
    settingsAPI.list().then(r => {
      const m = {};
      r.data.forEach(s => { m[s.key] = s.value; });
      setSettings(m);
    }).catch(() => {});
    teamAPI.list({ is_board: true }).then(r => setTeam(r.data)).catch(() => {});
  }, []);

  return (
    <div className="about-page">
      <div className="page-hero">
        <div className="container">
          <h1>About Us</h1>
          <p>Learn about our mission, vision, and the work we do.</p>
        </div>
      </div>

      <section className="section">
        <div className="container about-mv">
          <div className="mv-card">
            <div className="mv-icon" style={{ background: 'rgba(192,24,110,.1)', color: 'var(--magenta)' }}>🎯</div>
            <h3>Our Mission</h3>
            <p>{settings['mission'] || 'To create a just and equitable society through community-driven development programs.'}</p>
          </div>
          <div className="mv-card">
            <div className="mv-icon" style={{ background: 'rgba(26,138,122,.1)', color: 'var(--teal)' }}>🔭</div>
            <h3>Our Vision</h3>
            <p>{settings['vision'] || 'A Bangladesh free from poverty and inequality, where every citizen has access to basic rights.'}</p>
          </div>
          <div className="mv-card">
            <div className="mv-icon" style={{ background: 'rgba(245,168,0,.1)', color: 'var(--yellow)' }}>💡</div>
            <h3>Our Values</h3>
            <p>Integrity, transparency, inclusivity, and sustainable impact guide every decision we make.</p>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--off)', paddingTop: '64px' }}>
        <div className="container">
          <div className="section-head">
            <div className="label">Our Story</div>
            <h2>Who We Are</h2>
          </div>
          <div className="about-story">
            <img src={logo} alt="Logo" className="story-img" />
            <div className="story-text">
              <p>{settings['about_short'] || 'ঐক্যশক্তি ফাউন্ডেশন-Oikyoshokti Foundation was established with a vision to empower marginalized communities across Bangladesh. Our dedicated team of professionals and volunteers work tirelessly to deliver programs in education, healthcare, environmental conservation, and women empowerment.'}</p>
              <p style={{ marginTop: '16px' }}>Through partnerships with local governments, international donors, and community organizations, we have reached over 50,000 beneficiaries across 64 districts of Bangladesh.</p>
            </div>
          </div>
        </div>
      </section>

      {team.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <div className="label">Leadership</div>
              <h2>Board of Directors</h2>
            </div>
            <div className="grid-3">
              {team.map(m => (
                <div className="team-card card" key={m.id}>
                  {imgUrl(m.photo) ? <img src={imgUrl(m.photo)} alt={m.name} className="tm-photo" /> : <div className="tm-photo-ph">{m.name[0]}</div>}
                  <div className="tm-info">
                    <h4>{m.name}</h4>
                    <span>{m.designation}</span>
                    {m.bio && <p>{m.bio.substring(0, 120)}...</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
