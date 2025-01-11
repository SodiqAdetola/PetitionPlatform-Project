import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Petition from '../components/Petition';
import '../styles/AdminDashboard.css'
import { RiAdminFill } from "react-icons/ri";

const AdminDashboard = () => {
  const [petitions, setPetitions] = useState([]);
  const [threshold, setThreshold] = useState(0);
  const [filteredPetitions, setFilteredPetitions] = useState([]);
  const [message, setMessage] = useState('');  // State for success/error message

  useEffect(() => {
    const fetchPetitionsAndThreshold = async () => {
      try {
        // Fetch petitions from the server
        const petitionsResponse = await axios.get('http://localhost:9000/petitions');
        setPetitions(petitionsResponse.data);

        // Fetch the current threshold from the server
        const thresholdResponse = await axios.get('http://localhost:9000/threshold');
        setThreshold(thresholdResponse.data.threshold);

        // Initially display all petitions
        setFilteredPetitions(petitionsResponse.data);

      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchPetitionsAndThreshold();
  }, []);

  const filterPetitionsByThreshold = () => {
    // Filter petitions that have signatures >= threshold and are Open
    const petitionsAboveThreshold = petitions.filter(petition =>
      petition.signitures >= threshold && petition.status === 'Open'
    );
    setFilteredPetitions(petitionsAboveThreshold);
  };

  const filterClosedPetitions = () => {
    // Filter petitions that are closed
    const closedPetitions = petitions.filter(petition => petition.status === 'Closed');
    setFilteredPetitions(closedPetitions);
  };

  const filterActivePetitions = () => {
    // Filter petitions that are open
    const activePetitions = petitions.filter(petition => petition.status === 'Open');
    setFilteredPetitions(activePetitions);
  };

  const updateThreshold = async () => {
    try {
      // Send the new threshold value to the backend
      await axios.post('http://localhost:9000/threshold', { value: threshold });

      // After updating the threshold, filter the petitions
      filterPetitionsByThreshold();
      
      // Display success message
      setMessage('Threshold updated successfully!');
      
      // Hide message after 2 seconds
      setTimeout(() => setMessage(''), 2000);

    } catch (err) {
      console.error('Error updating threshold:', err);
      setMessage('Failed to update threshold');
      
      // Hide error message after 2 seconds
      setTimeout(() => setMessage(''), 2000);
    }
  };

  const handleRespond = async (petitionId, responseText) => {
    try {
      const response = await axios.post(`http://localhost:9000/response`, {
        id: petitionId,
        response: responseText,
      });

      // Update petitions to reflect the closed status and response
      setPetitions((prev) =>
        prev.map((p) =>
          p._id === petitionId ? { ...p, response: responseText, status: 'Closed' } : p
        )
      );

      setFilteredPetitions((prev) =>
        prev.map((p) =>
          p._id === petitionId ? { ...p, response: responseText, status: 'Closed' } : p
        )
      );
      
      // Display success message
      setMessage('Response submitted successfully!');
      
      // Hide message after 2 seconds
      setTimeout(() => setMessage(''), 500);
      
    } catch (error) {
      console.error('Error submitting response:', error);
      setMessage('Failed to submit response');
      
      // Hide error message after 2 seconds
      setTimeout(() => setMessage(''), 500);
    }
  };

  return (
    <div className="adminDashboard">
      <RiAdminFill size={100} className='adminLogo'/>
      <div className="profileSection">
        <h1>Admin Dashboard</h1>
        <div className="adminProfile">
          <p>Welcome, Petitions Committee</p>
        </div>
      </div>

    
      <h2>Set Signature Threshold</h2>
      <div className="thresholdSection">
        <input 
          type="number" 
          value={threshold} 
          onChange={(e) => setThreshold(e.target.value)} 
          placeholder="Enter threshold"
        />
        <button onClick={updateThreshold}>Apply Threshold</button>
        
      </div>
      {message && (<p className="message">{message}</p>)}


      <div className="petitionsSection">
        <div className='bottomContainer'>
          <h2>Petitions</h2>
          <div className='listingContainer'>
            <button onClick={filterActivePetitions}>View Open Petitions</button>
            <button onClick={filterPetitionsByThreshold}>View Petitions Reached Threshold</button>
            <button onClick={filterClosedPetitions}>View Closed Petitions</button>
          </div>
        </div>
        <div className="petitionList">
        {filteredPetitions.length > 0 ? (
          filteredPetitions.map(petition => (
            <div key={petition._id} className="petitionCard">
              <Petition 
                petition={petition}
                thresholdValue={threshold}
                onRespond={handleRespond}
              />
            </div>
          ))) : (
            <p className='notFoundMessage'>No petitions found.</p>
          )
          }
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
