import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [fullName, setFullName] = useState('');
  const [DoB, setDoB] = useState('');
  const [bioID, setBioID] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  const [error, setError] = useState('');

  const registerHandler = async (e) => {
    e.preventDefault();

    if (!fullName || !DoB || !bioID || !email || !password) {
      setError('Missing Field(s)!')
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Invalid email.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    
    try {
      const lowerCaseEmail = email.toLowerCase();

      const backendResponse = await axios.post('http://localhost:9000/petitioner', {
        fullName,
        DoB,
        bioID,
        email: lowerCaseEmail,
        password
      });

   
      if (backendResponse.data.message === 'Registration successful') {
        const firebaseResponse = await createUserWithEmailAndPassword(auth, lowerCaseEmail, password);
        console.log(firebaseResponse, 'Firebase Registration Successful');
        
        localStorage.setItem('email', lowerCaseEmail)
        navigate('/'); 
      }

    } catch (firebaseError) {
      console.log(firebaseError.message)
      // Step 3: Handle Firebase errors, including email already in use
      if (firebaseError.code === 'auth/email-already-in-use') {
        setError('This email is already associated with an existing account.');

      } else if (firebaseError.code === 'auth/weak-password') {
        setError('The password is too weak. It must be at least 6 characters long.');

      } else {
        setError('An unexpected error occurred with Firebase. Please try again.');
      }
    }
  };

  return (
    <div className='registerContainer'>
      <form className='registerForm' onSubmit={registerHandler}>
        <h2>Register</h2>

        <label htmlFor="Name">
          Full Name: <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </label>

        <label htmlFor="DoB">
          Date of Birth: <input type="date" value={DoB} onChange={(e) => setDoB(e.target.value)} />
        </label>

        <label htmlFor="bioID">
          Biometric ID: <input type="text" value={bioID} onChange={(e) => setBioID(e.target.value)} />
        </label>

        <label htmlFor="Email">
          Email: <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>

        <label htmlFor="Password">
          Password: <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>

        {error && <p className="errorMessage">{error}</p>} 

        <button type="submit">Register</button>
        <p>Already have an account? <a href="/Login">Login here.</a></p>
      </form>
    </div>
  );
}

export default Register;
