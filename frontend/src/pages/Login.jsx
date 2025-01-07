import React, { useState } from 'react'
import {app, auth} from '../firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'

function Login() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
      e.preventDefault()
      try {
        await signInWithEmailAndPassword(auth, email, password)
        console.log('Login Succesful')
      } catch(err) {
        console.log(err)
      }
    }

  return (
    <div className='loginContainer'>
    <form className='loginForm' onSubmit={handleSubmit}>
      <h2>Login</h2>

      <label htmlFor="Email">
        Email: <input type="text" onChange={ (e) => setEmail(e.target.value) }/>
      </label>

      <label htmlFor="Password">
        Password: <input type="password" onChange={ (e) => setPassword(e.target.value) }/>
      </label>

      <button>Login</button>
      <p>Don't have an account? <a href="/Register">Register here.</a></p>
    </form>

  </div>
  )
}

export default Login