import axios from 'axios';

const BASE = process.env.REACT_APP_API_URL || 'https://foundation-backend-private.onrender.com/api/v1';

const api = axios.create({ baseURL: BASE });

api.interceptors.request.use(cfg => {
  const t = localStorage.getItem('access_token');
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

api.interceptors.response.use(r => r, async err => {
  if (err.response?.status === 401) {
    const rt = localStorage.getItem('refresh_token');
    if (rt) {
      try {
        const { data } = await axios.post(`${BASE}/auth/refresh`, null, { params: { refresh_token: rt } });
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        err.config.headers.Authorization = `Bearer ${data.access_token}`;
        return api(err.config);
      } catch { localStorage.clear(); window.location.href = '/admin/login'; }
    }
  }
  return Promise.reject(err);
});

export const authAPI = {
  login: (email, password) => { const f = new URLSearchParams(); f.append('username', email); f.append('password', password); return api.post('/auth/login', f); },
  me: () => api.get('/auth/me'),
};

export const dashboardAPI = { stats: () => api.get('/dashboard/stats') };

export const newsAPI = {
  list: p => api.get('/news', { params: p }),
  get: id => api.get(`/news/${id}`),
  create: d => api.post('/news', d),
  update: (id, d) => api.put(`/news/${id}`, d),
  delete: id => api.delete(`/news/${id}`),
};

export const programsAPI = {
  list: p => api.get('/programs', { params: p }),
  get: id => api.get(`/programs/${id}`),
  create: d => api.post('/programs', d),
  update: (id, d) => api.put(`/programs/${id}`, d),
  delete: id => api.delete(`/programs/${id}`),
};

export const eventsAPI = {
  list: p => api.get('/events', { params: p }),
  get: id => api.get(`/events/${id}`),
  create: d => api.post('/events', d),
  update: (id, d) => api.put(`/events/${id}`, d),
  delete: id => api.delete(`/events/${id}`),
};

export const teamAPI = {
  list: p => api.get('/team', { params: p }),
  create: d => api.post('/team', d),
  update: (id, d) => api.put(`/team/${id}`, d),
  delete: id => api.delete(`/team/${id}`),
};

export const donationsAPI = {
  list: p => api.get('/donations', { params: p }),
  create: d => api.post('/donations', d),
  update: (id, d) => api.put(`/donations/${id}`, d),
  delete: id => api.delete(`/donations/${id}`),
  listDonors: () => api.get('/donations/donors'),
  createDonor: d => api.post('/donations/donors', d),
};

export const galleryAPI = {
  list: p => api.get('/gallery', { params: p }),
  create: d => api.post('/gallery', d),
  delete: id => api.delete(`/gallery/${id}`),
};

export const testimonialsAPI = {
  list: () => api.get('/testimonials'),
  create: d => api.post('/testimonials', d),
  update: (id, d) => api.put(`/testimonials/${id}`, d),
  delete: id => api.delete(`/testimonials/${id}`),
};

export const partnersAPI = {
  list: () => api.get('/partners'),
  create: d => api.post('/partners', d),
  update: (id, d) => api.put(`/partners/${id}`, d),
  delete: id => api.delete(`/partners/${id}`),
};

export const contactAPI = {
  submit: d => api.post('/contact', d),
  list: p => api.get('/contact', { params: p }),
  markRead: id => api.put(`/contact/${id}/read`),
  delete: id => api.delete(`/contact/${id}`),
};

export const subscribersAPI = {
  subscribe: d => api.post('/subscribers', d),
  list: () => api.get('/subscribers'),
  delete: id => api.delete(`/subscribers/${id}`),
};

export const volunteersAPI = {
  apply: d => api.post('/volunteers', d),
  list: p => api.get('/volunteers', { params: p }),
  update: (id, d) => api.put(`/volunteers/${id}`, d),
  delete: id => api.delete(`/volunteers/${id}`),
};

export const settingsAPI = {
  list: () => api.get('/settings'),
  upsert: d => api.post('/settings', d),
  delete: k => api.delete(`/settings/${k}`),
};

export const categoriesAPI = {
  list: () => api.get('/categories'),
  create: d => api.post('/categories', d),
  update: (id, d) => api.put(`/categories/${id}`, d),
  delete: id => api.delete(`/categories/${id}`),
};

export const tagsAPI = {
  list: () => api.get('/tags'),
  create: d => api.post('/tags', d),
  delete: id => api.delete(`/tags/${id}`),
};

export const usersAPI = {
  list: () => api.get('/users'),
  create: d => api.post('/users', d),
  update: (id, d) => api.put(`/users/${id}`, d),
  delete: id => api.delete(`/users/${id}`),
};

export const uploadAPI = {
  image: file => { const fd = new FormData(); fd.append('file', file); return api.post('/upload/image', fd); },
  document: file => { const fd = new FormData(); fd.append('file', file); return api.post('/upload/document', fd); },
};

export default api;
