import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ViewPetition from './pages/ViewPetition';
import CreatePetition from './pages/CreatePetition';
import NavBar from './components/NavBar';
import './styles/App.css'
import { auth } from './firebase';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('idToken');
    if (savedToken) {
      setUser({ idToken: savedToken });
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        user.getIdToken().then((idToken) => {
          localStorage.setItem('idToken', idToken);
          setUser({ idToken });
        });
      } else {
        localStorage.removeItem('idToken');
        setUser(null); 
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []); 

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      {user && <NavBar />} {/* Render NavBar only when user is logged in */}
      <div className={user ? 'contentContainer' : ''}>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
          <Route path="/viewPetitions" element={user ? <ViewPetition /> : <Navigate to="/login" />} />
          <Route path="/createPetition" element={user ? <CreatePetition /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
