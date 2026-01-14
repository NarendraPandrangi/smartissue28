import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Import Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateIssue from './pages/CreateIssue';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p style={{ fontSize: '1.2rem', color: '#666' }}>Loading Smart Issue Board...</p>
      </div>
    );
  }

  // Protected functionality: only allow access if logged in
  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <Router>
      <div style={{ padding: '0', fontFamily: 'sans-serif' }}>
        <Routes>
          {/* Public Routes */}
          {/* If logged in, go to Dashboard, else show Login */}
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login onSwitch={() => null} />} />
          <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup onSwitch={() => null} />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-issue"
            element={
              <ProtectedRoute>
                <CreateIssue />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
