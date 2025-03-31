import React from 'react';

const InfoIcon = ({ onClick, isSelected }) => {
  const iconStyle = {
    width: '44px',
    height: '24px',
    padding: '4px',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    backgroundColor: isSelected ? '#4A5568' : '#3E3F5B',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '28px',
    left: '-32px',
    transition: 'all 0.2s ease',
    cursor: 'pointer'
  };

  return (
    <div style={iconStyle} onClick={onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '24px', height: '24px' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
      </svg>
      <p style={{ fontSize: '12px', fontWeight: 'bold', color: 'white' }}>Info</p>
    </div>
  );
};

export default InfoIcon; 