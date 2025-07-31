
import { useState } from 'react';
import api from '../api';

export default function RegisterForm({ onNext }) {
  const [form, setForm] = useState({ username: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/register', form);
      alert('Registered! Now login.');
      onNext('login');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold text-indigo-700 text-center">Register</h2>
      <input className="input" placeholder="Username" value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })} />
      <input className="input" placeholder="Password" type="password"
        value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <button className="btn-indigo" type="submit">Register</button>
    </form>
  );
}
