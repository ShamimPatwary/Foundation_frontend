import React, { useEffect, useState } from 'react';
import { settingsAPI } from '../../services/api';
import toast from 'react-hot-toast';

const GROUPS = [
  { key: 'general', label: 'General', fields: [{ key: 'site_name', label: 'Site Name' }, { key: 'site_tagline', label: 'Tagline' }, { key: 'site_email', label: 'Email' }, { key: 'site_phone', label: 'Phone' }, { key: 'site_address', label: 'Address', textarea: true }] },
  { key: 'about', label: 'About', fields: [{ key: 'about_short', label: 'Short About', textarea: true }, { key: 'mission', label: 'Mission', textarea: true }, { key: 'vision', label: 'Vision', textarea: true }] },
  { key: 'social', label: 'Social Media', fields: [{ key: 'facebook_url', label: 'Facebook URL' }, { key: 'twitter_url', label: 'Twitter URL' }, { key: 'linkedin_url', label: 'LinkedIn URL' }, { key: 'youtube_url', label: 'YouTube URL' }] },
];

export default function AdminSettings() {
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeGroup, setActiveGroup] = useState('general');

  useEffect(() => {
    settingsAPI.list().then(r => {
      const m = {};
      r.data.forEach(s => { m[s.key] = s.value || ''; });
      setValues(m);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const save = async e => {
    e.preventDefault(); setSaving(true);
    const group = GROUPS.find(g => g.key === activeGroup);
    try {
      for (const field of group.fields) {
        await settingsAPI.upsert({ key: field.key, value: values[field.key] || '', group: activeGroup });
      }
      toast.success('Settings saved!');
    } catch { toast.error('Error saving'); } finally { setSaving(false); }
  };

  const group = GROUPS.find(g => g.key === activeGroup);

  return (
    <div>
      <h1 className="page-title">Site Settings</h1>
      {loading ? <div className="page-loader"><div className="spinner" /></div> : (
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '24px', alignItems: 'start' }}>
          <div style={{ background: '#fff', borderRadius: 'var(--rl)', padding: '12px', boxShadow: 'var(--shadow)' }}>
            {GROUPS.map(g => (
              <button key={g.key} onClick={() => setActiveGroup(g.key)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '11px 14px', borderRadius: '10px', border: 'none', background: activeGroup === g.key ? 'var(--navy)' : 'transparent', color: activeGroup === g.key ? '#fff' : 'var(--navy)', fontWeight: 600, fontSize: '.9rem', cursor: 'pointer', marginBottom: '4px', transition: 'var(--t)' }}>
                {g.label}
              </button>
            ))}
          </div>

          <form onSubmit={save} style={{ background: '#fff', borderRadius: 'var(--rl)', padding: '28px', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ fontWeight: 700, color: 'var(--navy)', marginBottom: '24px' }}>{group.label} Settings</h3>
            {group.fields.map(f => (
              <div className="form-group" key={f.key}>
                <label>{f.label}</label>
                {f.textarea ? (
                  <textarea className="form-control" rows={4} value={values[f.key] || ''} onChange={e => setValues(v => ({ ...v, [f.key]: e.target.value }))} />
                ) : (
                  <input className="form-control" value={values[f.key] || ''} onChange={e => setValues(v => ({ ...v, [f.key]: e.target.value }))} />
                )}
              </div>
            ))}
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Settings'}</button>
          </form>
        </div>
      )}
    </div>
  );
}
