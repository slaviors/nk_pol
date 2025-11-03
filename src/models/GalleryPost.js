import mongoose from 'mongoose';

const GalleryPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  year: {
    type: Number,
    min: [1800, 'Year cannot be earlier than 1800'],
    max: [new Date().getFullYear() + 10, 'Year cannot be more than 10 years in the future']
  },
  location: {
    type: String,
    trim: true,
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  venue: {
    type: String,
    trim: true,
    maxlength: [200, 'Venue cannot exceed 200 characters']
  },
  images: [{
    url: {
      type: String,
      required: [true, 'Image URL is required']
    },
    key: {
      type: String,
      required: [true, 'Storage key/fileId is required']
    },
    thumbnailUrl: {
      type: String,
      required: [true, 'Thumbnail URL is required']
    },
    name: {
      type: String,
      required: [true, 'Image name is required']
    },
    size: {
      type: Number,
      required: [true, 'File size is required']
    },
    contentType: {
      type: String,
      required: [true, 'Content type is required']
    },
    width: {
      type: Number
    },
    height: {
      type: Number
    },
    etag: {
      type: String
    },
    storageType: {
      type: String,
      enum: ['imagekit', 'r2'],
      required: true,
      default: 'r2'
    },
    isThumbnail: {
      type: Boolean,
      default: false
    }
  }],
  thumbnailIndex: {
    type: Number,
    default: 0,
    min: 0,
    max: 3
  },
  position: {
    type: Number,
    required: true,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

GalleryPostSchema.pre('save', function(next) {
  if (this.images && this.images.length > 4) {
    next(new Error('Maximum 4 images allowed per post'));
  }
  if (this.images && this.images.length < 1) {
    next(new Error('At least 1 image is required'));
  }
  next();
});

GalleryPostSchema.index({ position: 1, isActive: 1 });
GalleryPostSchema.index({ year: 1 });
GalleryPostSchema.index({ location: 1 });
GalleryPostSchema.index({ venue: 1 });
GalleryPostSchema.index({ createdAt: -1 });

GalleryPostSchema.statics.getNextPosition = async function() {
  const lastPost = await this.findOne({ isActive: true })
    .sort({ position: -1 })
    .select('position');
  
  return lastPost ? lastPost.position + 1 : 0;
};

GalleryPostSchema.statics.reorderPositions = async function(postIds) {
  const bulkOps = postIds.map((id, index) => ({
    updateOne: {
      filter: { _id: id },
      update: { position: index }
    }
  }));
  
  return await this.bulkWrite(bulkOps);
};

GalleryPostSchema.methods.getThumbnail = function() {
  if (!this.images || this.images.length === 0) return null;
  
  const thumbnailIndex = Math.min(this.thumbnailIndex, this.images.length - 1);
  return this.images[thumbnailIndex];
};

export default mongoose.models.GalleryPost || mongoose.model('GalleryPost', GalleryPostSchema);
