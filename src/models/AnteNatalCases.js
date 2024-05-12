
const mongoose = require('mongoose'); 
const helper = require("../helpers/helper");
const {medicalComplicationsSchema} = require('../models/MedicalComplications')
const {investigationsSchema} = require('../models/Investigations')
const anteNatalCaseSchema = new mongoose.Schema({

    caseId: {
        type: Number,
        unique: true,
    },
    patientId: {
        type: Number,
        required: true   },
        
    obstetricHistory: {
        type: String,
        required: true,
        enum: ["G", "P", "A", "L"]

    },
    LMP: {
        type: String,
        required: true,
    },
    expectedDateOfDelivery: {
        type: Date,
        required: true,
    },
    specificHistory: {

     pregnancyComplications: {
        type: String,
        required: false,
    }, 
    previousDeliveryBy: {
        type: String,
        required: false,
        enum: ["Normal", "Caesarean", "Ventouse", "Others"]
    },
    },
    
   
    medicalComplications: medicalComplicationsSchema, // Embedded document for medical complications
    investigations: investigationsSchema, // Embedded document for investigations
});
anteNatalCaseSchema.pre('save', async function(next) {
    try {
    const patient = this;
    if (!this.isNew) {
      return  next();
    }
        patient.caseId = await  helper.getUniqueIdForMongo(mongoose.model('anteNatalCases'), 'caseId', next);
      return next();
    } catch (error) {
      return next(error);
    }
  });

const anteNatalCases = mongoose.model('anteNatalCases', anteNatalCaseSchema);
module.exports = anteNatalCases;

