import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear local storage
    localStorage.clear();

    // Redirect to login page or home page
    navigate('/');
  }, [navigate]);

  return <div>Logging out...</div>;
};

export default Logout;
