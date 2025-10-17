'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Star, User, Eye } from 'lucide-react';
import Image from 'next/image';
import Modal from '@/components/ui/admin/Modal';
import FileUpload from '@/components/ui/admin/FileUpload';
import Button from '@/components/ui/admin/Button';
import Input from '@/components/ui/admin/Input';
import Textarea from '@/components/ui/admin/Textarea';
import Alert from '@/components/ui/admin/Alert';
import Card from '@/components/ui/admin/Card';

export default function TestimonyManage() {
  const [testimonies, setTestimonies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedTestimony, setSelectedTestimony] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    text: '',
    star: 5,
  });
  const [profileImage, setProfileImage] = useState([]);

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

  const resetForm = () => {
    setFormData({
      name: '',
      title: '',
      text: '',
      star: 5,
    });
    setProfileImage([]);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    
    if (profileImage.length === 0) {
      setError('Please select a profile image');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const formDataToSend = new FormData();
      formDataToSend.append('profileImage', profileImage[0]);
      formDataToSend.append('name', formData.name);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('text', formData.text);
      formDataToSend.append('star', formData.star);

      const token = localStorage.getItem('auth-token');
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch('/api/admin/testimony', {
        method: 'POST',
        credentials: 'include',
        headers,
        body: formDataToSend
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('Testimony created successfully!');
        setCreateModalOpen(false);
        resetForm();
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

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');

      const formDataToSend = new FormData();
      if (profileImage.length > 0) {
        formDataToSend.append('profileImage', profileImage[0]);
      }
      formDataToSend.append('name', formData.name);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('text', formData.text);
      formDataToSend.append('star', formData.star);

      const token = localStorage.getItem('auth-token');
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`/api/admin/testimony/${selectedTestimony._id}`, {
        method: 'PUT',
        credentials: 'include',
        headers,
        body: formDataToSend
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('Testimony updated successfully!');
        setEditModalOpen(false);
        resetForm();
        fetchTestimonies();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Update failed');
      }
    } catch (err) {
      setError('Update error: ' + err.message);
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
        setSuccess('Testimony deleted successfully!');
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

  const openEditModal = (testimony) => {
    setSelectedTestimony(testimony);
    setFormData({
      name: testimony.name || '',
      title: testimony.title || '',
      text: testimony.text || '',
      star: testimony.star || 5,
    });
    setProfileImage([]);
    setEditModalOpen(true);
  };

  const openPreviewModal = (testimony) => {
    setSelectedTestimony(testimony);
    setPreviewModalOpen(true);
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-gray-100">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Testimonies</h2>
          <p className="text-sm text-gray-600 mt-2 font-medium">
            Manage client testimonials and reviews • {testimonies.length} total
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setCreateModalOpen(true);
          }}
          variant="primary"
          size="lg"
          className="shadow-xl shadow-black/20"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Testimony
        </Button>
      </div>

      {/* Alerts */}
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      {/* Testimonies Grid */}
      {loading && testimonies.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
        </div>
      ) : testimonies.length === 0 ? (
        <Card className="p-16 bg-gradient-to-br from-gray-50 to-white">
          <div className="text-center">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <Star className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No testimonies yet</h3>
            <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">Get started by adding your first client testimony</p>
            <Button onClick={() => setCreateModalOpen(true)} variant="primary" size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Add First Testimony
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonies.map((testimony, index) => (
            <Card 
              key={testimony._id} 
              hover
              className="group overflow-hidden"
              style={{ animation: `fadeInScale 0.3s ease-out ${index * 0.1}s both` }}
            >
              {/* Content */}
              <div className="p-5 space-y-4">
                {/* Profile */}
                <div className="flex items-start gap-4">
                  <div className="relative w-16 h-16 flex-shrink-0 rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-200">
                    {testimony.profileImage?.url ? (
                      <Image
                        src={testimony.profileImage.url}
                        alt={testimony.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <User className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-gray-900 truncate">
                      {testimony.name}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                      {testimony.title}
                    </p>
                    <div className="mt-1">
                      {renderStars(testimony.star)}
                    </div>
                  </div>
                </div>

                {/* Text */}
                <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                  &ldquo;{testimony.text}&rdquo;
                </p>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t-2 border-gray-100">
                  <Button
                    onClick={() => openPreviewModal(testimony)}
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button
                    onClick={() => openEditModal(testimony)}
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                  >
                    <Edit2 className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(testimony._id)}
                    variant="ghost"
                    size="sm"
                    className="flex-1 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          resetForm();
        }}
        title="Add New Testimony"
        size="lg"
      >
        <form onSubmit={handleCreate} className="space-y-6">
          <FileUpload
            files={profileImage}
            onChange={setProfileImage}
            maxFiles={1}
            label="Profile Image"
          />

          <Input
            label="Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Client name"
          />

          <Input
            label="Title/Position"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="CEO, Company Name"
          />

          <Textarea
            label="Testimony Text"
            required
            value={formData.text}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            placeholder="Enter testimony text..."
            rows={5}
          />

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setFormData({ ...formData, star: rating })}
                  className="transition-transform duration-200 hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      rating <= formData.star
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-200 text-gray-200'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={() => {
                setCreateModalOpen(false);
                resetForm();
              }}
              variant="ghost"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={loading}
              className="flex-1"
            >
              Create Testimony
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          resetForm();
        }}
        title="Edit Testimony"
        size="lg"
      >
        <form onSubmit={handleUpdate} className="space-y-6">
          <FileUpload
            files={profileImage}
            onChange={setProfileImage}
            maxFiles={1}
            label="Profile Image (optional - leave empty to keep current)"
          />

          {selectedTestimony?.profileImage?.url && profileImage.length === 0 && (
            <div className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-2">Current Image:</p>
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-300">
                <Image
                  src={selectedTestimony.profileImage.url}
                  alt={selectedTestimony.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          <Input
            label="Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Client name"
          />

          <Input
            label="Title/Position"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="CEO, Company Name"
          />

          <Textarea
            label="Testimony Text"
            required
            value={formData.text}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            placeholder="Enter testimony text..."
            rows={5}
          />

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setFormData({ ...formData, star: rating })}
                  className="transition-transform duration-200 hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      rating <= formData.star
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-200 text-gray-200'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={() => {
                setEditModalOpen(false);
                resetForm();
              }}
              variant="ghost"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={loading}
              className="flex-1"
            >
              Update Testimony
            </Button>
          </div>
        </form>
      </Modal>

      {/* Preview Modal */}
      <Modal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        title="Testimony Preview"
        size="md"
      >
        {selectedTestimony && (
          <div className="space-y-6">
            {/* Profile */}
            <div className="flex items-center gap-4 pb-6 border-b-2 border-gray-100">
              <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-200">
                {selectedTestimony.profileImage?.url ? (
                  <Image
                    src={selectedTestimony.profileImage.url}
                    alt={selectedTestimony.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <User className="w-10 h-10 text-gray-400" />
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedTestimony.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedTestimony.title}
                </p>
                <div className="mt-2">
                  {renderStars(selectedTestimony.star)}
                </div>
              </div>
            </div>

            {/* Text */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Testimony:</h4>
              <p className="text-sm text-gray-600 leading-relaxed italic">
                &ldquo;{selectedTestimony.text}&rdquo;
              </p>
            </div>

            {/* Meta Info */}
            {selectedTestimony.createdAt && (
              <div className="pt-4 border-t-2 border-gray-100">
                <p className="text-xs text-gray-500 font-medium">
                  Created: {new Date(selectedTestimony.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
