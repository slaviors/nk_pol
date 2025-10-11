'use client';

import { useState, useEffect } from 'react';

export default function GalleryManage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [galleryStatus, setGalleryStatus] = useState({ totalImages: 0, maxImages: 4, remainingSlots: 4, isFull: false });
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);

  const [uploadFiles, setUploadFiles] = useState([]);
  const [titles, setTitles] = useState([]);
  const [descriptions, setDescriptions] = useState([]);
  const [years, setYears] = useState([]);
  const [locations, setLocations] = useState([]);
  const [venues, setVenues] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth-token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch('/api/admin/gallery', {
        credentials: 'include',
        headers
      });

      const data = await response.json();
      if (response.ok) {
        setImages(data.images || []);
        setGalleryStatus(data.galleryStatus || { totalImages: 0, maxImages: 4, remainingSlots: 4, isFull: false });
      } else {
        setError(data.error || 'Failed to fetch images');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    const maxFiles = galleryStatus.remainingSlots;
    const limitedFiles = files.slice(0, maxFiles);
    
    if (files.length > maxFiles) {
      setError(`Only ${maxFiles} file(s) can be uploaded. Selected first ${maxFiles} files.`);
    }
    
    setUploadFiles(limitedFiles);
    setTitles(limitedFiles.map(f => f.name.split('.')[0]));
    setDescriptions(limitedFiles.map(() => ''));
    setYears(limitedFiles.map(() => ''));
    setLocations(limitedFiles.map(() => ''));
    setVenues(limitedFiles.map(() => ''));
  };

  const removeFile = (indexToRemove) => {
    setUploadFiles(uploadFiles.filter((_, idx) => idx !== indexToRemove));
    setTitles(titles.filter((_, idx) => idx !== indexToRemove));
    setDescriptions(descriptions.filter((_, idx) => idx !== indexToRemove));
    setYears(years.filter((_, idx) => idx !== indexToRemove));
    setLocations(locations.filter((_, idx) => idx !== indexToRemove));
    setVenues(venues.filter((_, idx) => idx !== indexToRemove));
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
      setSuccess(`⏳ Uploading ${uploadFiles.length} file${uploadFiles.length > 1 ? 's' : ''}...`);

      console.log('Uploading files:', uploadFiles.length, 'files');
      console.log('Files:', uploadFiles.map(f => f.name));

      const formData = new FormData();
      uploadFiles.forEach(file => formData.append('files', file));
      titles.forEach(title => formData.append('titles', title));
      descriptions.forEach(desc => formData.append('descriptions', desc));
      years.forEach(year => formData.append('years', year));
      locations.forEach(loc => formData.append('locations', loc));
      venues.forEach(venue => formData.append('venues', venue));

      console.log('FormData entries:');
      for (let pair of formData.entries()) {
        console.log(pair[0], ':', pair[1] instanceof File ? pair[1].name : pair[1]);
      }

      const token = localStorage.getItem('auth-token');
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch('/api/admin/gallery', {
        method: 'POST',
        credentials: 'include',
        headers,
        body: formData
      });

      const data = await response.json();
      console.log('Upload response:', data);
      
      if (response.ok) {
        const successMsg = `✓ Successfully uploaded ${data.successCount} of ${uploadFiles.length} image${uploadFiles.length > 1 ? 's' : ''}!`;
        setSuccess(successMsg);
        
        if (data.errorCount > 0) {
          setError(`⚠️ ${data.errorCount} file${data.errorCount > 1 ? 's' : ''} failed to upload. Check console for details.`);
        }
        
        setUploadFiles([]);
        setTitles([]);
        setDescriptions([]);
        setYears([]);
        setLocations([]);
        setVenues([]);

        document.getElementById('fileInput').value = '';
        fetchImages();

        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch (err) {
      setError('Upload error: ' + err.message);
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('auth-token');
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess(data.message);
        fetchImages();
      } else {
        setError(data.error || 'Delete failed');
      }
    } catch (err) {
      setError('Delete error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (image) => {
    setEditingId(image._id);
    setEditForm({
      title: image.title || '',
      description: image.description || '',
      year: image.year || '',
      location: image.location || '',
      venue: image.venue || ''
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleUpdate = async (id) => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const token = localStorage.getItem('auth-token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`/api/admin/gallery/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers,
        body: JSON.stringify({
          title: editForm.title,
          description: editForm.description,
          year: editForm.year ? parseInt(editForm.year) : undefined,
          location: editForm.location,
          venue: editForm.venue
        })
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('Image updated successfully');
        setEditingId(null);
        setEditForm({});
        fetchImages();
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

    const newImages = [...images];
    const draggedImage = newImages[draggedItem];

    newImages.splice(draggedItem, 1);

    newImages.splice(dropIndex, 0, draggedImage);
    
    setImages(newImages);

    try {
      const imageIds = newImages.map(img => img._id);
      const token = localStorage.getItem('auth-token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch('/api/admin/gallery', {
        method: 'PUT',
        credentials: 'include',
        headers,
        body: JSON.stringify({
          action: 'reorder',
          imageIds
        })
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to reorder');
        fetchImages();       } else {
        setSuccess('Images reordered successfully');
        setTimeout(() => setSuccess(''), 2000);
      }
    } catch (err) {
      setError('Reorder error: ' + err.message);
      fetchImages();     }
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
    setDraggedItem(null);
    setDragOverItem(null);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Image Gallery Management (Max 4)</h2>
      
      {/* Status Info */}
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
        <p className="text-sm">
          <strong>Gallery Status:</strong> {galleryStatus.totalImages}/{galleryStatus.maxImages} images used
          {galleryStatus.isFull ? ' (Full)' : ` (${galleryStatus.remainingSlots} slots remaining)`}
        </p>
      </div>

      {/* Error/Success Messages */}
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

      {/* Upload Form */}
      {!galleryStatus.isFull && (
        <form onSubmit={handleUpload} className="mb-6 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-3">Upload New Images</h3>
          
          <div className="mb-3">
            <label className="block text-sm font-medium mb-2">
              Select Images (You can upload up to {galleryStatus.remainingSlots} image{galleryStatus.remainingSlots > 1 ? 's' : ''})
            </label>
            <input
              id="fileInput"
              type="file"
              multiple
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileChange}
              className="block w-full text-sm border border-gray-300 rounded p-2 bg-white cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-xs text-gray-500 mt-1">Accepted formats: JPEG, PNG, WebP (max 10MB per file)</p>
          </div>
          
          {uploadFiles.length > 0 && (
            <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm font-medium text-blue-900">
                📁 {uploadFiles.length} file{uploadFiles.length > 1 ? 's' : ''} selected - All will be uploaded in one action
              </p>
              {uploadFiles.length > 1 && (
                <p className="text-xs text-blue-700 mt-1">
                  ✓ Multi-file upload enabled: Click &ldquo;Upload Images&rdquo; to upload all {uploadFiles.length} files at once
                </p>
              )}
            </div>
          )}

          {uploadFiles.length > 0 && (
            <div className="space-y-4">
              <div className="bg-blue-100 p-3 rounded border border-blue-300">
                <p className="text-sm font-semibold text-blue-900 mb-1">
                  📋 Configure Each Image
                </p>
                <p className="text-xs text-blue-700">
                  Fill in the details below for each image. All {uploadFiles.length} image{uploadFiles.length > 1 ? 's' : ''} will be created when you click Upload.
                </p>
              </div>
              
              {uploadFiles.map((file, idx) => (
                <div key={idx} className="p-4 border-2 border-blue-300 rounded-lg bg-white shadow-sm">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200">
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {idx + 1}
                    </span>
                    <div className="flex-grow">
                      <p className="font-semibold text-sm text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="flex-shrink-0 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded text-sm font-medium transition-colors"
                      title="Remove this file"
                    >
                      Remove
                    </button>
                  </div>
                  
                  {/* Form Fields */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={titles[idx] || ''}
                        onChange={(e) => {
                          const newTitles = [...titles];
                          newTitles[idx] = e.target.value;
                          setTitles(newTitles);
                        }}
                        placeholder="Enter image title"
                        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Year
                        </label>
                        <input
                          type="number"
                          value={years[idx] || ''}
                          onChange={(e) => {
                            const newYears = [...years];
                            newYears[idx] = e.target.value;
                            setYears(newYears);
                          }}
                          placeholder="2024"
                          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          value={locations[idx] || ''}
                          onChange={(e) => {
                            const newLocations = [...locations];
                            newLocations[idx] = e.target.value;
                            setLocations(newLocations);
                          }}
                          placeholder="Jakarta"
                          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Venue
                        </label>
                        <input
                          type="text"
                          value={venues[idx] || ''}
                          onChange={(e) => {
                            const newVenues = [...venues];
                            newVenues[idx] = e.target.value;
                            setVenues(newVenues);
                          }}
                          placeholder="Convention Hall"
                          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={descriptions[idx] || ''}
                        onChange={(e) => {
                          const newDescriptions = [...descriptions];
                          newDescriptions[idx] = e.target.value;
                          setDescriptions(newDescriptions);
                        }}
                        placeholder="Enter description for this image..."
                        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows="3"
                      />
                    </div>
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
              ? `⏳ Uploading ${uploadFiles.length} file${uploadFiles.length > 1 ? 's' : ''}...` 
              : `📤 Upload ${uploadFiles.length > 0 ? uploadFiles.length + ' ' : ''}Image${uploadFiles.length > 1 ? 's' : ''}`
            }
          </button>
        </form>
      )}

      {/* Images Grid - Drag & Drop */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-3">Current Images (Drag to Reorder)</h3>
        
        {loading && images.length === 0 ? (
          <p className="text-gray-500">Loading...</p>
        ) : images.length === 0 ? (
          <p className="text-gray-500">No images uploaded yet.</p>
        ) : (
          <div className="space-y-4">
            {images.map((image, index) => (
              <div
                key={image._id}
                draggable={editingId !== image._id}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnter={(e) => handleDragEnter(e, index)}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`border rounded p-4 transition-all ${
                  editingId === image._id 
                    ? 'border-blue-500 bg-blue-50' 
                    : dragOverItem === index 
                    ? 'border-green-500 bg-green-50 border-2' 
                    : 'border-gray-300 hover:border-blue-400 cursor-move'
                }`}
              >
                {editingId === image._id ? (

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={image.image.thumbnailUrl || image.image.url}
                          alt={image.title}
                          className="w-20 h-20 object-cover rounded"
                        />
                      </div>
                      <div className="flex-grow">
                        <p className="text-xs text-gray-500">Editing Mode</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <label className="block text-xs font-medium mb-1">Title *</label>
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          className="w-full border border-gray-300 rounded p-2 text-sm"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium mb-1">Year</label>
                        <input
                          type="number"
                          value={editForm.year}
                          onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
                          className="w-full border border-gray-300 rounded p-2 text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium mb-1">Location</label>
                        <input
                          type="text"
                          value={editForm.location}
                          onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                          className="w-full border border-gray-300 rounded p-2 text-sm"
                        />
                      </div>
                      
                      <div className="col-span-2">
                        <label className="block text-xs font-medium mb-1">Venue</label>
                        <input
                          type="text"
                          value={editForm.venue}
                          onChange={(e) => setEditForm({ ...editForm, venue: e.target.value })}
                          className="w-full border border-gray-300 rounded p-2 text-sm"
                        />
                      </div>
                      
                      <div className="col-span-2">
                        <label className="block text-xs font-medium mb-1">Description</label>
                        <textarea
                          value={editForm.description}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          className="w-full border border-gray-300 rounded p-2 text-sm"
                          rows="3"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={cancelEdit}
                        disabled={loading}
                        className="bg-gray-500 text-white px-4 py-2 rounded text-sm hover:bg-gray-600 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleUpdate(image._id)}
                        disabled={loading || !editForm.title}
                        className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                ) : (

                  <div className="flex items-start gap-3">
                    {/* Drag handle & Position indicator */}
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mb-1">
                        {index + 1}
                      </div>
                      <div className="text-xs text-gray-400 text-center">⋮⋮</div>
                    </div>
                    
                    {/* Image thumbnail */}
                    <div className="flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image.image.thumbnailUrl || image.image.url}
                        alt={image.title}
                        className="w-24 h-24 object-cover rounded"
                      />
                    </div>
                    
                    {/* Image details */}
                    <div className="flex-grow">
                      <h4 className="font-semibold text-sm">{image.title}</h4>
                      {image.description && (
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{image.description}</p>
                      )}
                      <div className="text-xs text-gray-500 mt-1 space-y-1">
                        {image.year && <p>📅 Year: {image.year}</p>}
                        {image.location && <p>📍 Location: {image.location}</p>}
                        {image.venue && <p>🏢 Venue: {image.venue}</p>}
                        <p className="text-gray-400">Position: {image.position}</p>
                      </div>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="flex-shrink-0 flex flex-col gap-2">
                      <button
                        onClick={() => startEdit(image)}
                        disabled={loading}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(image._id)}
                        disabled={loading}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50"
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
