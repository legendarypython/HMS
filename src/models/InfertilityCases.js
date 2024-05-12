
const mongoose = require('mongoose'); 
const {investigationsSchema} = require('../models/Investigations');
const {getUniqueIdForMongo} = require ('../helpers/helper');
const primaryHistorySchema = new mongoose.Schema({
    investigations: investigationsSchema
}); 


const secondaryHistorySchema =new mongoose.Schema({
    investigations: investigationsSchema, 
    obstetricHistory:    {
        type: String,
    enum: ["G", "P", "A", "L"]
}

}); 

const infertilityCaseSchema = new mongoose.Schema({

    caseId: {
        type: Number,
        unique: true
    },
    patientId: {
        type: Number,
        required: true,
    },
    primaryHistory: primaryHistorySchema,
    secondaryHistory: secondaryHistorySchema,
  
    },
    
);

infertilityCaseSchema.pre("save", async function (next) {
    try {
        const infertility = this;
        
        // Only generate a new caseId if the document is new
        if (!infertility.isNew) {
            return next();
        }

        // Assume getUniqueIdForMongo is a function that generates a unique ID
        const uniqueId = await getUniqueIdForMongo(mongoose.model("infertilityCases"), 'caseId');
        
        // Set the caseId property of the document to the generated unique ID
        infertility.caseId = uniqueId;

        // Proceed to save the document
        next();
    } catch (err) {
        // Pass the error to the next function to handle it appropriately
        next(err);
    }
});
const infertilityCases = mongoose.model('infertilityCases', infertilityCaseSchema);
module.exports = infertilityCases;



