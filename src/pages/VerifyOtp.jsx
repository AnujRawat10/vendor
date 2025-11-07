import { useEffect, useState } from 'react';
import { api } from '../api';
import { storage } from '../utils/storage';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function VerifyOtp() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [verif, setVerif] = useState(storage.getPendingVerification());
  const [loading, setLoading] = useState(false);
  const { setAccessToken, setRefreshToken, setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const pv = storage.getPendingVerification();
    setVerif(pv);
  }, []);

  if (!verif) {
    return (
      <div style={{ maxWidth: 400, margin: '80px auto', padding: 20 }}>
        <p>No verification in progress. <Link to="/signin">Go back</Link></p>
      </div>
    );
  }

  async function onVerify(e) {
    e.preventDefault();
    setError('');

    if (!code || code.length < 4) return setError('Enter 4-digit OTP');

    try {
      setLoading(true);
      const res = await api.verifyOtp({
        phoneNumber: verif.phoneNumber,
        verificationId: verif.verificationId,
        code,
      });

      const { accessToken, refreshToken, user } = res?.data || {};
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      setUser(user);
      storage.saveTokens({ accessToken, refreshToken });
      storage.saveUser(user);
      storage.clearPendingVerification();

      // Route by role
      if (user?.role === 'CUSTOMER') {
        navigate('/vendor/register', { replace: true });
      } else if (user?.role === 'VENDOR') {
        navigate('/vendor/dashboard', { replace: true });
      } else {
        // default
        navigate('/vendor/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  }

  const expiresIn = verif?.expiresAt ? Math.max(0, Math.floor((verif.expiresAt - Date.now()) / 1000)) : null;

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: 20 }}>
      <h1>Verify OTP</h1>
      <p style={{ color: '#6b7280' }}>
        Sent to <b>{verif.phoneNumber}</b> (expires in {expiresIn}s)
      </p>
      <form onSubmit={onVerify} style={{ marginTop: 12 }}>
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder="Enter 0000 in dummy mode"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e5e7eb' }}
        />
        {error ? <p style={{ color: 'crimson', marginTop: 8 }}>{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: 12, width: '100%', padding: 12, borderRadius: 8,
            background: '#111', color: '#fff', border: 0, cursor: 'pointer', opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Verifying…' : 'Verify'}
        </button>
      </form>

      <div style={{ marginTop: 10 }}>
        <Link to="/signin">Use a different number</Link>
      </div>
    </div>
  );
}
