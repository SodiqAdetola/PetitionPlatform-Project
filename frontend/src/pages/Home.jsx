import React from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../firebase'

function Home() {

  const navigate = useNavigate()

  const handleLogout = () => {

    auth.signOut().then ( () => {
      localStorage.removeItem('idToken')
      navigate('/login')
    }).catch((err) => {
      console.error('Error logging out: ', err)
    })

  }

  return (
    <div>
      <h1>SLPP Home Page</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>

  )
}

export default Home