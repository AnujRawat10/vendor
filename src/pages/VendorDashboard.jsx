import { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import StatusModal from '../components/StatusModal';
import { Link } from 'react-router-dom';

export default function VendorDashboard() {
  const { user, accessToken, signOut } = useAuth();
  const [status, setStatus] = useState(null);      // e.g. PENDING/APPROVED/REJECTED/SUSPENDED/NOT_APPLIED
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(true);          // show on load
  const [error, setError] = useState('');

  async function loadStatus() {
    try {
      setError('');
      const res = await api.vendorStatus(accessToken);
      const st = res?.data?.status || 'UNKNOWN';
      const msg = res?.data?.message || '';
      setStatus(st);
      setMessage(msg);
      setOpen(true);
    } catch (err) {
      setError(err.message || 'Failed to fetch status');
      setOpen(true);
    }
  }

  useEffect(() => {
    if (accessToken) loadStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: 20 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Vendor Dashboard</h1>
        <div>
          <span style={{ marginRight: 12, color: '#6b7280' }}>
            {user ? `Logged in as ${user.phoneNumber} (${user.role})` : ''}
          </span>
          <button onClick={signOut}
            style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e7eb' }}>
            Sign out
          </button>
        </div>
      </header>

      {error ? <p style={{ color: 'crimson' }}>{error}</p> : null}

      <div style={{ marginTop: 16, border: '1px solid #e5e7eb', padding: 16, borderRadius: 12 }}>
        <h3 style={{ marginTop: 0 }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button onClick={loadStatus}
            style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #e5e7eb' }}>
            Refresh Status
          </button>
          {status === 'NOT_APPLIED' ? (
            <Link to="/vendor/register"
              style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #111', background: '#111', color: '#fff' }}>
              Apply as Vendor
            </Link>
          ) : null}
        </div>

        <div style={{ marginTop: 16 }}>
          <p><b>Current Status:</b> {status || '—'}</p>
          <p style={{ color: '#6b7280' }}>{message}</p>
        </div>
      </div>

      {/* TODO: Put your real dashboard widgets here */}

      <StatusModal
        open={open}
        onClose={() => setOpen(false)}
        status={status || 'UNKNOWN'}
        message={message}
      />
    </div>
  );
}
