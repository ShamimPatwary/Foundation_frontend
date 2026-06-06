import React, { useEffect, useState } from 'react';
import { galleryAPI, programsAPI, uploadAPI } from '../../services/api';
import toast from 'react-hot-toast';

const MEDIA = process.env.REACT_APP_MEDIA_URL || 'https://foundation-backend-private.onrender.com';
const imgUrl = u => u ? (u.startsWith('http') ? u : `${MEDIA}${u}`) : null;

export default function AdminGallery() {
  const [items, setItems] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [programFilter, setProgramFilter] = useState('');

  const load = () => { setLoading(true); galleryAPI.list(programFilter ? { program_id: programFilter } : {}).then(r => setItems(r.data)).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { load(); programsAPI.list({ limit: 100 }).then(r => setPrograms(r.data)).catch(() => {}); }, [programFilter]);

  const handleUpload = async e => {
    const files = Array.from(e.target.files); if (!files.length) return;
    setUploading(true);
    try {
      for (const file of files) {
        const r = await uploadAPI.image(file);
        await galleryAPI.create({ image_url: r.data.url, program_id: programFilter || null });
      }
      toast.success(`${files.length} image(s) uploaded`); load();
    } catch { toast.error('Upload failed'); } finally { setUploading(false); }
  };

  const remove = async id => {
    if (!window.confirm('Delete this image?')) return;
    try { await galleryAPI.delete(id); toast.success('Deleted'); load(); } catch { toast.error('Error'); }
  };

  return (
    <div>
      <div className="page-head">
        <h1>Gallery</h1>
        <label className={`btn btn-primary${uploading ? ' disabled' : ''}`} style={{ cursor: 'pointer' }}>
          {uploading ? 'Uploading...' : '+ Upload Images'}
          <input type="file" accept="image/*" multiple onChange={handleUpload} style={{ display: 'none' }} disabled={uploading} />
        </label>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <select className="form-control" style={{ maxWidth: '260px' }} value={programFilter} onChange={e => setProgramFilter(e.target.value)}>
          <option value="">All Images</option>
          {programs.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
        </select>
      </div>

      {loading ? <div className="page-loader"><div className="spinner" /></div> : items.length === 0 ? (
        <div className="empty"><p>No images yet. Upload some above.</p></div>
      ) : (
        <div className="grid-4" style={{ gap: '16px' }}>
          {items.map(g => (
            <div key={g.id} style={{ position: 'relative', borderRadius: 'var(--r)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
              <img src={imgUrl(g.image_url)} alt={g.alt_text || g.title || ''} style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block' }} />
              <button onClick={() => remove(g.id)} style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(229,57,53,.9)', border: 'none', color: '#fff', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', fontSize: '.8rem' }}>✕</button>
              {g.title && <div style={{ padding: '8px 10px', fontSize: '.8rem', fontWeight: 600, color: 'var(--navy)', background: '#fff' }}>{g.title}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
