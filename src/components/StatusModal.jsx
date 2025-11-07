import { useEffect } from 'react';

export default function StatusModal({ open, onClose, status, message }) {
  useEffect(() => {
    const onEsc = (e) => e.key === 'Escape' && onClose?.();
    if (open) document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

  if (!open) return null;

  const colors = {
    PENDING: '#f59e0b',
    APPROVED: '#10b981',
    REJECTED: '#ef4444',
    SUSPENDED: '#a855f7',
    NOT_APPLIED: '#6b7280',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
    }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: '#fff', padding: 20, borderRadius: 10, width: 420, maxWidth: '90%' }}
      >
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>
          Vendor Status
        </h2>
        <div style={{ marginTop: 12 }}>
          <span style={{ fontWeight: 600, color: colors[status] || '#111' }}>
            {status || 'UNKNOWN'}
          </span>
        </div>
        {message ? <p style={{ marginTop: 8 }}>{message}</p> : null}
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose}
            style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 6, background: '#111', color: '#fff' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
