
import { useState } from 'react';
import api from '../api';

export default function Verify2FA({ onNext }) {
  const [token, setToken] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/2fa/verify', { token });
      alert('2FA success!');
      localStorage.setItem('token', res.data.token);
      onNext('dashboard');
    } catch {
      alert('Invalid OTP');
    }
  };

  return (
    <form onSubmit={handleVerify} className="space-y-4">
      <h2 className="text-xl font-bold text-purple-700 text-center">Enter 6-digit OTP</h2>
      <input className="input" maxLength={6} placeholder="123456"
        value={token} onChange={(e) => setToken(e.target.value)} />
      <button className="btn-purple" type="submit">Verify</button>
    </form>
  );
}
