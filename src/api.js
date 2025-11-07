const BASE_URL = 'https://flickxir.onrender.com';

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // Try to parse JSON safely
  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message = data?.message || `HTTP ${res.status}`;
    throw new Error(message);
  }

  return data;
}

export const api = {
  sendOtp: (phoneNumber) =>
    request('/api/auth/send-otp', { method: 'POST', body: { phoneNumber } }),

  verifyOtp: ({ phoneNumber, verificationId, code }) =>
    request('/api/auth/verify-otp', {
      method: 'POST',
      body: { phoneNumber, verificationId, code },
    }),

  vendorStatus: (token) =>
    request('/api/auth/vendor/status', { token }),

  vendorOnboard: (payload, token) =>
    request('/api/market/vendors/onboard', { method: 'POST', body: payload, token }),
};
