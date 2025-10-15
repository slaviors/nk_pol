'use client';

import { useState, useEffect } from 'react';

export default function GalleryPostManage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);

  const [uploadFiles, setUploadFiles] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [year, setYear] = useState('');
  const [location, setLocation] = useState('');
  const [venue, setVenue] = useState('');
  const [thumbnailIndex, setThumbnailIndex] = useState(0);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth-token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch('/api/admin/galleryPost', {
        credentials: 'include',
        headers
      });

      const data = await response.json();
      if (response.ok) {
        setPosts(data.posts || []);
      } else {
        setError(data.error || 'Failed to fetch posts');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 4) {
      setError('Maximum 4 images allowed per post');
      return;
    }
    
    setUploadFiles(files);
    setThumbnailIndex(0);
  };

  const removeFile = (indexToRemove) => {
    const newFiles = uploadFiles.filter((_, idx) => idx !== indexToRemove);
    setUploadFiles(newFiles);
    
    if (thumbnailIndex >= newFiles.length) {
      setThumbnailIndex(Math.max(0, newFiles.length - 1));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (uploadFiles.length === 0) {
      setError('Please select at least 1 image');
      return;
    }

    if (uploadFiles.length > 4) {
      setError('Maximum 4 images allowed per post');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess(`⏳ Creating post with ${uploadFiles.length} image${uploadFiles.length > 1 ? 's' : ''}...`);

      const formData = new FormData();
      uploadFiles.forEach(file => formData.append('files', file));
      formData.append('title', title);
      formData.append('description', description);
      formData.append('thumbnailIndex', thumbnailIndex);
      if (year) formData.append('year', year);
      if (location) formData.append('location', location);
      if (venue) formData.append('venue', venue);

      const token = localStorage.getItem('auth-token');
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch('/api/admin/galleryPost', {
        method: 'POST',
        credentials: 'include',
        headers,
        body: formData
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('✓ Gallery post created successfully!');
        setUploadFiles([]);
        setTitle('');
        setDescription('');
        setYear('');
        setLocation('');
        setVenue('');
        setThumbnailIndex(0);
        document.getElementById('fileInput').value = '';
        fetchPosts();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Creation failed');
      }
    } catch (err) {
      setError('Upload error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this post and all its images?')) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('auth-token');
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`/api/admin/galleryPost/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess(data.message);
        fetchPosts();
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

  const startEdit = (post) => {
    setEditingId(post._id);
    setEditForm({
      title: post.title || '',
      description: post.description || '',
      year: post.year || '',
      location: post.location || '',
      venue: post.venue || '',
      thumbnailIndex: post.thumbnailIndex || 0
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

      const response = await fetch(`/api/admin/galleryPost/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers,
        body: JSON.stringify(editForm)
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('Post updated successfully');
        setEditingId(null);
        setEditForm({});
        fetchPosts();
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

    const newPosts = [...posts];
    const draggedPost = newPosts[draggedItem];
    
    newPosts.splice(draggedItem, 1);
    newPosts.splice(dropIndex, 0, draggedPost);
    
    setPosts(newPosts);

    try {
      const postIds = newPosts.map(post => post._id);
      const token = localStorage.getItem('auth-token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch('/api/admin/galleryPost', {
        method: 'PUT',
        credentials: 'include',
        headers,
        body: JSON.stringify({
          action: 'reorder',
          postIds
        })
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to reorder');
        fetchPosts();
      } else {
        setSuccess('Posts reordered successfully');
        setTimeout(() => setSuccess(''), 2000);
      }
    } catch (err) {
      setError('Reorder error: ' + err.message);
      fetchPosts();
    }
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
    setDraggedItem(null);
    setDragOverItem(null);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gallery Post Management</h2>
      
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
        <p className="text-sm">
          <strong>📋 Info:</strong> Create gallery posts with 1-4 images each. Select which image to use as the thumbnail. Unlimited posts allowed.
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

      <form onSubmit={handleSubmit} className="mb-6 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
        <h3 className="text-lg font-semibold mb-3">Create New Gallery Post</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              Images (1-4 images) <span className="text-red-500">*</span>
            </label>
            <input
              id="fileInput"
              type="file"
              multiple
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileChange}
              className="block w-full text-sm border border-gray-300 rounded p-2 bg-white cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Select 1-4 images (JPEG, PNG, WebP - max 10MB each)</p>
          </div>

          {uploadFiles.length > 0 && (
            <div className="md:col-span-2 p-3 bg-white border border-gray-300 rounded">
              <p className="text-sm font-medium mb-2">
                📸 {uploadFiles.length} image{uploadFiles.length > 1 ? 's' : ''} selected
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {uploadFiles.map((file, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${idx + 1}`}
                      className={`w-full h-24 object-cover rounded border-2 ${thumbnailIndex === idx ? 'border-blue-500' : 'border-gray-300'}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                    <button
                      type="button"
                      onClick={() => setThumbnailIndex(idx)}
                      className={`absolute bottom-1 left-1 text-xs px-2 py-1 rounded ${thumbnailIndex === idx ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
                    >
                      {thumbnailIndex === idx ? '★ Thumbnail' : 'Set as thumb'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Taiwan Excellence Exhibition 2024"
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              maxLength={200}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Project description..."
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              maxLength={1000}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Year</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="e.g., 2024"
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="1800"
              max={new Date().getFullYear() + 10}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Jakarta Convention Center"
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              maxLength={200}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Venue</label>
            <input
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="e.g., Hall A"
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              maxLength={200}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || uploadFiles.length === 0}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 font-semibold"
        >
          {loading ? '⏳ Creating...' : `📤 Create Post${uploadFiles.length > 0 ? ` (${uploadFiles.length} image${uploadFiles.length > 1 ? 's' : ''})` : ''}`}
        </button>
      </form>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-3">Gallery Posts ({posts.length}) - Drag to Reorder</h3>
        
        {loading && posts.length === 0 ? (
          <p className="text-gray-500">Loading...</p>
        ) : posts.length === 0 ? (
          <p className="text-gray-500">No posts created yet.</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post, index) => (
              <div
                key={post._id}
                draggable={editingId !== post._id}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnter={(e) => handleDragEnter(e, index)}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`border rounded-lg p-4 transition-all ${
                  editingId === post._id 
                    ? 'border-blue-500 bg-blue-50' 
                    : dragOverItem === index 
                    ? 'border-green-500 bg-green-50 border-2' 
                    : 'border-gray-300 hover:border-blue-400 cursor-move bg-white'
                }`}
              >
                {editingId === post._id ? (
                  <div>
                    <div className="flex items-start gap-4 mb-4">
                      <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <div className="flex-grow">
                        <p className="text-sm text-gray-600 mb-2">{post.images.length} image{post.images.length > 1 ? 's' : ''}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                          {post.images.map((img, idx) => (
                            <div key={idx} className="relative">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={img.thumbnailUrl || img.url}
                                alt={`Image ${idx + 1}`}
                                className={`w-full h-20 object-cover rounded border-2 ${editForm.thumbnailIndex === idx ? 'border-blue-500' : 'border-gray-300'}`}
                              />
                              <button
                                type="button"
                                onClick={() => setEditForm({...editForm, thumbnailIndex: idx})}
                                className={`absolute bottom-1 left-1 text-xs px-1 py-0.5 rounded ${editForm.thumbnailIndex === idx ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
                              >
                                {editForm.thumbnailIndex === idx ? '★' : 'Set'}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium mb-1">Title</label>
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                          className="w-full border border-gray-300 rounded p-2 text-sm"
                          required
                          maxLength={200}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium mb-1">Description</label>
                        <textarea
                          value={editForm.description}
                          onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                          className="w-full border border-gray-300 rounded p-2 text-sm"
                          rows={2}
                          maxLength={1000}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Year</label>
                        <input
                          type="number"
                          value={editForm.year}
                          onChange={(e) => setEditForm({...editForm, year: e.target.value})}
                          className="w-full border border-gray-300 rounded p-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Location</label>
                        <input
                          type="text"
                          value={editForm.location}
                          onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                          className="w-full border border-gray-300 rounded p-2 text-sm"
                          maxLength={200}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium mb-1">Venue</label>
                        <input
                          type="text"
                          value={editForm.venue}
                          onChange={(e) => setEditForm({...editForm, venue: e.target.value})}
                          className="w-full border border-gray-300 rounded p-2 text-sm"
                          maxLength={200}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={cancelEdit}
                        disabled={loading}
                        className="flex-1 bg-gray-500 text-white px-3 py-2 rounded text-sm hover:bg-gray-600 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleUpdate(post._id)}
                        disabled={loading || !editForm.title}
                        className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    
                    <div className="flex-grow">
                      <h4 className="font-bold text-lg mb-1">{post.title}</h4>
                      {post.description && (
                        <p className="text-sm text-gray-600 mb-2">{post.description}</p>
                      )}
                      <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-3">
                        {post.year && <span>📅 {post.year}</span>}
                        {post.location && <span>📍 {post.location}</span>}
                        {post.venue && <span>🏢 {post.venue}</span>}
                        <span>🖼️ {post.images.length} image{post.images.length > 1 ? 's' : ''}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                        {post.images.map((img, idx) => (
                          <div key={idx} className="relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={img.thumbnailUrl || img.url}
                              alt={`Image ${idx + 1}`}
                              className={`w-full h-20 object-cover rounded border-2 ${post.thumbnailIndex === idx ? 'border-blue-500' : 'border-gray-300'}`}
                            />
                            {post.thumbnailIndex === idx && (
                              <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                                ★ Thumbnail
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(post)}
                          disabled={loading}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(post._id)}
                          disabled={loading}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
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
