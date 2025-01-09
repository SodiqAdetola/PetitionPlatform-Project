import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreatePetition() {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const email = localStorage.getItem('email'); // Get logged-in user's email
      if (!email) {
        setError('Email retrieval failed');
        return;
      }

      const response = await axios.post('http://localhost:9000/petition', {
        petitionTitle: title,
        petitionText: text,
        petitioner: email,
      });

      setSuccess('Petition created successfully!');
      setError('');
      setTitle('');
      setText('');

      // Redirect to petitions page or dashboard
      setTimeout(() => {
        navigate('/viewPetitions');
      }, 1000); 

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'An error occurred while creating the petition.');
      setSuccess('');
    }
  };

  return (
    <div>
      <NavBar />

      <div className="formContainer">
        <h1>Create Petition</h1>

        <form onSubmit={handleSubmit}>
          <label>
            Petition Title: <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </label>

          <label>
            Petition Text: <textarea value={text} onChange={(e) => setText(e.target.value)} required />
          </label>

          <button type="submit">Submit Petition</button>
        </form>
      </div>
    </div>
  );
}

export default CreatePetition;
