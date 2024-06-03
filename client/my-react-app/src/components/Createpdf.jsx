// src/components/CreatePDF.js
import React, { useState } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './Createpdf.css'; // Import the CSS file

const CreatePDF = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [backCoverImage, setBackCoverImage] = useState(null);
  const [pages, setPages] = useState([{ content: '', backgroundImage: null, alignment: 'left' }]);

  const handlePageContentChange = (index, content) => {
    const newPages = [...pages];
    newPages[index].content = content;
    setPages(newPages);
  };

  const handlePageAlignmentChange = (index, alignment) => {
    const newPages = [...pages];
    newPages[index].alignment = alignment;
    setPages(newPages);
  };

  const handlePageBackgroundChange = (index, image) => {
    const newPages = [...pages];
    newPages[index].backgroundImage = image;
    setPages(newPages);
  };

  const handleAddPage = () => {
    setPages([...pages, { content: '', backgroundImage: null, alignment: 'left' }]);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('coverImage', coverImage);
    formData.append('backCoverImage', backCoverImage);
    formData.append('pages', JSON.stringify(pages));

    try {
      const response = await axios.post('https://ev3-fullstack-node.onrender.com/create-pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('PDF Created Successfully');
    } catch (error) {
      console.error(error);
      alert('Error creating PDF');
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="form-container">
      <div>
        <label>Title</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <label>Author</label>
        <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} required />
      </div>
      <div>
        <label>Cover Image</label>
        <input type="file" onChange={(e) => setCoverImage(e.target.files[0])} required />
      </div>
      <div>
        <label>Back Cover Image</label>
        <input type="file" onChange={(e) => setBackCoverImage(e.target.files[0])} required />
      </div>
      <div className="pages-container">
        <label>Pages</label>
        {pages.map((page, index) => (
          <div key={index} className="page">
            <ReactQuill value={page.content} onChange={(content) => handlePageContentChange(index, content)} className="react-quill" />
            <select value={page.alignment} onChange={(e) => handlePageAlignmentChange(index, e.target.value)} className="page-alignment-select">
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
            <input type="file" onChange={(e) => handlePageBackgroundChange(index, e.target.files[0])} />
          </div>
        ))}
        <button type="button" onClick={handleAddPage} className="add-page-button">Add Page</button>
      </div>
      <button type="submit" >Create PDF</button>
    </form>
  );
};

export default CreatePDF;
