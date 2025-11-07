import { useState } from 'react';
import { api } from '../api';
import { storage } from '../utils/storage';
import { useNavigate } from 'react-router-dom';

export default function SignIn() {
  const [phone, setPhone] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function onSendOtp(e) {
    e.preventDefault();
    setError('');
    if (!phone) return setError('Enter phone number');

    try {
      setSending(true);
      const res = await api.sendOtp(phone);
      const { verificationId, timeout } = res?.data || {};
      // store for Verify page
      storage.setPendingVerification({
        phoneNumber: phone,
        verificationId,
        expiresAt: Date.now() + (timeout || 300) * 1000,
      });
      navigate('/verify-otp');
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: 20 }}>
      <h1 style={{ marginBottom: 12 }}>Sign in</h1>
      <form onSubmit={onSendOtp}>
        <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>
          Phone Number
        </label>
        <input
          type="tel"
          placeholder="Enter phone e.g. 7847915622"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e5e7eb' }}
        />
        {error ? <p style={{ color: 'crimson', marginTop: 8 }}>{error}</p> : null}
        <button
          type="submit"
          disabled={sending}
          style={{
            marginTop: 12, width: '100%', padding: 12, borderRadius: 8,
            background: '#111', color: '#fff', border: 0, cursor: 'pointer', opacity: sending ? 0.7 : 1,
          }}
        >
          {sending ? 'Sending…' : 'Send OTP'}
        </button>
      </form>

      <p style={{ marginTop: 12, color: '#6b7280' }}>
        * Dummy mode code is <b>0000</b>.
      </p>
    </div>
  );
}
