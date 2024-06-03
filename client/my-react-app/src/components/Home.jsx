// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Import the CSS file

const Home = () => {
  return (
    <div className="container"> {/* Add class name for container */}
      <h1>Welcome to PDF Generator</h1>
      <Link to="/create-pdf" className="link">Create PDF</Link> {/* Add class name for links */}
      <Link to="/admin" className="link">Admin</Link> {/* Add class name for links */}
    </div>
  );
};

export default Home;
