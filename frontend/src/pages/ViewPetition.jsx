import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ViewPetition() {
  const [petitions, setPetitions] = useState([]);
  const [expandedPetitionId, setExpandedPetitionId] = useState(null);
  const [userSignedPetitions, setUserSignedPetitions] = useState([]);
  const [signingMessage, setSigningMessage] = useState({});

  // Fetch petitions and user-signed petitions on component load
  useEffect(() => {
    const fetchPetitions = async () => {
      try {
        const response = await axios.get('http://localhost:9000/petitions');
        setPetitions(response.data);
      } catch (err) {
        console.error('Error fetching petitions:', err);
      }
    };

    const fetchUserData = async () => {
      try {
        const email = localStorage.getItem('email');
        if (!email) {
          // If no email is available, skip fetching user data
          return;
        }

        // Get the user's signed petitions from the server
        const response = await axios.get(`http://localhost:9000/petitioner?email=${email}`);
        const serverSignedPetitions = response.data.signedPetitions || [];
        
        setUserSignedPetitions(serverSignedPetitions);
      } catch (err) {
        console.error('Error fetching petitioner data:', err);
      }
    };

    fetchPetitions();
    fetchUserData();
  }, []);

  const toggleExpand = (petitionId) => {
    setExpandedPetitionId((prevId) => (prevId === petitionId ? null : petitionId));
  };

  const handleSignPetition = async (petitionId) => {
    try {
      const email = localStorage.getItem('email');
      if (!email) {
        setSigningMessage((prev) => ({
          ...prev,
          [petitionId]: 'You must be logged in to sign a petition.',
        }));
        return;
      }

      // Sign the petition on the server
      await axios.post(`http://localhost:9000/petition/${petitionId}`, { email });

      // Update the local signed petitions list
      const updatedSignedPetitions = [...userSignedPetitions, petitionId];
      setUserSignedPetitions(updatedSignedPetitions);

      // Dynamically update the signature count
      setPetitions((prevPetitions) =>
        prevPetitions.map((petition) =>
          petition._id === petitionId
            ? { ...petition, signitures: petition.signitures + 1 }
            : petition
        )
      );

      setSigningMessage((prev) => ({
        ...prev,
        [petitionId]: 'You have successfully signed this petition.',
      }));
    } catch (err) {
      console.error('Error signing petition:', err);
      setSigningMessage((prev) => ({
        ...prev,
        [petitionId]: err.response?.data?.message || 'Failed to sign petition.',
      }));
    }
  };

  return (
    <div>
      <h1>View Petitions</h1>
      <div className="petition-list">
        {petitions.map((petition) => (
          <div key={petition._id} className="petition-item">
            <div className="petition-header" onClick={() => toggleExpand(petition._id)}>
              <h2>Title: {petition.petitionTitle}</h2>
            </div>

            {expandedPetitionId === petition._id && (
              <div className="petition-details">
                <p>Content: {petition.petitionText}</p>
                <p>By {petition.petitioner}</p>
                {userSignedPetitions.includes(petition._id) ? (
                  <div>
                    <button className="signed-btn" disabled>
                      Already Signed
                    </button>
                    <p style={{ color: 'green' }}>
                      {signingMessage[petition._id] || 'You have already signed this petition.'}
                    </p>
                  </div>
                ) : (
                  <div>
                    <button className="sign-btn" onClick={() => handleSignPetition(petition._id)}>
                      Sign Petition
                    </button>
                    <p style={{ color: 'blue' }}>{signingMessage[petition._id]}</p>
                  </div>
                )}
                <p>Signatures: {petition.signitures}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ViewPetition;
