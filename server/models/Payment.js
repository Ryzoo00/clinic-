import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Please provide payment amount']
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'INR', 'PKR']
  },
  method: {
    type: String,
    enum: ['credit_card', 'debit_card', 'upi', 'cash', 'bank_transfer'],
    required: [true, 'Please provide payment method']
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true
  },
  cardDetails: {
    lastFour: String,
    cardholderName: String,
    expiryDate: String
  },
  upiDetails: {
    upiId: String,
    transactionRef: String
  },
  description: {
    type: String,
    trim: true,
    default: 'Appointment fee'
  },
  receiptUrl: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Indexes
paymentSchema.index({ appointmentId: 1 });
paymentSchema.index({ patientId: 1 });
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ status: 1 });

// Generate transaction ID
paymentSchema.pre('save', function(next) {
  if (!this.transactionId) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    this.transactionId = `TXN-${timestamp}-${random}`;
  }
  next();
});

paymentSchema.set('toJSON', { virtuals: true });
paymentSchema.set('toObject', { virtuals: true });

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
