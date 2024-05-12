const mongoose = require('mongoose'); 

const medicalHistorySchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    allergies: [{
        type: String
    }],
    medications: [{
        name: String,
        dosage: String
    }],
    conditions: [{
        type: String
    }]
}); 

const MedicalHistory = mongoose.model('patientMedicalHistory', medicalHistorySchema);
module.exports = MedicalHistory;