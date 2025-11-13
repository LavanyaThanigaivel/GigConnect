import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/common/Navbar';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword'; // ✅ NEW IMPORT
import Dashboard from './pages/Dashboard';
import GigFeed from './pages/GigFeed';
import GigDetails from './pages/GigDetails';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import CreateGig from './pages/CreateGig';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} /> {/* ✅ NEW ROUTE */}
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/gigs" element={<ProtectedRoute><GigFeed /></ProtectedRoute>} />
              <Route path="/gigs/create" element={<ProtectedRoute><CreateGig /></ProtectedRoute>} />
              <Route path="/gigs/:id" element={<ProtectedRoute><GigDetails /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;