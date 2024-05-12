const mongoose = require('mongoose');
const { getUniqueIdForMongo } = require('../helpers/helper');
const generalCasesSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    caseId: {
        type: String, 
        unique: true
    },
    documents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document'
    }], 
    diagnosis:{
        type: String,
        default: ''
    }
}); 

generalCasesSchema.pre("save", async function (next) {
    try{

    const generalCase = this; 
    if (!generalCase.isNew) {
        return next();
    }
    const uniqueId = await getUniqueIdForMongo(mongoose.model("GeneralCase"), 'caseId', next);
    this.caseId = uniqueId;
    next();
}
catch(ex)
{
    return next(ex);
}

    
})