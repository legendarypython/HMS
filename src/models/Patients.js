const mongoose = require('mongoose');
const { getUniqueIdForMongo } = require('../helpers/helper');
const patientSchema = new mongoose.Schema({
    patientId: {
        type: Number, 
        required: false
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },

    husbandFirstName: {
        type: String, 
        default: ''
    }, 

    husbandLastName: {
        type: String, 
        default: ''
    }, 

    
    dateOfBirth: {
        type: String,
        required: true
    },
    husbandDOB: {
        type: String
    },
    address: {
        type: String,
        required: true
    }, 
    aadhar: {
        type: String, 
        required: true
    }, 
    phone: {
        type: String, 
        default: ''
    },
    email: {
        type: String, 
        default: ''
    },
    husbandAadhar: {
        type: String, 
        default: ''
    },
    marriedFor: {
        type: Number, 
        required: true
    }, 
    diagnosis: {
        type: String, 
        default: ''
    }, 
    caseType: {
        type: Number, 
        enum: [1, 2 , 3] //1 - AnteNatal, 2 -Infertility , 3- General
        
    },
    documents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document'
    }], 
    dateOfAdmission: {
        type: String,
        required: true
    },
    isNewPatient: {
        type: Boolean,
        required: true
    }
    
});
patientSchema.pre('save', async function(next) {
    try {
    const patient = this;
    if (!this.isNew) {
      return  next();
    }
        const patientId = await getUniqueIdForMongo(mongoose.model('Patient'), 'patientId', next);
        patient.patientId = patientId;
        patient.dateOfAdmission = new Date(patient.dateOfAdmission).toISOString();
     
      return next();
    } catch (error) {
      return next(error);
    }
  });

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
 