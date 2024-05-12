const mongoose = require('mongoose');

const documentsSchema = new mongoose.Schema({

    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient', // Reference to the Patient model
        required: true
      },

 date: {
    type: Date,
    required: true
  },
  details: {
    type: String,
    default: ''
  },
  filename: {
    type: String,
    required: true
  },
  mimeType: {
    type: String,
    required: false
  },
  size: {
    type: Number,
    required: true
  }
});

const Document = mongoose.model('Document', documentsSchema);

module.exports = Document;
