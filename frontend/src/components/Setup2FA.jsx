
import { useState, useEffect } from 'react';
import api from '../api';

export default function Setup2FA({ onNext }) {
  const [qrCode, setQrCode] = useState('');

  useEffect(() => {
    api.post('/2fa/setup').then((res) => {
      setQrCode(res.data.qrCode);
    }).catch(() => alert("QR setup failed"));
  }, []);

  return (
    <div className="text-center">
      <h2 className="text-xl font-semibold">Scan QR Code</h2>
      {qrCode ? (
        <img src={qrCode} alt="Scan this QR" className="mx-auto my-4 rounded-xl shadow-lg" />
      ) : (
        <p>Loading...</p>
      )}
      <button className="btn-purple" onClick={() => onNext('verify')}>Continue to Verify</button>
    </div>
  );
}
