import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Petition from '../components/Petition';
import '../styles/ViewPetition.css';

function ViewPetition() {
  const [petitions, setPetitions] = useState([]); // Stores all petitions
  const [userSignedPetitions, setUserSignedPetitions] = useState([]); // Stores signed petition IDs
  const [filter, setFilter] = useState('open'); // Stores the current filter state ('open' or 'closed')

  // Fetch petitions and user-signed petitions on component load
  useEffect(() => {
    const fetchPetitions = async () => {
      try {
        const petitionResponse = await axios.get('http://localhost:9000/petitions');
        setPetitions(petitionResponse.data);
      } catch (err) {
        console.error('Error fetching petitions:', err);
      }
    };

    const fetchUserSignedPetitions = async () => {
      try {
        const email = localStorage.getItem('email');
        if (!email) {
          return; // Skip if no email is found in localStorage
        }

        const userResponse = await axios.get(`http://localhost:9000/petitioner?email=${email}`);
        const signedPetitions = userResponse.data.signedPetitions.map((p) => p._id); // Extract petition IDs
        setUserSignedPetitions(signedPetitions);
      } catch (err) {
        console.error('Error fetching signed petitions:', err);
      }
    };

    fetchPetitions();
    fetchUserSignedPetitions();
  }, []);

  // Function to dynamically update signed petitions
  const handleSignPetition = async (petitionId) => {
    try {
      const email = localStorage.getItem('email');
      if (!email) {
        alert('You must be logged in to sign a petition.');
        return;
      }

      await axios.post(`http://localhost:9000/petition/${petitionId}`, { email });

      // Update signed petitions and increment signatures dynamically
      setUserSignedPetitions((prevSigned) => [...prevSigned, petitionId]);
      setPetitions((prevPetitions) =>
        prevPetitions.map((petition) =>
          petition._id === petitionId
            ? { ...petition, signitures: petition.signitures + 1 }
            : petition
        )
      );
    } catch (err) {
      console.error('Error signing petition:', err);
      alert('Failed to sign the petition.');
    }
  };

  // Filter petitions based on the current filter state
  const filteredPetitions = petitions.filter((petition) => 
    petition.status.toLowerCase() === filter.toLowerCase()
  );

  return (
    <div className='viewContainer'>
      <h1>View Petitions</h1>
      
      
      {/* Buttons for filtering petitions */}
      <div className="filterButtons">
        <button onClick={() => setFilter('open')} className={filter === 'open' ? 'active' : ''}>
          Open Petitions
        </button>
        <button onClick={() => setFilter('closed')} className={filter === 'closed' ? 'active' : ''}>
          Closed Petitions
        </button>
      </div>

      <div className="petitionList">
        {filteredPetitions.length > 0 ? (
          filteredPetitions.map((petition) => (
            <Petition
              key={petition._id}
              petition={petition}
              isSigned={userSignedPetitions.includes(petition._id)}
              onSign={handleSignPetition}
              className='petition'
            />
          ))
        ) : (
          <p>No petitions found.</p>
        )}
      </div>
    </div>
  );
}

export default ViewPetition;
