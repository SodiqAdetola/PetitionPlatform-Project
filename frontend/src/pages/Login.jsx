import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';


function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate()

    const [error, setError] = useState('');

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      const lowerCaseEmail = email.toLowerCase();
      const response = await signInWithEmailAndPassword(auth, lowerCaseEmail, password);
      console.log(response, 'Login Successful');
      console.log(lowerCaseEmail)
      localStorage.setItem('email', lowerCaseEmail)
      navigate('/');

    } catch (err) {
      console.log(err);
      setError('Login failed')

    }
  };

  return (
    <div className='loginContainer'>
      <form className='loginForm' onSubmit={loginHandler}>
        <h2>Login</h2>

        <label htmlFor="Email">
          Email: <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>

        <label htmlFor="Password">
          Password: <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>

        {error && <p className="errorMessage">{error}</p>}

        <button type="submit">Login</button>
        <p>Don't have an account? <a href="/Register">Register here.</a></p>
      </form>
    </div>
  );
}

export default Login;
