'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, GripVertical, Eye, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import Modal from '@/components/ui/admin/Modal';
import ConfirmModal from '@/components/ui/admin/ConfirmModal';
import FileUpload from '@/components/ui/admin/FileUpload';
import Button from '@/components/ui/admin/Button';
import Input from '@/components/ui/admin/Input';
import Textarea from '@/components/ui/admin/Textarea';
import Alert from '@/components/ui/admin/Alert';
import Card from '@/components/ui/admin/Card';

export default function GalleryPostManage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmDeleteImageOpen, setConfirmDeleteImageOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    year: '',
    location: '',
    venue: '',
    thumbnailIndex: 0,
  });
  const [uploadFiles, setUploadFiles] = useState([]);
  const [editImages, setEditImages] = useState([]);

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

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      year: '',
      location: '',
      venue: '',
      thumbnailIndex: 0,
    });
    setUploadFiles([]);
    setEditImages([]);
  };

  const handleCreate = async (e) => {
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

      const formDataToSend = new FormData();
      uploadFiles.forEach(file => formDataToSend.append('files', file));
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('thumbnailIndex', formData.thumbnailIndex);
      if (formData.year) formDataToSend.append('year', formData.year);
      if (formData.location) formDataToSend.append('location', formData.location);
      if (formData.venue) formDataToSend.append('venue', formData.venue);

      const token = localStorage.getItem('auth-token');
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch('/api/admin/galleryPost', {
        method: 'POST',
        credentials: 'include',
        headers,
        body: formDataToSend
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('Gallery post created successfully!');
        setCreateModalOpen(false);
        resetForm();
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

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('auth-token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`/api/admin/galleryPost/${selectedPost._id}`, {
        method: 'PUT',
        credentials: 'include',
        headers,
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('Gallery post updated successfully!');
        setEditModalOpen(false);
        resetForm();
        fetchPosts();
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

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('auth-token');
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`/api/admin/galleryPost/${deleteTarget}`, {
        method: 'DELETE',
        credentials: 'include',
        headers
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('Post deleted successfully!');
        setConfirmDeleteOpen(false);
        setDeleteTarget(null);
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

  const openDeleteModal = (id) => {
    setDeleteTarget(id);
    setConfirmDeleteOpen(true);
  };

  const openEditModal = (post) => {
    setSelectedPost(post);
    setFormData({
      title: post.title || '',
      description: post.description || '',
      year: post.year || '',
      location: post.location || '',
      venue: post.venue || '',
      thumbnailIndex: post.thumbnailIndex || 0,
    });
    setEditImages([]);
    setEditModalOpen(true);
  };

  const handleAddImages = async (postId) => {
    if (editImages.length === 0) {
      setError('Please select images to add');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const formDataToSend = new FormData();
      editImages.forEach(file => formDataToSend.append('files', file));
      formDataToSend.append('action', 'add');

      const token = localStorage.getItem('auth-token');
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`/api/admin/galleryPost/${postId}`, {
        method: 'PUT',
        credentials: 'include',
        headers,
        body: formDataToSend
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('Images added successfully!');
        setSelectedPost(data.post);
        setEditImages([]);
        fetchPosts();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to add images');
      }
    } catch (err) {
      setError('Upload error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!deleteTarget) return;

    const { postId, imageIndex } = deleteTarget;

    try {
      setLoading(true);
      setError('');

      const formDataToSend = new FormData();
      formDataToSend.append('action', 'delete');
      formDataToSend.append('imageIndex', imageIndex);

      const token = localStorage.getItem('auth-token');
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`/api/admin/galleryPost/${postId}`, {
        method: 'PUT',
        credentials: 'include',
        headers,
        body: formDataToSend
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('Image deleted successfully!');
        setSelectedPost(data.post);
        setConfirmDeleteImageOpen(false);
        setDeleteTarget(null);
        fetchPosts();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to delete image');
      }
    } catch (err) {
      setError('Delete error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteImageModal = (postId, imageIndex) => {
    setDeleteTarget({ postId, imageIndex });
    setConfirmDeleteImageOpen(true);
  };

  const handleReplaceImage = async (postId, imageIndex, file) => {
    try {
      setLoading(true);
      setError('');

      const formDataToSend = new FormData();
      formDataToSend.append('files', file);
      formDataToSend.append('action', 'replace');
      formDataToSend.append('imageIndex', imageIndex);

      const token = localStorage.getItem('auth-token');
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`/api/admin/galleryPost/${postId}`, {
        method: 'PUT',
        credentials: 'include',
        headers,
        body: formDataToSend
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('Image replaced successfully!');
        setSelectedPost(data.post);
        fetchPosts();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to replace image');
      }
    } catch (err) {
      setError('Replace error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const openPreviewModal = (post) => {
    setSelectedPost(post);
    setPreviewModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-gray-100">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Gallery Posts</h2>
          <p className="text-sm text-gray-600 mt-2 font-medium">
            Manage your gallery images and posts • {posts.length} total
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
          Add New Post
        </Button>
      </div>

      {/* Alerts */}
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      {/* Posts Grid */}
      {loading && posts.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <Card className="p-16 bg-gradient-to-br from-gray-50 to-white">
          <div className="text-center">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <Plus className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No posts yet</h3>
            <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">Get started by creating your first gallery post and showcase your work</p>
            <Button onClick={() => setCreateModalOpen(true)} variant="primary" size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Create First Post
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => {
            const thumbnail = post.images && post.images[post.thumbnailIndex || 0];
            return (
              <Card
                key={post._id}
                hover
                className="group overflow-hidden"
                style={{ animation: `fadeInScale 0.3s ease-out ${index * 0.1}s both` }}
              >
                {/* Image */}
                <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  {thumbnail ? (
                    <Image
                      src={thumbnail.url}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <span className="text-sm text-gray-400 font-medium">No image</span>
                      </div>
                    </div>
                  )}

                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2">
                    <Button
                      onClick={() => openPreviewModal(post)}
                      variant="secondary"
                      size="sm"
                      className="transform scale-90 group-hover:scale-100"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => openEditModal(post)}
                      variant="secondary"
                      size="sm"
                      className="transform scale-90 group-hover:scale-100"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => openDeleteModal(post._id)}
                      variant="danger"
                      size="sm"
                      className="transform scale-90 group-hover:scale-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Image Count Badge */}
                  {post.images && post.images.length > 1 && (
                    <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg font-bold shadow-lg">
                      {post.images.length} images
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 space-y-2 bg-gradient-to-b from-white to-gray-50 border-t-2 border-gray-100">
                  <h3 className="text-base font-bold text-gray-900 line-clamp-2 group-hover:text-black transition-colors">
                    {post.title}
                  </h3>
                  {post.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                      {post.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-gray-500 font-medium pt-1">
                    {post.year && <span className="bg-gray-100 px-2 py-1 rounded-md">{post.year}</span>}
                    {post.location && <span className="bg-gray-100 px-2 py-1 rounded-md">{post.location}</span>}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          resetForm();
        }}
        title="Add New Gallery Post"
        size="lg"
      >
        <form onSubmit={handleCreate} className="space-y-6">
          <FileUpload
            files={uploadFiles}
            onChange={setUploadFiles}
            maxFiles={4}
            label="Upload Images"
          />

          <Input
            label="Title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter post title"
          />

          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter post description"
            rows={4}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Year"
              type="number"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              placeholder="2024"
            />
            <Input
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="City, Country"
            />
            <Input
              label="Venue"
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              placeholder="Event venue"
            />
          </div>

          {uploadFiles.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Thumbnail Image
              </label>
              <select
                value={formData.thumbnailIndex}
                onChange={(e) => setFormData({ ...formData, thumbnailIndex: parseInt(e.target.value) })}
                className="w-full px-4 py-2.5 text-sm bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all"
              >
                {uploadFiles.map((file, idx) => (
                  <option key={idx} value={idx}>
                    Image {idx + 1} - {file.name}
                  </option>
                ))}
              </select>
            </div>
          )}

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
              Create Post
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
        title="Edit Gallery Post"
        size="xl"
      >
        <div className="space-y-6">
          {selectedPost?.images && selectedPost.images.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Current Images ({selectedPost.images.length}/4)
              </label>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {selectedPost.images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 border-2 border-gray-200">
                      <Image
                        src={img.url}
                        alt={img.name}
                        fill
                        className="object-cover"
                      />
                      {idx === selectedPost.thumbnailIndex && (
                        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-lg font-bold">
                          Thumbnail
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-lg font-bold">
                        {idx + 1}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <div className="flex-1">
                        <input
                          id={`replace-image-${idx}`}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleReplaceImage(selectedPost._id, idx, e.target.files[0]);
                              e.target.value = '';
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="w-full"
                          onClick={() => document.getElementById(`replace-image-${idx}`).click()}
                        >
                          <Edit2 className="w-3 h-3 mr-1" />
                          Replace
                        </Button>
                      </div>
                      {selectedPost.images.length > 1 && (
                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          onClick={() => openDeleteImageModal(selectedPost._id, idx)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedPost?.images && selectedPost.images.length < 4 && (
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Add More Images ({4 - selectedPost.images.length} slots available)
              </label>
              <FileUpload
                files={editImages}
                onChange={setEditImages}
                maxFiles={4 - selectedPost.images.length}
                label=""
              />
              {editImages.length > 0 && (
                <Button
                  type="button"
                  onClick={() => handleAddImages(selectedPost._id)}
                  variant="primary"
                  size="sm"
                  isLoading={loading}
                  className="mt-3"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add {editImages.length} Image(s)
                </Button>
              )}
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-6 pt-4 border-t-2 border-gray-100">
            <Input
              label="Title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter post title"
            />

            <Textarea
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter post description"
              rows={4}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Year"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                placeholder="2024"
              />
              <Input
                label="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="City, Country"
              />
              <Input
                label="Venue"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                placeholder="Event venue"
              />
            </div>

            {selectedPost?.images && selectedPost.images.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Thumbnail Image
                </label>
                <select
                  value={formData.thumbnailIndex}
                  onChange={(e) => setFormData({ ...formData, thumbnailIndex: parseInt(e.target.value) })}
                  className="w-full px-4 py-2.5 text-sm bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all"
                >
                  {selectedPost.images.map((img, idx) => (
                    <option key={idx} value={idx}>
                      Image {idx + 1} - {img.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

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
                Update Details
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        title={selectedPost?.title || 'Preview'}
        size="xl"
      >
        {selectedPost && (
          <div className="space-y-6">
            {/* Images Grid */}
            {selectedPost.images && selectedPost.images.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {selectedPost.images.map((img, idx) => (
                  <div key={idx} className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
                    <Image
                      src={img.url}
                      alt={img.name}
                      fill
                      className="object-cover"
                    />
                    {idx === selectedPost.thumbnailIndex && (
                      <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-lg">
                        Thumbnail
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Details */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedPost.title}</h3>
                {selectedPost.description && (
                  <p className="text-sm text-gray-600 leading-relaxed">{selectedPost.description}</p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                {selectedPost.year && (
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">Year</p>
                    <p className="text-sm font-bold text-gray-900">{selectedPost.year}</p>
                  </div>
                )}
                {selectedPost.location && (
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">Location</p>
                    <p className="text-sm font-bold text-gray-900">{selectedPost.location}</p>
                  </div>
                )}
                {selectedPost.venue && (
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">Venue</p>
                    <p className="text-sm font-bold text-gray-900">{selectedPost.venue}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Post Confirmation */}
      <ConfirmModal
        isOpen={confirmDeleteOpen}
        onClose={() => {
          setConfirmDeleteOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={handleDelete}
        title="Delete Gallery Post"
        message="Are you sure you want to delete this post and all its images? This action cannot be undone."
        confirmText="Delete Post"
        cancelText="Cancel"
        variant="danger"
        isLoading={loading}
      />

      {/* Delete Image Confirmation */}
      <ConfirmModal
        isOpen={confirmDeleteImageOpen}
        onClose={() => {
          setConfirmDeleteImageOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={handleDeleteImage}
        title="Delete Image"
        message="Are you sure you want to delete this image? This action cannot be undone."
        confirmText="Delete Image"
        cancelText="Cancel"
        variant="danger"
        isLoading={loading}
      />

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
