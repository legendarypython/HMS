const Infertility = require("../models/InfertilityCases"); 
const Document = require('../models/Documents');

const moment = require('moment');
const anteNatalCaseController = require('../controllers/antenatalCaseController.js');

const populatePaths = [
    'primaryHistory.investigations.bloodInvestigation.documents',
    'primaryHistory.investigations.urineInvestigation.documents',
    'primaryHistory.investigations.ultrasoundInvestigation.documents',
    'primaryHistory.investigations.xrayInvestigation.documents',
    'secondaryHistory.investigations.bloodInvestigation.documents',
    'secondaryHistory.investigations.urineInvestigation.documents',
    'secondaryHistory.investigations.ultrasoundInvestigation.documents',
    'secondaryHistory.investigations.xrayInvestigation.documents'
];
exports.createInfertilityCase = async (req, res, next) => {
    try {
        const data = req.body;
        
        // Create a new Infertlity instance
        const infertlity = new Infertility(
            data
        );
        
        // Save the instance to the database
        const newInfertilityCase = await infertlity.save();

        if (req.files) {
          // Handle primary history investigation documents
          const handlePrimaryHistoryInvestigations = async (category, documentsKey) => {
            if (req.files[documentsKey]) {
              const docs = anteNatalCaseController.mapDocument(req.files[documentsKey], newInfertilityCase);
              const savedDocuments = await Promise.all(
                docs.map(async (doc) => {
                  const newDocument = new Document(doc);
                  return await newDocument.save();
                })
              );
        
              const docIds = savedDocuments.map((doc) => doc._id);
              newInfertilityCase.primaryHistory.investigations[category].documents.push(...docIds);
            }
          };
        
          // Handle secondary history investigation documents
          const handleSecondaryHistoryInvestigations = async (category, documentsKey) => {
            if (req.files[documentsKey]) {
              const docs = anteNatalCaseController.mapDocument(req.files[documentsKey], newInfertilityCase);
              const savedDocuments = await Promise.all(
                docs.map(async (doc) => {
                  const newDocument = new Document(doc);
                  return await newDocument.save();
                })
              );
        
              const docIds = savedDocuments.map((doc) => doc._id);
              newInfertilityCase.secondaryHistory.investigations[category].documents.push(...docIds);
            }
          };
        
          // Define primary and secondary history investigation mappings
          const primaryHistoryInvestigations = {
            bloodInvestigation: "primaryHistory.investigations.bloodInvestigation.documents",
            urineInvestigation: "primaryHistory.investigations.urineInvestigation.documents",
            ultrasoundInvestigation: "primaryHistory.investigations.ultrasoundInvestigation.documents",
            xrayInvestigation: "primaryHistory.investigations.xrayInvestigation.documents",
          };
        
          const secondaryHistoryInvestigations = {
            bloodInvestigation: "secondaryHistory.investigations.bloodInvestigation.documents",
            urineInvestigation: "secondaryHistory.investigations.urineInvestigation.documents",
            ultrasoundInvestigation: "secondaryHistory.investigations.ultrasoundInvestigation.documents",
            xrayInvestigation: "secondaryHistory.investigations.xrayInvestigation.documents",
          };
        
          // Process primary history investigations
          await Promise.all(
            Object.entries(primaryHistoryInvestigations).map(([category, documentsKey]) =>
              handlePrimaryHistoryInvestigations(category, documentsKey)
            )
          );
        
          // Process secondary history investigations
          await Promise.all(
            Object.entries(secondaryHistoryInvestigations).map(([category, documentsKey]) =>
              handleSecondaryHistoryInvestigations(category, documentsKey)
            )
          );
        
          // Save updated infertility case with all documents
          await newInfertilityCase.save();
        }
        
        // Return a success response
        res.HandleResponse(201, "Infertility Case saved successfully", newInfertilityCase);
    } catch (error) {
        console.error('Error in creating Infertility Case:', error);
        next(error);
    }
};

exports.getAllInfertilityCases = async (req, res, next) => {
    try {
     const infertility = await Infertility.find({}, {isDeleted: false}).populate(populatePaths);
     if (!infertility || infertility.length === 0) {
        return res.HandleResponse(404, "Inferility Cases not found");
    }
     return res.HandleResponse(200, "Infertility Cases fetched successfully", infertility);
    } catch (error) {
      console.error('Error Getting Infertlity Cases:', error);
       next(error);
    }
  };

  exports.getInfertilityCaseById = async (req, res, next) => {
    try {
     const caseId = req.query.caseId;
     const infertility = await Infertility.findOne({ caseId: caseId }, {isDeleted: false}).populate(populatePaths);
     if (!infertility) {
        return res.HandleResponse(404, "Infertility Case not found");
    }
     return res.HandleResponse(200, "Infertility Case fetched successfully", infertility);
    } catch (error) {
      console.error('Error Getting Infertlity Case:', error);
       next(error);
    }
  };
  
  exports.geInfertilityCaseByPatientId = async (req, res, next) => {
    try {
     const patientId = req.query.patientId;
     const infertility = await Infertility.find({ patientId: patientId} , {isDeleted: false}).populate(populatePaths);

     if (!infertility || !infertility.length){
        return res.HandleResponse(404, "Infertility Case not found");
    }
     return res.HandleResponse(200, "Infertility Cases fetched successfully", infertility);
    } catch (error) {
      console.error('Error Getting Infertility  case by patient id:', error);
      return next(error);
    }
  };
  
  exports.updateInfertilityCase = async (req, res, next) => {
    try {
      const data = req.body.data;
      const caseId = data.caseId;
      const infertility = await Infertility.findOneAndUpdate({ caseId: caseId }, data, {new: true}) .populate(populatePaths);
      if (!infertility) {
        return res.HandleResponse(404, "Infertility Case not found");
    }
     return res.HandleResponse(200, "Infertility Case updated successfully", infertility);
    } catch (error) {
      console.error('Error in updating Infertility Case:', error);
      return next(error);
    }
  };

  exports.deleteInfertilityCase = async (req, res, next) => {
    try {
      const caseId = req.query.caseId;
      const infertility = await Infertility.findOneAndUpdate({ caseId: caseId }, { isDeleted: true });
     return res.HandleResponse(200, "Infertility Case deleted successfully", infertility);
    } catch (error) {
      console.error('Error in deleting Infertility Case:', error);
      return next(error);
    }
  };