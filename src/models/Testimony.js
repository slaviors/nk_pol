import mongoose from 'mongoose';

const TestimonySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  title: {
    type: String,
    trim: true,
    maxlength: [150, 'Title cannot exceed 150 characters']
  },
  text: {
    type: String,
    required: [true, 'Please provide testimony text'],
    trim: true,
    maxlength: [1000, 'Testimony text cannot exceed 1000 characters']
  },
  star: {
    type: Number,
    required: [true, 'Please provide a star rating'],
    min: [1, 'Star rating must be at least 1'],
    max: [5, 'Star rating cannot exceed 5']
  },
  profileImage: {
    url: {
      type: String,
      required: [true, 'Profile image URL is required']
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
      enum: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
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

TestimonySchema.index({ position: 1, isActive: 1 });

TestimonySchema.index({ star: 1, isActive: 1 });

TestimonySchema.statics.getNextPosition = async function() {
  const lastTestimony = await this.findOne({ isActive: true })
    .sort({ position: -1 })
    .select('position');
  
  return lastTestimony ? lastTestimony.position + 1 : 0;
};

TestimonySchema.statics.reorderPositions = async function(testimonyIds) {
  const bulkOps = testimonyIds.map((id, index) => ({
    updateOne: {
      filter: { _id: id },
      update: { position: index }
    }
  }));
  
  return await this.bulkWrite(bulkOps);
};

export default mongoose.models.Testimony || mongoose.model('Testimony', TestimonySchema);