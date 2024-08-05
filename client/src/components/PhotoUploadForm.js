// src/components/PhotoUploadForm.js

import React, { useState } from 'react';
import axios from 'axios';

const PhotoUploadForm = ({ onUpload }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
        console.log(file);
      const response = await axios.post('/api/uploadMulti', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onUpload(response.data);  // Trigger callback to refresh data after upload
    } catch (error) {
      console.log('Error uploading file:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} />
      <button type="submit">Upload</button>
    </form>
  );
};

export default PhotoUploadForm;

