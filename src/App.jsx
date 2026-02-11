import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StorageProvider, useStorage } from './context/StorageContext';
import { Layout } from './components/layout/Layout';

// Placeholder Pages
import { Dashboard } from './pages/Dashboard';
import { Onboarding } from './pages/Onboarding';
import { Inbox } from './pages/Inbox';
import { PublicContact } from './pages/public/PublicContact';
import { PublicBooking } from './pages/public/PublicBooking';
import { Bookings } from './pages/Bookings';
import { Inventory } from './pages/Inventory';
import { Forms } from './pages/Forms'; // Real Implementation


const ProtectedRoute = ({ children }) => {
  const { workspace } = useStorage();

  if (!workspace.activated) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

function AppRoutes() {
  const { workspace } = useStorage();

  return (
    <Routes>
      <Route path="/onboarding" element={
        workspace.activated ? <Navigate to="/" replace /> : <Onboarding />
      } />

      {/* Public Routes */}
      <Route path="/contact-us" element={<PublicContact />} />
      <Route path="/book-now" element={<PublicBooking />} />

      <Route element={<Layout />}>
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/inbox" element={<ProtectedRoute><Inbox /></ProtectedRoute>} />
        <Route path="/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
        <Route path="/forms" element={<ProtectedRoute><Forms /></ProtectedRoute>} />
        <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
        <Route path="/staff" element={<ProtectedRoute><div>Staff Management</div></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><div>Settings</div></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <StorageProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </StorageProvider>
  );
}

export default App;
