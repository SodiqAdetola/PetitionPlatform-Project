import React, { useState, useEffect } from 'react';
import '../styles/Petition.css';
import { FaUserCircle } from "react-icons/fa";
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function Petition({ petition, thresholdValue, isSigned, onSign, hideSignButton = false, onRespond }) {
  const location = useLocation();
  const isAdminDashboard = location.pathname === '/admin';
  const [isResponseVisible, setIsResponseVisible] = useState(false);
  const [responseText, setResponseText] = useState(petition.response || '');
  const [isClosed, setIsClosed] = useState(petition.status === 'Closed');

  useEffect(() => {
    setIsClosed(petition.status === 'closed');
  }, [petition.status]);

  const toggleResponseForm = () => {
    setIsResponseVisible(!isResponseVisible);
    if (petition.response && !isResponseVisible) {
      // for existing response, pre-fill form with it
      setResponseText(petition.response);
    } else {
      // If no response or canceled, reset form
      setResponseText('');
    }
  };

  const handleResponseSubmit = () => {
    if (responseText.trim() !== '') {
      onRespond(petition._id, responseText);
      setIsResponseVisible(false); // Close form after submission
    }
  };

  return (
    <div className={`petitionItem ${isClosed ? 'closedPetition' : ''}`}>
      <div className="topItems">
        <div className={`status ${isClosed ? 'closedStatus' : ''}`}>Status: {petition.status}</div>
        <h3>{petition.petitionTitle}</h3>
        <p className="content">{petition.petitionText}</p>
      </div>

      <div className="bottomItems">
        <p><FaUserCircle className="userIcon" size={20} /> {petition.petitioner}</p>
        <div className="signiture">
          <p>Signatures:</p>
          <p className="signitureCount"> {petition.signitures}</p>
        </div>

        {!isAdminDashboard && !isClosed && (
          <>
            {!hideSignButton && (
              isSigned ? (
                <button className="signedButton" disabled>Signed</button>
              ) : (
                <button className="signButton" onClick={() => onSign(petition._id)}>Sign Petition</button>
              )
            )}
          </>
        )}

        {isAdminDashboard && (petition.signitures >= thresholdValue) && (
          <>
            <div className="responseSection">
              <button className="responseButton" onClick={toggleResponseForm}>
                {petition.response && !isResponseVisible ? 'View Response' : 
                isResponseVisible ? 'Cancel' : 'Respond to Petition'}
              </button>

              {isResponseVisible && (
                <div className="responseForm">
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Enter your response"
                  />
                  <button className="submitResponseButton" onClick={handleResponseSubmit}>
                    {petition.response ? 'Resubmit Response' : 'Submit Response'}
                  </button>
                </div>
              )}
            </div>
          </>
        )}

      </div>

      {isClosed && petition.response && !isAdminDashboard && (
          <div className="userResponse">
            <p className='headerText'>Admin Response:</p>
            <p>{petition.response}</p>
          </div>
        )}

    </div>

    
  );
}

export default Petition;
