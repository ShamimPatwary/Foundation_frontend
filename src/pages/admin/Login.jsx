import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import logo from '../../assets/logo1.png';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin');
    } catch {
      toast.error('Invalid email or password');
    } finally { setLoading(false); }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <img src={logo} alt="Logo" className="ll-logo" />
        <h1 className="bangla">ঐক্যশক্তি ফাউন্ডেশন-Oikyoshokti Foundation</h1>
        <p>Admin Management Portal</p>
        <div className="ll-shapes">
          <div className="ls1" /><div className="ls2" /><div className="ls3" />
        </div>
      </div>
      <div className="login-right">
        <div className="login-box">
          <h2>Welcome Back</h2>
          <p>Sign in to your admin account</p>
          <form onSubmit={submit}>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required placeholder="admin@ekashakti.org" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: '8px' }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
