import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

import PublicLayout from './components/common/PublicLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';

// Public pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Programs from './pages/public/Programs';
import ProgramDetail from './pages/public/ProgramDetail';
import News from './pages/public/News';
import NewsDetail from './pages/public/NewsDetail';
import Events from './pages/public/Events';
import EventDetail from './pages/public/EventDetail';
import Gallery from './pages/public/Gallery';
import Team from './pages/public/Team';
import Contact from './pages/public/Contact';
import Donate from './pages/public/Donate';
import Volunteer from './pages/public/Volunteer';

// Admin pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import AdminNews from './pages/admin/News';
import AdminPrograms from './pages/admin/Programs';
import AdminEvents from './pages/admin/Events';
import AdminTeam from './pages/admin/Team';
import AdminGallery from './pages/admin/Gallery';
import AdminDonations from './pages/admin/Donations';
import AdminVolunteers from './pages/admin/Volunteers';
import AdminContacts from './pages/admin/Contacts';
import AdminSubscribers from './pages/admin/Subscribers';
import AdminTestimonials from './pages/admin/Testimonials';
import AdminPartners from './pages/admin/Partners';
import AdminCategories from './pages/admin/Categories';
import AdminUsers from './pages/admin/Users';
import AdminSettings from './pages/admin/Settings';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
        <Routes>
          {/* Public */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/programs/:id" element={<ProgramDetail />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/team" element={<Team />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/volunteer" element={<Volunteer />} />
          </Route>

          {/* Admin Login */}
          <Route path="/admin/login" element={<Login />} />

          {/* Admin Protected */}
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="news" element={<AdminNews />} />
            <Route path="programs" element={<AdminPrograms />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="team" element={<AdminTeam />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="donations" element={<AdminDonations />} />
            <Route path="volunteers" element={<AdminVolunteers />} />
            <Route path="contacts" element={<AdminContacts />} />
            <Route path="subscribers" element={<AdminSubscribers />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="partners" element={<AdminPartners />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
