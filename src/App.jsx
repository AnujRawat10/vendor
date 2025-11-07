import { Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './pages/SignIn';
import VerifyOtp from './pages/VerifyOtp';
import VendorRegister from './pages/VendorRegister';
import VendorDashboard from './pages/VendorDashboard';
import PrivateRoute from './components/PrivateRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signin" replace />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />

      <Route
        path="/vendor/register"
        element={
          <PrivateRoute>
            <VendorRegister />
          </PrivateRoute>
        }
      />
      <Route
        path="/vendor/dashboard"
        element={
          <PrivateRoute>
            <VendorDashboard />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<div style={{ padding: 24 }}>Not Found</div>} />
    </Routes>
  );
}
