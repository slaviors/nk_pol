'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Award, Eye, Building2 } from 'lucide-react';
import Image from 'next/image';
import Modal from '@/components/ui/admin/Modal';
import ConfirmModal from '@/components/ui/admin/ConfirmModal';
import FileUpload from '@/components/ui/admin/FileUpload';
import Button from '@/components/ui/admin/Button';
import Input from '@/components/ui/admin/Input';
import Alert from '@/components/ui/admin/Alert';
import Card from '@/components/ui/admin/Card';

export default function ClientLogoManage() {
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Form states
  const [uploadFiles, setUploadFiles] = useState([]);
  const [titles, setTitles] = useState([]);

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

  const resetForm = () => {
    setUploadFiles([]);
    setTitles([]);
  };

  const handleFilesChange = (files) => {
    setUploadFiles(files);
    setTitles(files.map(f => f.name.split('.')[0]));
  };

  const handleTitleChange = (index, newTitle) => {
    const newTitles = [...titles];
    newTitles[index] = newTitle;
    setTitles(newTitles);
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (uploadFiles.length === 0) {
      setError('Please select at least one logo');
      return;
    }

    try {
      setLoading(true);
      setError('');

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
        const successMsg = `Successfully uploaded ${data.successCount} logo${data.successCount > 1 ? 's' : ''}!`;
        setSuccess(successMsg);

        if (data.errorCount > 0) {
          setError(`${data.errorCount} file${data.errorCount > 1 ? 's' : ''} failed to upload.`);
        }

        setCreateModalOpen(false);
        resetForm();
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

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('auth-token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`/api/admin/clientLogo/${selectedLogo._id}`, {
        method: 'PUT',
        credentials: 'include',
        headers,
        body: JSON.stringify({ title: titles[0] })
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('Logo updated successfully!');
        setEditModalOpen(false);
        resetForm();
        fetchLogos();
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

      const response = await fetch(`/api/admin/clientLogo/${deleteTarget}`, {
        method: 'DELETE',
        credentials: 'include',
        headers
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('Logo deleted successfully!');
        setConfirmDeleteOpen(false);
        setDeleteTarget(null);
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

  const openDeleteModal = (id) => {
    setDeleteTarget(id);
    setConfirmDeleteOpen(true);
  };

  const openEditModal = (logo) => {
    setSelectedLogo(logo);
    setTitles([logo.title || '']);
    setEditModalOpen(true);
  };

  const openPreviewModal = (logo) => {
    setSelectedLogo(logo);
    setPreviewModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-gray-100">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Client Logos</h2>
          <p className="text-sm text-gray-600 mt-2 font-medium">
            Manage client and partner logos • {logos.length} total
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
          Add Logos
        </Button>
      </div>

      {/* Alerts */}
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      {/* Logos Grid */}
      {loading && logos.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
        </div>
      ) : logos.length === 0 ? (
        <Card className="p-16 bg-gradient-to-br from-gray-50 to-white">
          <div className="text-center">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <Award className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No client logos yet</h3>
            <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">Get started by adding your first client or partner logo</p>
            <Button onClick={() => setCreateModalOpen(true)} variant="primary" size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Add First Logo
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {logos.map((logo, index) => (
            <Card
              key={logo._id}
              hover
              className="group overflow-hidden"
              style={{ animation: `fadeInScale 0.3s ease-out ${index * 0.05}s both` }}
            >
              {/* Logo Image */}
              <div className="relative aspect-square bg-gradient-to-br from-white to-gray-50 overflow-hidden p-4">
                {logo.image?.url ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src={logo.image.url}
                      alt={logo.title || 'Client Logo'}
                      fill
                      className="object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Building2 className="w-12 h-12 text-gray-300" />
                  </div>
                )}

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-1 p-2">
                  <Button
                    onClick={() => openPreviewModal(logo)}
                    variant="secondary"
                    size="sm"
                    className="transform scale-90 group-hover:scale-100"
                  >
                    <Eye className="w-3 h-3" />
                  </Button>
                  <Button
                    onClick={() => openEditModal(logo)}
                    variant="secondary"
                    size="sm"
                    className="transform scale-90 group-hover:scale-100"
                  >
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  <Button
                    onClick={() => openDeleteModal(logo._id)}
                    variant="danger"
                    size="sm"
                    className="transform scale-90 group-hover:scale-100"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {/* Title */}
              <div className="p-3 bg-gradient-to-b from-white to-gray-50 border-t-2 border-gray-100">
                <p className="text-xs font-bold text-gray-900 text-center truncate" title={logo.title}>
                  {logo.title}
                </p>
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
        title="Add Client Logos"
        size="lg"
      >
        <form onSubmit={handleCreate} className="space-y-6">
          <FileUpload
            files={uploadFiles}
            onChange={handleFilesChange}
            maxFiles={10}
            accept="image/png,image/jpeg,image/jpg,image/svg+xml"
            label="Upload Logos (PNG, JPG, SVG • Max 10)"
          />

          {uploadFiles.length > 0 && (
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-900">
                Logo Titles
              </label>
              {uploadFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-600">{index + 1}</span>
                  </div>
                  <Input
                    value={titles[index] || ''}
                    onChange={(e) => handleTitleChange(index, e.target.value)}
                    placeholder={`Logo ${index + 1} title`}
                    className="flex-1"
                  />
                </div>
              ))}
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
              Upload {uploadFiles.length > 0 && `(${uploadFiles.length})`}
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
        title="Edit Logo Title"
        size="md"
      >
        <form onSubmit={handleUpdate} className="space-y-6">
          {selectedLogo?.image?.url && (
            <div className="p-6 bg-gray-50 rounded-xl border-2 border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-3">Current Logo:</p>
              <div className="relative w-full aspect-square max-w-xs mx-auto bg-white rounded-xl p-4 border-2 border-gray-200">
                <Image
                  src={selectedLogo.image.url}
                  alt={selectedLogo.title}
                  fill
                  className="object-contain p-2"
                />
              </div>
            </div>
          )}

          <Input
            label="Logo Title"
            required
            value={titles[0] || ''}
            onChange={(e) => setTitles([e.target.value])}
            placeholder="Enter logo title"
          />

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
              Update Logo
            </Button>
          </div>
        </form>
      </Modal>

      {/* Preview Modal */}
      <Modal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        title="Logo Preview"
        size="md"
      >
        {selectedLogo && (
          <div className="space-y-6">
            {/* Logo Display */}
            <div className="p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-gray-200">
              <div className="relative w-full aspect-square max-w-sm mx-auto bg-white rounded-xl shadow-lg p-6">
                {selectedLogo.image?.url ? (
                  <Image
                    src={selectedLogo.image.url}
                    alt={selectedLogo.title}
                    fill
                    className="object-contain p-4"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Building2 className="w-20 h-20 text-gray-300" />
                  </div>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div className="pb-4 border-b-2 border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 text-center">
                  {selectedLogo.title}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {selectedLogo.image?.size && (
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 font-medium mb-1">File Size</p>
                    <p className="text-sm font-bold text-gray-900">
                      {(selectedLogo.image.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                )}
                {selectedLogo.image?.contentType && (
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 font-medium mb-1">Format</p>
                    <p className="text-sm font-bold text-gray-900 uppercase">
                      {selectedLogo.image.contentType.split('/')[1]}
                    </p>
                  </div>
                )}
              </div>

              {selectedLogo.createdAt && (
                <div className="pt-4 border-t-2 border-gray-100">
                  <p className="text-xs text-gray-500 font-medium text-center">
                    Added: {new Date(selectedLogo.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={confirmDeleteOpen}
        onClose={() => {
          setConfirmDeleteOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={handleDelete}
        title="Delete Client Logo"
        message="Are you sure you want to delete this logo? This action cannot be undone."
        confirmText="Delete Logo"
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
