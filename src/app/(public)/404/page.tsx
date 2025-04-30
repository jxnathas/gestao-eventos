import React from 'react';
import { useRouter } from 'next/router';

const NotFoundPage = () => {
  const router = useRouter();

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1 style={{ fontSize: '3rem', color: '#ff0000' }}>404</h1>
      <p style={{ fontSize: '1.5rem' }}>Oops! The page you are looking for does not exist.</p>
      <button
        onClick={() => router.push('/')}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          fontSize: '1rem',
          backgroundColor: '#0070f3',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Go Back to Home
      </button>
    </div>
  );
};

export default NotFoundPage;