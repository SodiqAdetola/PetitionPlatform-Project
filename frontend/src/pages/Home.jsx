import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Petition from '../components/Petition';
import '../styles/Home.css'
import { FaUserCircle } from "react-icons/fa";


function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const email = localStorage.getItem('email'); // get current user email
        const response = await axios.get(`http://localhost:9000/slpp/petitioner?email=${email}`);
        setProfile(response.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to fetch profile');
      }
    };

    fetchProfile();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  if (!profile) {
    return   <div class="loadingContainer">
    <div class="spinner"></div>
    <p>Loading, please wait...</p>
  </div>;
  }

  return (
    <div className='homeContainer homeBackground'>
      <div className='pageContainer'>
      <h1>User Profile</h1>
      
      <div className="profileContainer">
        <FaUserCircle className='userIcon' size={100}/>
        <p className='name'>{profile.fullName}</p>
        <p>Email: {profile.email}</p>
        <p>Date of Birth: {new Date(profile.DoB).toLocaleDateString()}</p>
      </div>
      <hr />
      </div>
      <div className='signedContainer'>
      <h2>Your Signed Petitions</h2>
      <div className='petitionContainer'>
        {profile.signedPetitions.length > 0 ? (
          profile.signedPetitions.map((petition) => (
            <Petition key={petition._id} petition={petition} isSigned={true} hideSignButton={true} onSign={() => {}} className='petitionItem'/>
          ))
        ) : (
          <p>No signed petitions yet.</p>
        )}
      </div>
      </div>
    </div>
  );
}

export default UserProfile;
