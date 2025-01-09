import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';

function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const email = localStorage.getItem('email');
        const response = await axios.get(`http://localhost:9000/petitioner?email=${email}`);
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
    return <p>Loading profile...</p>;
  }

  return (
    <div>
      <NavBar />
      <h1>User Profile</h1>
      <div className="profile-container">
        <p><strong>Full Name:</strong> {profile.fullName}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Date of Birth:</strong> {new Date(profile.DoB).toLocaleDateString()}</p>
        <h2>Signed Petitions</h2>
        <ul>
          {profile.signedPetitions.map((petition) => (
            <li key={petition._id}>{petition.petitionTitle}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default UserProfile;
