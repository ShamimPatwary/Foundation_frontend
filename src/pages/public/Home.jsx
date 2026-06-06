import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { newsAPI, programsAPI, eventsAPI, testimonialsAPI, partnersAPI, settingsAPI } from '../../services/api';
import { format } from 'date-fns';
import logo from '../../assets/logo1.png';
import './Home.css';

const MEDIA = process.env.REACT_APP_MEDIA_URL || 'https://foundation-backend-private.onrender.com';

function imgUrl(u) { return u ? (u.startsWith('http') ? u : `${MEDIA}${u}`) : null; }

export default function Home() {
  const [news, setNews] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [events, setEvents] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [partners, setPartners] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    newsAPI.list({ status: 'published', limit: 3 }).then(r => setNews(r.data)).catch(() => {});
    programsAPI.list({ status: 'published', is_featured: true, limit: 6 }).then(r => setPrograms(r.data)).catch(() => {});
    eventsAPI.list({ status: 'upcoming', limit: 3 }).then(r => setEvents(r.data)).catch(() => {});
    testimonialsAPI.list().then(r => setTestimonials(r.data)).catch(() => {});
    partnersAPI.list().then(r => setPartners(r.data)).catch(() => {});
    settingsAPI.list().then(r => {
      const map = {};
      r.data.forEach(s => { map[s.key] = s.value; });
      setStats(map);
    }).catch(() => {});
  }, []);

  const impactStats = [
    { num: '100+', label: 'Lives Impacted', color: 'var(--magenta)' },
    { num: '20+', label: 'Programs Completed', color: 'var(--teal)' },
    { num: '1+', label: 'Years of Service', color: 'var(--orange)' },
    { num: '1', label: 'Districts Reached', color: 'var(--yellow)' },
  ];

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-shape s1" />
          <div className="hero-shape s2" />
          <div className="hero-shape s3" />
        </div>
        <div className="container hero-inner">
          <div className="hero-text">
            <div className="hero-badge">🌿 Making a Difference Since 2026</div>
            <h1 className="bangla">ঐক্যশক্তি ফাউন্ডেশন</h1>
            <h2>Empowering Communities, <span>Building Futures</span></h2>
            <p>We work at the grassroots level across Bangladesh — in education, healthcare, environment, and women empowerment — to build a just and equitable society.</p>
            <div className="hero-btns">
              <Link to="/programs" className="btn btn-primary">Our Programs</Link>
              <Link to="/donate" className="btn btn-primary">Donate Now</Link>
            </div>
          </div>
          <div className="hero-logo-wrap">
            <div className="hero-logo-ring">
              <img src={logo} alt="Logo" className="hero-logo" />
            </div>
          </div>
        </div>
        <div className="hero-wave">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80L1440 80L1440 20C1200 80 960 0 720 40C480 80 240 0 0 40L0 80Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="section-sm impact-section">
        <div className="container">
          <div className="impact-grid">
            {impactStats.map((s, i) => (
              <div className="impact-card" key={i} style={{ '--accent': s.color }}>
                <span className="impact-num">{s.num}</span>
                <span className="impact-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="label">What We Do</div>
            <h2>Our Programs</h2>
            <p>From education to environmental conservation — we run impactful programs that transform lives across Bangladesh.</p>
          </div>
          {programs.length === 0 ? (
            <div className="empty"><p>No programs published yet.</p></div>
          ) : (
            <div className="grid-3">
              {programs.map(p => (
                <Link to={`/programs/${p.id}`} className="prog-card card" key={p.id}>
                  {imgUrl(p.featured_image) ? (
                    <img src={imgUrl(p.featured_image)} alt={p.title} className="prog-img" />
                  ) : (
                    <div className="prog-img-ph">🌱</div>
                  )}
                  <div className="prog-body">
                    <h3>{p.title}</h3>
                    <p>{p.short_description || p.description?.substring(0, 100)}...</p>
                    {p.beneficiaries_count > 0 && <div className="prog-meta">👥 {p.beneficiaries_count.toLocaleString()} beneficiaries</div>}
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/programs" className="btn btn-outline">View All Programs</Link>
          </div>
        </div>
      </section>

      {/* About Strip */}
      <section className="about-strip">
        <div className="container about-inner">
          <div className="about-text">
            <div className="label" style={{ color: 'var(--yellow)' }}>About Us</div>
            <h2>We Believe in the Power of Community</h2>
            <p>{stats['about_short'] || 'ঐক্যশক্তি ফাউন্ডেশন-Oikyoshokti Foundation is a non-profit organization working tirelessly to empower marginalized communities through sustainable development programs.'}</p>
            <div className="about-pillars">
              <div className="pillar"><span style={{ background: 'rgba(26,138,122,.15)', color: 'var(--teal)' }}>🎓</span>Education</div>
              <div className="pillar"><span style={{ background: 'rgba(232,101,10,.12)', color: 'var(--orange)' }}>❤️</span>Health</div>
              <div className="pillar"><span style={{ background: 'rgba(94,165,26,.12)', color: 'var(--green)' }}>🌿</span>Environment</div>
              <div className="pillar"><span style={{ background: 'rgba(192,24,110,.1)', color: 'var(--magenta)' }}>👩</span>Women</div>
            </div>
            <Link to="/about" className="btn btn-primary" style={{ marginTop: '8px' }}>Learn More</Link>
          </div>
          <div className="about-visual">
            <div className="av-block av1"><div className="av-icon">🏫</div><b>Education</b><small>12,000+ students</small></div>
            <div className="av-block av2"><div className="av-icon">🏥</div><b>Healthcare</b><small>Free medical camps</small></div>
            <div className="av-block av3"><div className="av-icon">🌳</div><b>Environment</b><small>Tree plantation drives</small></div>
            <div className="av-block av4"><div className="av-icon">💪</div><b>Empowerment</b><small>Women skill training</small></div>
          </div>
        </div>
      </section>

      {/* News */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="label">Latest Updates</div>
            <h2>News & Stories</h2>
          </div>
          {news.length === 0 ? (
            <div className="empty"><p>No news published yet.</p></div>
          ) : (
            <div className="grid-3">
              {news.map(n => (
                <Link to={`/news/${n.id}`} className="news-card card" key={n.id}>
                  {imgUrl(n.featured_image) ? (
                    <img src={imgUrl(n.featured_image)} alt={n.title} className="news-img" />
                  ) : (
                    <div className="news-img-ph">📰</div>
                  )}
                  <div className="news-body">
                    {n.category && <span className="news-cat">{n.category.name}</span>}
                    <h3>{n.title}</h3>
                    <p>{n.excerpt || n.content?.substring(0, 100)}...</p>
                    <div className="news-date">{n.published_at ? format(new Date(n.published_at), 'MMM dd, yyyy') : ''}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/news" className="btn btn-outline">View All News</Link>
          </div>
        </div>
      </section>

      {/* Events */}
      {events.length > 0 && (
        <section className="events-strip section">
          <div className="container">
            <div className="section-head">
              <div className="label">Mark Your Calendar</div>
              <h2>Upcoming Events</h2>
            </div>
            <div className="events-list">
              {events.map(e => (
                <Link to={`/events/${e.id}`} className="event-row" key={e.id}>
                  <div className="event-date-box">
                    <span className="ed-day">{format(new Date(e.start_datetime), 'dd')}</span>
                    <span className="ed-mon">{format(new Date(e.start_datetime), 'MMM')}</span>
                  </div>
                  <div className="event-info">
                    <h4>{e.title}</h4>
                    <p>{e.location || e.venue || ''}</p>
                  </div>
                  <span className={`badge badge-${e.status}`}>{e.status}</span>
                </Link>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <Link to="/events" className="btn btn-outline">View All Events</Link>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="section testi-section">
          <div className="container">
            <div className="section-head">
              <div className="label">What They Say</div>
              <h2>Stories of Change</h2>
            </div>
            <div className="grid-3">
              {testimonials.slice(0, 3).map(t => (
                <div className="testi-card card" key={t.id}>
                  <div className="testi-stars">{'★'.repeat(t.rating || 5)}</div>
                  <p>"{t.content}"</p>
                  <div className="testi-author">
                    {imgUrl(t.author_photo) ? <img src={imgUrl(t.author_photo)} alt={t.author_name} /> : <div className="testi-av">{t.author_name[0]}</div>}
                    <div><strong>{t.author_name}</strong><small>{t.author_title}</small></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Partners */}
      {partners.length > 0 && (
        <section className="section-sm partners-section">
          <div className="container">
            <div className="section-head" style={{ marginBottom: '32px' }}>
              <div className="label">Our Partners</div>
              <h2>Together We're Stronger</h2>
            </div>
            <div className="partners-row">
              {partners.map(p => (
                <a href={p.website || '#'} className="partner-item" key={p.id} target="_blank" rel="noreferrer">
                  {imgUrl(p.logo) ? <img src={imgUrl(p.logo)} alt={p.name} /> : <span>{p.name}</span>}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-box">
            <h2>Make a Difference Today</h2>
            <p>Your contribution helps us reach more communities and create lasting change.</p>
            <div className="cta-btns">
              <Link to="/donate" className="btn" style={{ background: '#fff', color: 'var(--navy)' }}>Donate Now</Link>
              <Link to="/volunteer" className="btn btn-outline" style={{ borderColor: '#fff', color: '#fff' }}>Become a Volunteer</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
