'use client';

import { useState, useEffect } from 'react';

export default function ClientLogoManage() {
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);

  const [uploadFiles, setUploadFiles] = useState([]);
  const [titles, setTitles] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    fetchLogos();
  }, []);

  const fetchLogos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth-token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch('/api/admin/clientLogo', {
        credentials: 'include',
        headers
      });

      const data = await response.json();
      if (response.ok) {
        setLogos(data.logos || []);
      } else {
        setError(data.error || 'Failed to fetch logos');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setUploadFiles(files);
    setTitles(files.map(f => f.name.split('.')[0]));
  };

  const removeFile = (indexToRemove) => {
    setUploadFiles(uploadFiles.filter((_, idx) => idx !== indexToRemove));
    setTitles(titles.filter((_, idx) => idx !== indexToRemove));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (uploadFiles.length === 0) {
      setError('Please select files to upload');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess(`⏳ Uploading ${uploadFiles.length} logo${uploadFiles.length > 1 ? 's' : ''}...`);

      const formData = new FormData();
      uploadFiles.forEach(file => formData.append('files', file));
      titles.forEach(title => formData.append('titles', title));

      const token = localStorage.getItem('auth-token');
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch('/api/admin/clientLogo', {
        method: 'POST',
        credentials: 'include',
        headers,
        body: formData
      });

      const data = await response.json();
      if (response.ok) {
        const successMsg = `✓ Successfully uploaded ${data.successCount} logo${data.successCount > 1 ? 's' : ''}!`;
        setSuccess(successMsg);
        
        if (data.errorCount > 0) {
          setError(`⚠️ ${data.errorCount} file${data.errorCount > 1 ? 's' : ''} failed to upload.`);
        }
        
        setUploadFiles([]);
        setTitles([]);
        document.getElementById('fileInput').value = '';
        fetchLogos();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch (err) {
      setError('Upload error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this logo?')) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('auth-token');
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`/api/admin/clientLogo/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess(data.message);
        fetchLogos();
        setTimeout(() => setSuccess(''), 2000);
      } else {
        setError(data.error || 'Delete failed');
      }
    } catch (err) {
      setError('Delete error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (logo) => {
    setEditingId(logo._id);
    setEditTitle(logo.title || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const handleUpdate = async (id) => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const token = localStorage.getItem('auth-token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`/api/admin/clientLogo/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers,
        body: JSON.stringify({ title: editTitle })
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('Logo updated successfully');
        setEditingId(null);
        setEditTitle('');
        fetchLogos();
        setTimeout(() => setSuccess(''), 2000);
      } else {
        setError(data.error || 'Update failed');
      }
    } catch (err) {
      setError('Update error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.style.opacity = '0.4';
  };

  const handleDragEnter = (e, index) => {
    e.preventDefault();
    if (draggedItem !== null && draggedItem !== index) {
      setDragOverItem(index);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOverItem(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, dropIndex) => {
    e.preventDefault();
    setDragOverItem(null);
    
    if (draggedItem === null || draggedItem === dropIndex) {
      return;
    }

    const newLogos = [...logos];
    const draggedLogo = newLogos[draggedItem];
    
    newLogos.splice(draggedItem, 1);
    newLogos.splice(dropIndex, 0, draggedLogo);
    
    setLogos(newLogos);

    try {
      const logoIds = newLogos.map(logo => logo._id);
      const token = localStorage.getItem('auth-token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch('/api/admin/clientLogo', {
        method: 'PUT',
        credentials: 'include',
        headers,
        body: JSON.stringify({
          action: 'reorder',
          logoIds
        })
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to reorder');
        fetchLogos();
      } else {
        setSuccess('Logos reordered successfully');
        setTimeout(() => setSuccess(''), 2000);
      }
    } catch (err) {
      setError('Reorder error: ' + err.message);
      fetchLogos();
    }
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
    setDraggedItem(null);
    setDragOverItem(null);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Client Logo Management</h2>
      
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
        <p className="text-sm">
          <strong>📋 Info:</strong> Upload client/partner logos (PNG or SVG format). These will appear in an infinite scrolling carousel on the homepage. Drag to reorder.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
          <button onClick={() => setError('')} className="ml-2 text-red-900">×</button>
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded">
          {success}
          <button onClick={() => setSuccess('')} className="ml-2 text-green-900">×</button>
        </div>
      )}

      <form onSubmit={handleUpload} className="mb-6 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
        <h3 className="text-lg font-semibold mb-3">Upload New Logos</h3>
        
        <div className="mb-3">
          <label className="block text-sm font-medium mb-2">
            Select Logo Files (PNG or SVG only)
          </label>
          <input
            id="fileInput"
            type="file"
            multiple
            accept="image/png,image/svg+xml"
            onChange={handleFileChange}
            className="block w-full text-sm border border-gray-300 rounded p-2 bg-white cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <p className="text-xs text-gray-500 mt-1">Accepted formats: PNG, SVG (max 5MB per file)</p>
        </div>
        
        {uploadFiles.length > 0 && (
          <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm font-medium text-blue-900">
              📁 {uploadFiles.length} file{uploadFiles.length > 1 ? 's' : ''} selected - All will be uploaded
            </p>
          </div>
        )}

        {uploadFiles.length > 0 && (
          <div className="space-y-4">
            {uploadFiles.map((file, idx) => (
              <div key={idx} className="p-4 border-2 border-blue-300 rounded-lg bg-white shadow-sm">
                <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-200">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {idx + 1}
                  </span>
                  <div className="flex-grow">
                    <p className="font-semibold text-sm text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(2)} KB • {file.type}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="flex-shrink-0 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded text-sm font-medium transition-colors"
                  >
                    Remove
                  </button>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Logo Title/Client Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={titles[idx] || ''}
                    onChange={(e) => {
                      const newTitles = [...titles];
                      newTitles[idx] = e.target.value;
                      setTitles(newTitles);
                    }}
                    placeholder="e.g., ABC Company"
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || uploadFiles.length === 0}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 font-semibold"
        >
          {loading 
            ? `⏳ Uploading ${uploadFiles.length} logo${uploadFiles.length > 1 ? 's' : ''}...` 
            : `📤 Upload ${uploadFiles.length > 0 ? uploadFiles.length + ' ' : ''}Logo${uploadFiles.length > 1 ? 's' : ''}`
          }
        </button>
      </form>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-3">Current Logos (Drag to Reorder)</h3>
        
        {loading && logos.length === 0 ? (
          <p className="text-gray-500">Loading...</p>
        ) : logos.length === 0 ? (
          <p className="text-gray-500">No logos uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {logos.map((logo, index) => (
              <div
                key={logo._id}
                draggable={editingId !== logo._id}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnter={(e) => handleDragEnter(e, index)}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`border rounded-lg p-4 transition-all ${
                  editingId === logo._id 
                    ? 'border-blue-500 bg-blue-50' 
                    : dragOverItem === index 
                    ? 'border-green-500 bg-green-50 border-2' 
                    : 'border-gray-300 hover:border-blue-400 cursor-move bg-white'
                }`}
              >
                {editingId === logo._id ? (

                  <div className="space-y-3">
                    <div className="flex items-center justify-center mb-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={logo.image.thumbnailUrl || logo.image.url}
                        alt={logo.title}
                        className="h-16 w-auto object-contain"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium mb-1">Title</label>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full border border-gray-300 rounded p-2 text-sm"
                        required
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={cancelEdit}
                        disabled={loading}
                        className="flex-1 bg-gray-500 text-white px-2 py-1 rounded text-xs hover:bg-gray-600 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleUpdate(logo._id)}
                        disabled={loading || !editTitle}
                        className="flex-1 bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 disabled:opacity-50"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (

                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <div className="text-xs text-gray-400">⋮⋮</div>
                    </div>

                    <div className="flex items-center justify-center h-20 bg-gray-50 rounded">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={logo.image.thumbnailUrl || logo.image.url}
                        alt={logo.title}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    <div>
                      <p className="font-semibold text-sm text-gray-900 truncate" title={logo.title}>
                        {logo.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        Position: {logo.position}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(logo)}
                        disabled={loading}
                        className="flex-1 bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 disabled:opacity-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(logo._id)}
                        disabled={loading}
                        className="flex-1 bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
