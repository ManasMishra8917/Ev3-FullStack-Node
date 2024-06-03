// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import CreatePDF from './components/Createpdf';
import DownloadPDF from './components/Downloadpdf';
// import Admin from './components/Admin';

function App() {
  return (
    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-pdf" element={<CreatePDF />} />
        <Route path="/pdfs" element=<DownloadPDF /> />
        {/* Uncomment and create the Admin component if needed */}
        {/* <Route path="/admin" element={<Admin />} /> */}
      </Routes>
   
  );
}

export default App;
