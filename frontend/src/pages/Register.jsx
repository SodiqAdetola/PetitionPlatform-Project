import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import QRScanner from 'react-qr-scanner';
import '../styles/Register.css'

function Register() {
  const [fullName, setFullName] = useState('');
  const [DoB, setDoB] = useState('');
  const [bioID, setBioID] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  const [error, setError] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);

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

      const backendResponse = await axios.post('http://localhost:9000/slpp/petitioner', {
        fullName,
        DoB,
        bioID,
        email: lowerCaseEmail,
        password
      });

      if (backendResponse.data.message === 'Registration successful') {
        const firebaseResponse = await createUserWithEmailAndPassword(auth, lowerCaseEmail, password);
        console.log(firebaseResponse, 'Firebase Registration Successful');
        
        localStorage.setItem('email', lowerCaseEmail);
        navigate('/'); 
      }

    } catch (err) {
      console.log(err.message)
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } 
      else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  const handleScan = (data) => {
    if (data) {
      setBioID(data.text);  // Set BioID with scanned data text
      setIsScannerOpen(false); 
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  return (
    <div className='registerContainer'>
      <form className='registerForm' onSubmit={registerHandler}>
        <h1>Shangri-La Petition Platform</h1>
        <h2>Register</h2>

        <label className='name' htmlFor="Name">
          Full Name: <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </label>

        <label className='dob' htmlFor="DoB">
          Date of Birth: <input type="date" value={DoB} onChange={(e) => setDoB(e.target.value)} />
        </label>

        <label className='bioID' htmlFor="bioID">
          Biometric ID:
          <input 
            type="text" 
            value={bioID} 
            onChange={(e) => setBioID(e.target.value)} 
            placeholder="Scan QR or enter manually" 
          />
          <button type="button" className='scanButton' onClick={() => setIsScannerOpen(true)}>Scan QR</button>
        </label>

        <label className='email' htmlFor="Email">
          Email: <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>

        <label className='password' htmlFor="Password">
          Password: <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>

        {error && <p className="errorMessage">{error}</p>} 

        <button type="submit" className='submitButton'>Register</button>
        <p>Already have an account? <a href="/Login">Login here.</a></p>
      </form>

      {isScannerOpen && (
        <div className="scannerContainer">
          <QRScanner
            className='scanner'
            delay={300} 
            onScan={handleScan} 
            onError={handleError} 
          />
          <button className='scanButton' onClick={() => setIsScannerOpen(false)}>Close Scanner</button>
        </div>
      )}
    </div>
  );
}

export default Register;
