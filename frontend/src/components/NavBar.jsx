import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { IoMenu } from "react-icons/io5";
import { IoIosLogOut } from "react-icons/io";
import '../styles/NavBar.css';
import { auth } from '../firebase';

function NavBar() {
  const [isExpanded, setIsExpanded] = useState(window.innerWidth > 768);
  const navigate = useNavigate();
  const location = useLocation()

  const handleLogout = () => {
    auth.signOut()
      .then(() => {
        localStorage.removeItem('idToken');
        localStorage.removeItem('email');
        navigate('/login');
      })
      .catch((err) => console.error('Error logging out:', err));
  };

  const toggleNavbar = () => {
    setIsExpanded((prev) => !prev);
  };

  // Automatically adjust navbar state based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsExpanded(true); // Expand for larger screens
      } else {
        setIsExpanded(false); // Collapse for smaller screens
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getLinkClass = (path) => {
    return location.pathname === path ? 'navLink active' : 'navLink';
  };

  const isAdminDashboard = location.pathname === '/admin';

  return (
    <div>
      {/* Hamburger icon for small screens */}
      {window.innerWidth <= 768 && (
        <button className="navbarToggle" onClick={toggleNavbar}>
          <IoMenu />

        </button>
      )}

      <div className={`navbarContainer ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <p className='title'>SLPP</p>
        
        {!isAdminDashboard && (
          <>
            <Link to="/" className={getLinkClass('/')}>Home</Link>
            <Link to="/viewPetitions" className={getLinkClass('/viewPetitions')}>View Petitions</Link>
            <Link to="/createPetition" className={getLinkClass('/createPetition')}>Create Petition</Link>
          </>
        )}
        <button className="navLink" onClick={handleLogout}>
          <IoIosLogOut size={30}/>
        </button>
      </div>
    </div>
  );
}

export default NavBar;
