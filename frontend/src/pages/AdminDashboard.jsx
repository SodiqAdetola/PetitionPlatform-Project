import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Petition from '../components/Petition';
import '../styles/AdminDashboard.css'
import { RiAdminFill } from "react-icons/ri";

import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, CategoryScale } from 'chart.js'; 
Chart.register(ArcElement, Tooltip, Legend, CategoryScale); 


const AdminDashboard = () => {
  const [petitions, setPetitions] = useState([]);
  const [threshold, setThreshold] = useState(0);
  const [filteredPetitions, setFilteredPetitions] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchPetitionsAndThreshold = async () => {
      try {
        // Fetch petitions
        const petitionsResponse = await axios.get('http://localhost:9000/slpp/petitions');
        setPetitions(petitionsResponse.data);

        // Fetch the current threshold
        const thresholdResponse = await axios.get('http://localhost:9000/slpp/threshold');
        setThreshold(thresholdResponse.data.threshold);

        // Initially display active petitions
        const activePetitions = petitionsResponse.data.filter(petition => petition.status === 'open');
        setFilteredPetitions(activePetitions);


      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchPetitionsAndThreshold();
  }, []);

  const filterPetitionsByThreshold = () => {
    // Filter petitions that have signatures >= threshold and are open
    const petitionsAboveThreshold = petitions.filter(petition =>
      petition.signitures >= threshold && petition.status === 'open'
    );
    setFilteredPetitions(petitionsAboveThreshold);
  };

  const filterClosedPetitions = () => {
    // Filter petitions that are closed
    const closedPetitions = petitions.filter(petition => petition.status === 'closed');
    setFilteredPetitions(closedPetitions);
  };

  const filterActivePetitions = () => {
    // Filter petitions that are open
    const activePetitions = petitions.filter(petition => petition.status === 'open');
    setFilteredPetitions(activePetitions);
  };

  const updateThreshold = async () => {
    try {
      await axios.post('http://localhost:9000/slpp/threshold', { value: threshold });

      filterPetitionsByThreshold();

      setMessage('Threshold updated successfully!');
      setTimeout(() => setMessage(''), 2000);

    } catch (err) {
      console.error('Error updating threshold:', err);
      setMessage('Failed to update threshold');
      
      setTimeout(() => setMessage(''), 2000);
    }
  };

  const handleRespond = async (petitionId, responseText) => {
    try {
      const response = await axios.post(`http://localhost:9000/slpp/response`, {
        id: petitionId,
        response: responseText,
      });

      // Update petitions to reflect the closed status and response
      setPetitions((prev) =>
        prev.map((p) =>
          p._id === petitionId ? { ...p, response: responseText, status: 'closed' } : p
        )
      );

      setFilteredPetitions((prev) =>
        prev.map((p) =>
          p._id === petitionId ? { ...p, response: responseText, status: 'closed' } : p
        )
      );

      setMessage('Response submitted successfully!');
      setTimeout(() => setMessage(''), 500);
      
    } catch (error) {
      console.error('Error submitting response:', error);
      setMessage('Failed to submit response');
      setTimeout(() => setMessage(''), 500);
    }
  };



//Pie chart
  const openPetitions = petitions.filter(petition => petition.status === 'open');
  const petitionsAboveThreshold = openPetitions.filter(petition => petition.signitures >= threshold);
  
  const chartData = {
    labels: ['Open Petitions Reached Threshold', 'Open Petitions Below Threshold'],
    datasets: [
      {
        data: [petitionsAboveThreshold.length, openPetitions.length - petitionsAboveThreshold.length],
        backgroundColor: ['#2ecc71', '#e74c3c'],
        hoverBackgroundColor: ['#27ae60', '#c0392b'],
      },
    ],
  };
  const chartOptions = {
    responsive: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        enabled: false,
      },
    },
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
          <div className="chartContainer">
            <Pie data={chartData} options={chartOptions} />
          </div>
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
                onRespond={handleRespond}
              />
            </div>
          ))) : (
            <p className='notFound'>No petitions found.</p>
          )
          }
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
