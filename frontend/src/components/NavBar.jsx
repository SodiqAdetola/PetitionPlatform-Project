import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/NavBar.css'
import { auth } from '../firebase'



function NavBar() {

    const navigate = useNavigate()

    const handleLogout = () => {

        auth.signOut().then ( () => {
          localStorage.removeItem('idToken')
          localStorage.removeItem('email');
          navigate('/login')
        }).catch((err) => {
          console.error('Error logging out: ', err)
        })
    
      }



  return (
    <div className='navbar'>
      <Link to="/" className="nav-link">Home</Link>
      <Link to="/viewPetitions" className="nav-link">Petitions</Link>
      <Link to="/createPetition" className="nav-link">Create Petition</Link>
      <button className="nav-link" onClick={handleLogout}>Logout</button>

    </div>

  )
}

export default NavBar