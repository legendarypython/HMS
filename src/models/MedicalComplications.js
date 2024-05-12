const mongoose = require('mongoose');
exports.medicalComplicationsSchema = new mongoose.Schema( {

    heartDisease: {
        type: String,
        default: '',
    },
    lungDisease: {
        type: String,
        default: '',
    },
    liverDisease: {
        type: String,
        default: '',
    },
    GIT: {
        type: String,
        default: ''
    }, 
    Kidney: {
        type: String,
        default: ''
    }, 
    SpineProblem: 
    {
        type: String, 
        default: ''
    },
    Others: 
    {
        type: String, 
        default: ''
    }, 
    documents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document' // Reference to the Document collection
    }]
});