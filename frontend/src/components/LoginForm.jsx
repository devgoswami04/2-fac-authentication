
import { useState } from 'react';
import api from '../api';

export default function LoginForm({ onNext, setUser }) {
  const [form, setForm] = useState({ username: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/login', form);
      const { username, isMFAActive } = res.data;
      setUser(username);
      onNext(isMFAActive ? 'verify' : 'setup');
    } catch {
      alert('Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold text-indigo-700 text-center">Login</h2>
      <input className="input" placeholder="Username"
        value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
      <input className="input" placeholder="Password" type="password"
        value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <button className="btn-indigo" type="submit">Login</button>
    </form>
  );
}
