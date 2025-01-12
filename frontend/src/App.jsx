import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ViewPetition from './pages/ViewPetition';
import CreatePetition from './pages/CreatePetition';
import NavBar from './components/NavBar';
import './styles/App.css';
import { auth } from './firebase';
import AdminDashboard from './pages/AdminDashboard';
import axios from 'axios';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          setRoleLoading(true);
          const idToken = await user.getIdToken();
          const email = user.email || localStorage.getItem('email'); 

          if (email) {
            const adminResponse = await axios.get(`http://localhost:9000/slpp/petitioner?email=${email}`);
            const role = adminResponse.data.role;
            setUserRole(role);
            setUser({ idToken, email });
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
          setUser(null);
          setUserRole(null);
        } finally {
          setRoleLoading(false);
        }
      } else {
        setUser(null);
        setUserRole(null);
        setRoleLoading(false); 
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading || roleLoading) {
    return (
      <div className="loadingContainer">
        <div className="spinner"></div>
        <p>Loading, please wait...</p>
      </div>
    );
  }

  // If no user, render only Login or Register
  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  // Render NavBar only if the user is authenticated and not on Login/Register pages
  return (
    <Router>
      {user && userRole && <NavBar />}
      <div className={user ? 'contentContainer' : ''}>
        <Routes>
          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              userRole === 'admin' ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {/* User Routes */}
          <Route
            path="/"
            element={
              userRole === 'admin' ? (
                <Navigate to="/admin" replace />
              ) : (
                <Home />
              )
            }
          />
          <Route
            path="/viewPetitions"
            element={
              userRole === 'admin' ? (
                <Navigate to="/admin" replace />
              ) : (
                <ViewPetition />
              )
            }
          />
          <Route
            path="/createPetition"
            element={
              userRole === 'admin' ? (
                <Navigate to="/admin" replace />
              ) : (
                <CreatePetition />
              )
            }
          />
          {/* Route to login if no valid route */}
          <Route path="*" element={<Navigate to={userRole === 'admin' ? '/admin' : '/'} replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
