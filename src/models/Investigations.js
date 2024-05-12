const mongoose = require('mongoose');


// Define sub-schemas for each investigation type
const investigationSchema = new mongoose.Schema({
    documents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document' // Reference to the Document collection
    }],
    details: {
        type: String,
        default: ''
    }
});

// Define the investigations schema as an object with mongoose schemas
exports.investigationsSchema = new mongoose.Schema({
    bloodInvestigation: investigationSchema,
    urineInvestigation: investigationSchema,
    ultrasoundInvestigation: investigationSchema,
    xrayInvestigation: investigationSchema
});


