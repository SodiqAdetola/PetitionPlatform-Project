import React, { useState, useEffect} from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css'
import axios from 'axios';
import Cookies from 'js-cookie'; 


function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate()
  const [error, setError] = useState('');

  useEffect(() => {
    const savedEmail = Cookies.get('lastLoginEmail');
    if (savedEmail) {
      setEmail(savedEmail); 
    }
  }, []);

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      const lowerCaseEmail = email.toLowerCase();
      const response = await signInWithEmailAndPassword(auth, lowerCaseEmail, password);
      console.log(response, 'Login Successful');


      console.log(lowerCaseEmail)
      Cookies.set('lastLoginEmail', lowerCaseEmail, { expires: 7 });
      localStorage.setItem('email', lowerCaseEmail)

      const adminResponse = await axios.get(`http://localhost:9000/slpp/petitioner?email=${lowerCaseEmail}`);
      if (adminResponse.data.role === 'admin') {
        navigate('/admin')
      } else {
      navigate('/');
      }

    } catch (err) {
      console.log(err);
      setError('Login failed')

    }
  };

  return (
    <div className='loginContainer'>
      <form className='loginForm' onSubmit={loginHandler}>
        <h1>Shangri-La Petition Platform</h1>
        <h2>Login</h2>

        <label className='email' htmlFor="Email">
          Email: <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>

        <label className='password' htmlFor="Password">
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
