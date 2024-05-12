const mongoose = require('mongoose');

const patientContactSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    phone: {
        type: String
    },
    email: {
        type: String
    },
    address: {
        type: String
    }
});

const patientContact = mongoose.model('PatientContact', contactSchema);

module.exports = Contact;
