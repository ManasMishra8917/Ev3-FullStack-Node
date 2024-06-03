import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DownloadPDF = () => {
  const [pdfs, setPdfs] = useState([]);

  useEffect(() => {
    const fetchPDFs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/pdfs');
        setPdfs(response.data);
      } catch (error) {
        console.error('Error fetching PDFs:', error);
      }
    };
    fetchPDFs();
  }, []);

  const handleDownloadPDF = async (pdfId) => {
    try {
      const response = await axios.get(`http://localhost:5000/download-pdf/${pdfId}`, {
        responseType: 'blob', // Set response type to blob
      });
      // Create a blob URL for the PDF
      const url = window.URL.createObjectURL(new Blob([response.data]));
      // Create a link element
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `pdf_${pdfId}.pdf`); // Set the download attribute
      // Append the link to the body and click it programmatically
      document.body.appendChild(link);
      link.click();
      // Remove the link element from the body
      document.body.removeChild(link);
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
