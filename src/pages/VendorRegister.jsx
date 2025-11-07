import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { useNavigate, Link } from 'react-router-dom';

const initial = {
  businessName: '',
  ownerName: '',
  contactNumbers: [''],
  email: '',
  businessAddress: '',
  googleMapsLink: '',
  gstNumber: '',
  panNumber: '',
  aadhaarNumber: '',
  vendorType: 'PHARMACY',
  shopName: '',
  bankDetails: {
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    branchName: '',
    accountHolder: '',
  },
};

export default function VendorRegister() {
  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const setField = (key, value) => setForm((p) => ({ ...p, [key]: value }));
  const setBank = (key, value) =>
    setForm((p) => ({ ...p, bankDetails: { ...p.bankDetails, [key]: value } }));

  const setContact = (idx, value) =>
    setForm((p) => {
      const arr = [...p.contactNumbers];
      arr[idx] = value;
      return { ...p, contactNumbers: arr };
    });

  const addContact = () =>
    setForm((p) => ({ ...p, contactNumbers: [...p.contactNumbers, ''] }));

  const delContact = (idx) =>
    setForm((p) => ({ ...p, contactNumbers: p.contactNumbers.filter((_, i) => i !== idx) }));

  async function onSubmit(e) {
    e.preventDefault();
    setErr(''); setMsg('');
    try {
      setSubmitting(true);
      await api.vendorOnboard(form, accessToken);
      setMsg('Application submitted! Redirecting to dashboard…');
      setTimeout(() => navigate('/vendor/dashboard', { replace: true }), 900);
    } catch (error) {
      setErr(error.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: 20 }}>
      <h1>Vendor Registration</h1>
      <p style={{ color: '#6b7280' }}>
        Fill the details to apply as a vendor. After submission, your status may show as <b>PENDING</b>.
      </p>

      {!accessToken ? (
        <p style={{ color: 'crimson' }}>
          You are not logged in. <Link to="/signin">Go to Sign in</Link>
        </p>
      ) : null}

      <form onSubmit={onSubmit} style={{ marginTop: 16 }}>
        <Section title="Business">
          <Row>
            <Input label="Business Name" value={form.businessName} onChange={(v) => setField('businessName', v)} />
            <Input label="Shop Name" value={form.shopName} onChange={(v) => setField('shopName', v)} />
          </Row>
          <Row>
            <Input label="Owner Name" value={form.ownerName} onChange={(v) => setField('ownerName', v)} />
            <Input label="Email" value={form.email} onChange={(v) => setField('email', v)} />
          </Row>
          <Row>
            <Input label="Business Address" value={form.businessAddress} onChange={(v) => setField('businessAddress', v)} />
          </Row>
          <Row>
            <Input label="Maps Link" value={form.googleMapsLink} onChange={(v) => setField('googleMapsLink', v)} />
            <Select
              label="Vendor Type"
              value={form.vendorType}
              onChange={(v) => setField('vendorType', v)}
              options={['PHARMACY', 'GROCERY', 'ELECTRONICS', 'OTHER']}
            />
          </Row>
          <Row>
            <Input label="GST Number" value={form.gstNumber} onChange={(v) => setField('gstNumber', v)} />
            <Input label="PAN Number" value={form.panNumber} onChange={(v) => setField('panNumber', v)} />
          </Row>
          <Row>
            <Input label="Aadhaar Number" value={form.aadhaarNumber} onChange={(v) => setField('aadhaarNumber', v)} />
          </Row>

          <div style={{ marginTop: 12 }}>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: 6 }}>Contact Numbers</label>
            {form.contactNumbers.map((n, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <input
                  value={n}
                  onChange={(e) => setContact(i, e.target.value)}
                  placeholder="9876543210"
                  style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #e5e7eb' }}
                />
                {form.contactNumbers.length > 1 && (
                  <button type="button" onClick={() => delContact(i)}
                    style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e7eb' }}>
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addContact}
              style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e7eb' }}>
              + Add
            </button>
          </div>
        </Section>

        <Section title="Bank Details">
          <Row>
            <Input label="Account Holder" value={form.bankDetails.accountHolder} onChange={(v) => setBank('accountHolder', v)} />
            <Input label="Account Number" value={form.bankDetails.accountNumber} onChange={(v) => setBank('accountNumber', v)} />
          </Row>
          <Row>
            <Input label="IFSC Code" value={form.bankDetails.ifscCode} onChange={(v) => setBank('ifscCode', v)} />
            <Input label="Bank Name" value={form.bankDetails.bankName} onChange={(v) => setBank('bankName', v)} />
          </Row>
          <Row>
            <Input label="Branch Name" value={form.bankDetails.branchName} onChange={(v) => setBank('branchName', v)} />
          </Row>
        </Section>

        {err ? <p style={{ color: 'crimson' }}>{err}</p> : null}
        {msg ? <p style={{ color: '#10b981' }}>{msg}</p> : null}

        <button
          type="submit"
          disabled={submitting}
          style={{ marginTop: 12, padding: '12px 16px', borderRadius: 8, border: 0, background: '#111', color: '#fff' }}
        >
          {submitting ? 'Submitting…' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ border: '1px solid #e5e7eb', padding: 16, borderRadius: 12, marginTop: 16 }}>
      <h3 style={{ margin: 0, marginBottom: 10 }}>{title}</h3>
      {children}
    </div>
  );
}

function Row({ children }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 10 }}>
      {children}
    </div>
  );
}

function Input({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || ''}
        style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e5e7eb' }}
      />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e5e7eb' }}
      >
        {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}
