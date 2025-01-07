import React, {useState} from 'react'
import {app, auth} from '../firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'

function Register() {

  const [fullName, setFullName] = useState('')
  const [DoB, setDoB] = useState('')
  const [BioID, setBioID] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      console.log('Registration Successful')
    } catch(err) {
      console.log(err)
    }
  }

  return (
    <div className='registerContainer'>
      <form className='registerForm' onSubmit={handleSubmit}>
        <h2>Register</h2>

        <label htmlFor="Name">
          Full Name: 
          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}/>
        </label>

        <label htmlFor="DoB">
          Date of Birth: 
          <input type="date" value={DoB} onChange={(e) => setDoB(e.target.value)}/>
        </label>

        <label htmlFor="BioID">
          Biometric ID: 
          <input type="number" value={BioID} onChange={(e) => setBioID(e.target.value)}/>
        </label>

        <label htmlFor="Email">
          Email: 
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}/>
        </label>

        <label htmlFor="Password">
          Password: 
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        </label>

        <button>Register</button>
        <p>Already have an account? <a href="/Login">Login here.</a></p>
      </form>

    </div>
  )
}

export default Register