import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/CreatePetition.css'


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

      const response = await axios.post('http://localhost:9000/slpp/petition', {
        petitionTitle: title,
        petitionText: text,
        petitioner: email,
      });

      setSuccess('Petition created successfully!');
      setError('');
      setTitle('');
      setText('');

      // Redirect to view page after creation success
      navigate('/viewPetitions');
     

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'An error occurred while creating the petition.');
      setSuccess('');
    }
  };

  return (
    <div className='createContainer createPetitionBackground'>
      <h1>Create Petition</h1>
      <hr />
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <label className='title'>
            Petition Title: <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </label>

          <label className='text'>
            Petition Text: <textarea value={text} onChange={(e) => setText(e.target.value)} required />
          </label>

          <button type="submit">Submit Petition</button>
        </form>
      </div>
    </div>
  );
}

export default CreatePetition;