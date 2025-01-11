import React, { useState, useEffect } from 'react';
import '../styles/Petition.css';
import { FaUserCircle } from "react-icons/fa";
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function Petition({ petition, isSigned, onSign, hideSignButton = false, onRespond }) {
  const location = useLocation();
  const isAdminDashboard = location.pathname === '/admin';
  const [isResponseVisible, setIsResponseVisible] = useState(false);
  const [responseText, setResponseText] = useState(petition.response || '');
  const [isClosed, setIsClosed] = useState(petition.status === 'Closed');

  useEffect(() => {
    setIsClosed(petition.status === 'Closed');
  }, [petition.status]);

  const toggleResponseForm = () => {
    setIsResponseVisible(!isResponseVisible);
  };

  const handleResponseSubmit = () => {
    if (responseText.trim() !== '') {
      onRespond(petition._id, responseText); // Call parent to handle response update
      setIsResponseVisible(false); // Close the form
    }
  };

  return (
    <div className="petitionItem">
      <div className="topItems">
        <div className="status">Status: {petition.status}</div>
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

        {isAdminDashboard && (
          <>
            <div className="responseSection">
              <button className="responseButton" onClick={toggleResponseForm}>
                {isResponseVisible ? 'Cancel Response' : 'Respond to Petition'}
              </button>

              {isResponseVisible && !isClosed && (
                <div className="responseForm">
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Enter your response"
                  />
                  <button className="submitResponseButton" onClick={handleResponseSubmit}>
                    Submit Response
                  </button>
                </div>
              )}
            </div>

            {isClosed && petition.response && (
              <div className="adminResponse">
                <h4>Admin Response:</h4>
                <p>{petition.response}</p>
                {isAdminDashboard && !isResponseVisible && (
                  <button className="editResponseButton" onClick={toggleResponseForm}>Edit Response</button>
                )}
              </div>
            )}
          </>
        )}

        {isClosed && petition.response && !isAdminDashboard && (
          <div className="userResponse">
            <h4>Admin Response:</h4>
            <p>{petition.response}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Petition;

