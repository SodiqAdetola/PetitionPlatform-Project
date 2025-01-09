import React from 'react';
import '../styles/Petition.css'

function Petition({ petition, isSigned, onSign, hideSignButton = false }) {
  return (
    <div className="petitionItem">
      <div className='topItems'>
      <div className='status'>Status: {petition.status}</div>
      <h3>{petition.petitionTitle}</h3>
      <p className='content'>{petition.petitionText}</p>
      </div>
      <div className='bottomItems'>
      <p className='signitureCount'>Signatures: {petition.signitures}</p>

      {!hideSignButton && (
        isSigned ? (
          <button className="signedButton" disabled>
            Already Signed
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
