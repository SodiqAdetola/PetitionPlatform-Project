import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';

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
        const response = await axios.get(`http://localhost:9000/petitioner?email=${email}`);
        const serverSignedPetitions = response.data.signedPetitions || [];

        // Merge with locally stored signed petitions
        const localSignedPetitions = JSON.parse(localStorage.getItem('userSignedPetitions')) || [];
        const mergedSignedPetitions = Array.from(new Set([...serverSignedPetitions, ...localSignedPetitions]));

        setUserSignedPetitions(mergedSignedPetitions);
        localStorage.setItem('userSignedPetitions', JSON.stringify(mergedSignedPetitions));
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
      await axios.post(`http://localhost:9000/petition/${petitionId}`, { email });

      const updatedSignedPetitions = [...userSignedPetitions, petitionId];
      setUserSignedPetitions(updatedSignedPetitions);
      localStorage.setItem('userSignedPetitions', JSON.stringify(updatedSignedPetitions));

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
      <NavBar />
      <h1>View Petitions</h1>
      <div className="petition-list">
        {petitions.map((petition) => (
          <div key={petition._id} className="petition-item">
            <div className="petition-header" onClick={() => toggleExpand(petition._id)}>
              <h2>{petition.petitionTitle}</h2>
            </div>

            {expandedPetitionId === petition._id && (
              <div className="petition-details">
                <p>{petition.petitionText}</p>
                {userSignedPetitions.includes(petition._id) ? (
                  <div>
                    <button className="signed-btn" disabled>
                      Already Signed
                    </button>
                    <p style={{ color: 'green' }}>{signingMessage[petition._id] || 'You have already signed this petition.'}</p>
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
