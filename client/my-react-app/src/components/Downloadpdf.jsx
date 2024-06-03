import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DownloadPDF = () => {
  const [pdfs, setPdfs] = useState([]);

  useEffect(() => {
    const fetchPDFs = async () => {
      try {
        const response = await axios.get('https://ev3-fullstack-node.onrender.com/pdfs');
        setPdfs(response.data);
      } catch (error) {
        console.error('Error fetching PDFs:', error);
      }
    };
    fetchPDFs();
  }, []);

  const handleDownloadPDF = async (pdfId) => {
    try {
      const response = await axios.get(`https://ev3-fullstack-node.onrender.com/download-pdf/${pdfId}`, {
        responseType: 'blob', // Set response type to blob
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      // Open the PDF in a new tab
      window.open(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };
  
  return (
    <div>
      <h2>Available PDFs</h2>
      <ul>
        {pdfs.map((pdf) => (
          <li key={pdf._id}>
            {pdf.title} by {pdf.author}{' '}
            <button onClick={() => handleDownloadPDF(pdf._id)}>Download</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DownloadPDF;
