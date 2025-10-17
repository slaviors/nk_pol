// src/components/ui/admin/FileUpload.js
'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, FileImage } from 'lucide-react';
import Image from 'next/image';

export default function FileUpload({ 
  files = [], 
  onChange, 
  maxFiles = 4, 
  accept = "image/*",
  label = "Upload Images"
}) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const imageFiles = droppedFiles.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} images allowed`);
      return;
    }

    onChange(imageFiles);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    if (selectedFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} images allowed`);
      return;
    }

    onChange(selectedFiles);
  };

  const removeFile = (indexToRemove) => {
    const newFiles = files.filter((_, idx) => idx !== indexToRemove);
    onChange(newFiles);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-gray-900">
        {label}
        <span className="ml-2 text-xs font-medium text-gray-500">
          (Max {maxFiles} images)
        </span>
      </label>

      {/* Drop Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
        className={`
          relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 cursor-pointer
          ${isDragging 
            ? 'border-black bg-gray-50 scale-[1.02]' 
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center text-center space-y-3">
          <div className={`
            p-4 rounded-full transition-all duration-300
            ${isDragging ? 'bg-black text-white scale-110' : 'bg-gray-100 text-gray-600'}
          `}>
            <Upload className="w-8 h-8" />
          </div>
          
          <div>
            <p className="text-base font-bold text-gray-900">
              {isDragging ? 'Drop files here' : 'Drop files or click to upload'}
            </p>
            <p className="text-sm text-gray-600 mt-1 font-medium">
              PNG, JPG, WEBP up to 10MB
            </p>
          </div>
        </div>
      </div>

      {/* Preview Grid */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {files.map((file, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200"
              style={{ animation: `fadeInScale 0.3s ease-out ${index * 0.1}s both` }}
            >
              {file instanceof File ? (
                <Image
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <FileImage className="w-12 h-12 text-gray-400" />
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100 p-2 bg-white rounded-full hover:bg-red-500 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* File Name */}
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                <p className="text-xs text-white font-medium truncate">
                  {file.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
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
