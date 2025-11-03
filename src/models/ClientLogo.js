import mongoose from 'mongoose';

const ClientLogoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
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
      required: [true, 'Content type is required'],
      enum: ['image/png', 'image/svg+xml', 'image/jpeg', 'image/jpg']
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

ClientLogoSchema.index({ position: 1, isActive: 1 });

ClientLogoSchema.statics.getNextPosition = async function() {
  const lastLogo = await this.findOne({ isActive: true })
    .sort({ position: -1 })
    .select('position');
  
  return lastLogo ? lastLogo.position + 1 : 0;
};

ClientLogoSchema.statics.reorderPositions = async function(logoIds) {
  const bulkOps = logoIds.map((id, index) => ({
    updateOne: {
      filter: { _id: id },
      update: { position: index }
    }
  }));
  
  return await this.bulkWrite(bulkOps);
};

export default mongoose.models.ClientLogo || mongoose.model('ClientLogo', ClientLogoSchema);