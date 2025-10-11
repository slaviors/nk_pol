'use client';

import { useState, useEffect } from 'react';

export default function TestimonyManage() {
  const [testimonies, setTestimonies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);

  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [star, setStar] = useState(5);

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editText, setEditText] = useState('');
  const [editStar, setEditStar] = useState(5);

  useEffect(() => {
    fetchTestimonies();
  }, []);

  const fetchTestimonies = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth-token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch('/api/admin/testimony', {
        credentials: 'include',
        headers
      });

      const data = await response.json();
      if (response.ok) {
        setTestimonies(data.testimonies || []);
      } else {
        setError(data.error || 'Failed to fetch testimonies');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profileImage) {
      setError('Please select a profile image');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('⏳ Creating testimony...');

      const formData = new FormData();
      formData.append('profileImage', profileImage);
      formData.append('name', name);
      formData.append('title', title);
      formData.append('text', text);
      formData.append('star', star);

      const token = localStorage.getItem('auth-token');
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch('/api/admin/testimony', {
        method: 'POST',
        credentials: 'include',
        headers,
        body: formData
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('✓ Testimony created successfully!');
        setProfileImage(null);
        setName('');
        setTitle('');
        setText('');
        setStar(5);
        document.getElementById('imageInput').value = '';
        fetchTestimonies();
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
    if (!confirm('Are you sure you want to delete this testimony?')) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('auth-token');
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`/api/admin/testimony/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess(data.message);
        fetchTestimonies();
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

  const startEdit = (testimony) => {
    setEditingId(testimony._id);
    setEditName(testimony.name || '');
    setEditTitle(testimony.title || '');
    setEditText(testimony.text || '');
    setEditStar(testimony.star || 5);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditTitle('');
    setEditText('');
    setEditStar(5);
  };

  const handleUpdate = async (id) => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const token = localStorage.getItem('auth-token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`/api/admin/testimony/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers,
        body: JSON.stringify({
          name: editName,
          title: editTitle,
          text: editText,
          star: editStar
        })
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('Testimony updated successfully');
        setEditingId(null);
        fetchTestimonies();
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

    const newTestimonies = [...testimonies];
    const draggedTestimony = newTestimonies[draggedItem];
    
    newTestimonies.splice(draggedItem, 1);
    newTestimonies.splice(dropIndex, 0, draggedTestimony);
    
    setTestimonies(newTestimonies);

    try {
      const testimonyIds = newTestimonies.map(t => t._id);
      const token = localStorage.getItem('auth-token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch('/api/admin/testimony', {
        method: 'PUT',
        credentials: 'include',
        headers,
        body: JSON.stringify({
          action: 'reorder',
          testimonyIds
        })
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to reorder');
        fetchTestimonies();
      } else {
        setSuccess('Testimonies reordered successfully');
        setTimeout(() => setSuccess(''), 2000);
      }
    } catch (err) {
      setError('Reorder error: ' + err.message);
      fetchTestimonies();
    }
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} className={i <= rating ? 'text-yellow-400' : 'text-gray-300'}>
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Testimony Management</h2>
      
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
        <p className="text-sm">
          <strong>📋 Info:</strong> Create and manage client testimonies. Each testimony includes a profile image, name, title, review text, and star rating (1-5).
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
        <h3 className="text-lg font-semibold mb-3">Create New Testimony</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              Profile Image <span className="text-red-500">*</span>
            </label>
            <input
              id="imageInput"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleImageChange}
              className="block w-full text-sm border border-gray-300 rounded p-2 bg-white cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Accepted formats: JPEG, PNG, WebP (max 5MB)</p>
            {profileImage && (
              <p className="text-xs text-green-600 mt-1">✓ Selected: {profileImage.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., John Doe"
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Title/Position
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., CEO at ABC Company"
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              maxLength={150}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              Testimony Text <span className="text-red-500">*</span>
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write the testimony here..."
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
              required
              maxLength={1000}
            />
            <p className="text-xs text-gray-500 mt-1">{text.length}/1000 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Star Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-4">
              <input
                type="number"
                value={star}
                onChange={(e) => setStar(parseInt(e.target.value))}
                min={1}
                max={5}
                className="w-20 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {renderStars(star)}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !profileImage}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 font-semibold"
        >
          {loading ? '⏳ Creating...' : '📤 Create Testimony'}
        </button>
      </form>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-3">Current Testimonies (Drag to Reorder)</h3>
        
        {loading && testimonies.length === 0 ? (
          <p className="text-gray-500">Loading...</p>
        ) : testimonies.length === 0 ? (
          <p className="text-gray-500">No testimonies created yet.</p>
        ) : (
          <div className="space-y-4">
            {testimonies.map((testimony, index) => (
              <div
                key={testimony._id}
                draggable={editingId !== testimony._id}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnter={(e) => handleDragEnter(e, index)}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`border rounded-lg p-4 transition-all ${
                  editingId === testimony._id 
                    ? 'border-blue-500 bg-blue-50' 
                    : dragOverItem === index 
                    ? 'border-green-500 bg-green-50 border-2' 
                    : 'border-gray-300 hover:border-blue-400 cursor-move bg-white'
                }`}
              >
                {editingId === testimony._id ? (

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={testimony.profileImage.thumbnailUrl || testimony.profileImage.url}
                        alt={testimony.name}
                        className="w-24 h-24 rounded-full object-cover mx-auto"
                      />
                    </div>
                    
                    <div className="md:col-span-3 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium mb-1">Name</label>
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full border border-gray-300 rounded p-2 text-sm"
                            required
                            maxLength={100}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">Title</label>
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full border border-gray-300 rounded p-2 text-sm"
                            maxLength={150}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium mb-1">Testimony Text</label>
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full border border-gray-300 rounded p-2 text-sm"
                          rows={3}
                          required
                          maxLength={1000}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium mb-1">Star Rating</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={editStar}
                            onChange={(e) => setEditStar(parseInt(e.target.value))}
                            min={1}
                            max={5}
                            className="w-20 border border-gray-300 rounded p-2 text-sm"
                          />
                          {renderStars(editStar)}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={cancelEdit}
                          disabled={loading}
                          className="flex-1 bg-gray-500 text-white px-3 py-2 rounded text-sm hover:bg-gray-600 disabled:opacity-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleUpdate(testimony._id)}
                          disabled={loading || !editName || !editText}
                          className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-1 flex flex-col items-center">
                      <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mb-2">
                        {index + 1}
                      </span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={testimony.profileImage.thumbnailUrl || testimony.profileImage.url}
                        alt={testimony.name}
                        className="w-24 h-24 rounded-full object-cover"
                      />
                      <div className="mt-2">
                        {renderStars(testimony.star)}
                      </div>
                    </div>
                    
                    <div className="md:col-span-3">
                      <div className="mb-2">
                        <h4 className="font-bold text-lg">{testimony.name}</h4>
                        {testimony.title && (
                          <p className="text-sm text-gray-600">{testimony.title}</p>
                        )}
                      </div>
                      
                      <p className="text-gray-700 mb-3 italic">&quot;{testimony.text}&quot;</p>
                      
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => startEdit(testimony)}
                          disabled={loading}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(testimony._id)}
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
