import React from 'react';
import '../styles/Petition.css'
import { FaUserCircle } from "react-icons/fa";


function Petition({ petition, isSigned, onSign, hideSignButton = false }) {
  return (
    <div className="petitionItem">
      <div className='topItems'>
      <div className='status'>Status: {petition.status}</div>
      <h3>{petition.petitionTitle}</h3>
      <p className='content'>{petition.petitionText}</p>
      </div>

      <div className='bottomItems'>
      <p><FaUserCircle className='userIcon' size={20}/> {petition.petitioner}</p>
      <div className='signiture'>
        <p>Signitures: </p>
        <p className='signitureCount'> {petition.signitures}</p>
      </div>
      {!hideSignButton && (
        isSigned ? (
          <button className="signedButton" disabled>
            Signed
          </button>
        ) : (
          <button className="signButton" onClick={() => onSign(petition._id)}>
            Sign Petition
          </button>
        )
      )}
    </div>
    </div>
  );
}

export default Petition;
