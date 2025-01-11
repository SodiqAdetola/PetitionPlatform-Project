import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Petition from '../components/Petition';
import '../styles/AdminDashboard.css'

const AdminDashboard = () => {
  const [petitions, setPetitions] = useState([]);
  const [threshold, setThreshold] = useState(0);
  const [filteredPetitions, setFilteredPetitions] = useState([]);

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
    console.log(threshold)
  };

  const filterClosedPetitions = () => {
    // Filter petitions that are closed
    const closedPetitions = petitions.filter(petition => petition.status === 'Closed');
    setFilteredPetitions(closedPetitions);
  };

  const filterActivePetitions = () => {
    // Filter petitions that are closed
    const closedPetitions = petitions.filter(petition => petition.status === 'Open');
    setFilteredPetitions(closedPetitions);
  };

  const updateThreshold = async () => {
    try {
      // Send the new threshold value to the backend
      await axios.post('http://localhost:9000/threshold', { value: threshold });

      // After updating the threshold, filter the petitions
      filterPetitionsByThreshold();
      alert('Threshold updated successfully!');
    } catch (err) {
      console.error('Error updating threshold:', err);
      alert('Failed to update threshold');
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
    } catch (error) {
      console.error('Error submitting response:', error);
      alert('Failed to submit response');
    }
  };

  return (
    <div className="adminDashboard">
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

      <div className="petitionsSection">
        <div className='bottomContainer'>
        <h2>Petitions</h2>
        <div className='listingContainer'>
        <button onClick={() => setFilteredPetitions(petitions)}>View All Petitions</button>
        <button onClick={filterActivePetitions}>View Open Petitions</button>
        <button onClick={filterPetitionsByThreshold}>View Petitions Reached Threshold</button>
        <button onClick={filterClosedPetitions}>View Closed Petitions</button>
        </div>
        </div>
        <div className="petitionList">
          {filteredPetitions.map(petition => (
            <div key={petition._id} className="petitionCard">
              <Petition 
                petition={petition}
                thresholdValue={threshold}
                onRespond={handleRespond}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
