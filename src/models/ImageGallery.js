import mongoose from 'mongoose';

const ImageGallerySchema = new mongoose.Schema({
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
  image: {
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
    }
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

ImageGallerySchema.index({ position: 1, isActive: 1 });

ImageGallerySchema.index({ year: 1 });
ImageGallerySchema.index({ location: 1 });
ImageGallerySchema.index({ venue: 1 });

ImageGallerySchema.statics.getNextPosition = async function() {
  const lastImage = await this.findOne({ isActive: true })
    .sort({ position: -1 })
    .select('position');
  
  return lastImage ? lastImage.position + 1 : 0;
};

ImageGallerySchema.statics.reorderPositions = async function(imageIds) {
  const bulkOps = imageIds.map((id, index) => ({
    updateOne: {
      filter: { _id: id },
      update: { position: index }
    }
  }));
  
  return await this.bulkWrite(bulkOps);
};

export default mongoose.models.ImageGallery || mongoose.model('ImageGallery', ImageGallerySchema);