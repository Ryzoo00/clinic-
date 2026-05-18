import mongoose from 'mongoose';

const diagnosisLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  symptoms: {
    type: String,
    required: true,
    trim: true
  },
  aiResponse: {
    possible_conditions: [String],
    severity: {
      type: String,
      enum: ['low', 'medium', 'high']
    },
    recommendations: [String],
    should_see_doctor: Boolean,
    confidence: Number,
    note: String
  },
  confidence: {
    type: Number,
    min: 0,
    max: 1
  }
}, {
  timestamps: true
});

// Index for faster queries
diagnosisLogSchema.index({ userId: 1 });
diagnosisLogSchema.index({ createdAt: -1 });

// Virtual populate for user details
diagnosisLogSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

// Ensure virtuals are included in JSON responses
diagnosisLogSchema.set('toJSON', { virtuals: true });
diagnosisLogSchema.set('toObject', { virtuals: true });

const DiagnosisLog = mongoose.model('DiagnosisLog', diagnosisLogSchema);

export default DiagnosisLog;
