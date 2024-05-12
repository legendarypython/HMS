const General = require("../models/GeneralCases"); 
const populatePaths = [
    'documents'
];
exports.createGeneralCase = async (req, res, next) => {
    try {
        const data = req.body.data;
        
        // Create a new Infertlity instance
        const infertlity = new General(
            data
        );
        
        // Save the instance to the database
        await infertlity.save();

        // Return a success response
        res.HandleResponse(201, "General Case saved successfully", infertlity);
    } catch (error) {
        console.error('Error in creating General Case:', error);
        next(error);
    }
};

exports.getAllGeneralCases = async (req, res, next) => {
    try {
     const general = await General.find({}, {isDeleted: false}).populate(populatePaths);
     if (!general || general.length === 0) {
        return res.HandleResponse(404, "Inferility Cases not found");
    }
     return res.HandleResponse(200, "General Cases fetched successfully", general);
    } catch (error) {
      console.error('Error Getting Infertlity Cases:', error);
       next(error);
    }
  };

  exports.getGeneralCaseById = async (req, res, next) => {
    try {
     const caseId = req.query.caseId;
     const general = await General.findOne({ caseId: caseId }, {isDeleted: false}).populate(populatePaths);
     if (!general) {
        return res.HandleResponse(404, "General Case not found");
    }
     return res.HandleResponse(200, "General Case fetched successfully", general);
    } catch (error) {
      console.error('Error Getting Infertlity Case:', error);
       next(error);
    }
  };
  
  exports.geGeneralCaseByPatientId = async (req, res, next) => {
    try {
     const patientId = req.query.patientId;
     const general = await General.find({ patientId: patientId} , {isDeleted: false}).populate(populatePaths);

     if (!general || !general.length){
        return res.HandleResponse(404, "General Case not found");
    }
     return res.HandleResponse(200, "General Cases fetched successfully", general);
    } catch (error) {
      console.error('Error Getting General  case by patient id:', error);
      return next(error);
    }
  };
  
  exports.updateGeneralCase = async (req, res, next) => {
    try {
      const data = req.body.data;
      const caseId = data.caseId;
      const general = await General.findOneAndUpdate({ caseId: caseId }, data, {new: true}) .populate(populatePaths);
      if (!general) {
        return res.HandleResponse(404, "General Case not found");
    }
     return res.HandleResponse(200, "General Case updated successfully", general);
    } catch (error) {
      console.error('Error in updating General Case:', error);
      return next(error);
    }
  };

  exports.deleteGeneralCase = async (req, res, next) => {
    try {
      const caseId = req.query.caseId;
      const general = await General.findOneAndUpdate({ caseId: caseId }, { isDeleted: true });
     return res.HandleResponse(200, "General Case deleted successfully", general);
    } catch (error) {
      console.error('Error in deleting General Case:', error);
      return next(error);
    }
  };