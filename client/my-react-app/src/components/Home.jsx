// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>Welcome to PDF Generator</h1>
      <Link to="/create-pdf">Create PDF</Link>
      <Link to="/admin">Admin</Link>
    </div>
  );
};

export default Home;
