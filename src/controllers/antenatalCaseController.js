const AnteNatal = require("../models/AnteNatalCases"); 
const Document = require('../models/Documents');

const moment = require('moment');

const populatePaths = [
    ('investigations.bloodInvestigation.documents'),
    ('investigations.urineInvestigation.documents'),
    ('investigations.ultrasoundInvestigation.documents'),
    ('investigations.xrayInvestigation.documents'),
    ('medicalComplications.documents')
]
exports.createAnteNatalCase = async (req, res, next) => {
    try {
        const data = req.body;


        
        // Create a new AnteNatal instance
        const anteNatal = new AnteNatal(
            data
        );

       
        // Save the instance to the database
       const newAnteNatalCase =  await anteNatal.save();
       if (req.files) {
         const bloodInvestigationDocs = req.files["investigations.bloodInvestigations.documents"] ? mapDocument(req.files["investigations.bloodInvestigations.documents"], newAnteNatalCase) : [];
         const urineInvestigationDocs = req.files["investigations.urineInvestigation.documents"] ? mapDocument(req.files["investigations.urineInvestigation.documents"], newAnteNatalCase) : [];
         const ultrasoundInvestigationDocs = req.files["investigations.ultrasoundInvestigation.documents"] ?  mapDocument(req.files["investigations.ultrasoundInvestigation.documents"], newAnteNatalCase) : [];
         const xrayInvestigationDocs = req.files["investigations.xrayInvestigation.documents"] ? mapDocument(req.files["investigations.xrayInvestigation.documents"], newAnteNatalCase) : [];

        // Create and save each document
        const bloodInvestigationSavedDocuments = await Promise.all(
          bloodInvestigationDocs.map(async doc => {
            const newDocument = new Document(doc);
            return await newDocument.save();
          })
        );
        let docIds = bloodInvestigationSavedDocuments.map(doc => {
          return doc._id;
        });
        newAnteNatalCase.investigations.bloodInvestigation.documents.push(...docIds); 
        const urineInvestigationSavedDocuments = await Promise.all(
          urineInvestigationDocs.map(async doc => {
            const newDocument = new Document(doc);
            return await newDocument.save();
          })); 
          docIds =  urineInvestigationSavedDocuments.map(doc => {
            return doc._id;
          });

        newAnteNatalCase.investigations.urineInvestigation.documents.push(...docIds);
        const ultrasoundInvestigationSavedDocuments = await Promise.all(
          ultrasoundInvestigationDocs.map(async doc => {
            const newDocument = new Document(doc);
            return await newDocument.save();
          }));
          docIds =  ultrasoundInvestigationSavedDocuments.map(doc => {
            return doc._id;
          });
          newAnteNatalCase.investigations.ultrasoundInvestigation.documents.push(...docIds);

          
          const xrayInvestigationSavedDocuments = await Promise.all(
            xrayInvestigationDocs.map(async doc => {
              const newDocument = new Document(doc);
              return await newDocument.save();
            }));
            docIds =  xrayInvestigationSavedDocuments.map(doc => {
              return doc._id;
            });
            newAnteNatalCase.investigations.xrayInvestigation.documents.push(...docIds);

            await newAnteNatalCase.save();

      }
        // Return a success response
        res.HandleResponse(201, "Antenatal Case saved successfully", newAnteNatalCase);
    } catch (error) {
        console.error('Error in creating Antenatal Case:', error);
        next(error);
    }
};

  exports.getAnteNatalCaseById = async (req, res, next) => {
    try {
     const caseId = req.query.caseId;
     const anteNatal = await AnteNatal.findOne({ caseId: caseId }, {isDeleted: false}) .populate(populatePaths)
     if (!anteNatal) {
        return res.HandleResponse(404, "Antenatal Case not found");
    }
     return res.HandleResponse(200, "Antenatal Case fetched successfully", anteNatal);
    } catch (error) {
      console.error('Error Getting AnteNatal Case:', error);
      return next(error);
    }
  };
  
  exports.getAnteNatalCaseByPatientId = async (req, res, next) => {
    try {
     const patientId = req.query.patientId;
     const anteNatal = await AnteNatal.find({ patientId: patientId} , {isDeleted: false}).populate(populatePaths);
    
     if (!anteNatal || !anteNatal.length){
        return res.HandleResponse(404, "Antenatal Case not found");
    }
     return res.HandleResponse(200, "Antenatal Cases fetched successfully", anteNatal[0]);
    } catch (error) {
      console.error('Error Getting AnteNatal  case by PatientId:', error);
      return next(error);
    }
  };
  
  exports.updateAnteNatalCase = async (req, res, next) => {
    try {
      const data = req.body.data;
      const caseId = data.caseId;
      const anteNatal = await AnteNatal.findOneAndUpdate({ caseId: caseId }, data, {new: true}).populate(populatePaths);
      if (!anteNatal) {
        return res.HandleResponse(404, "Antenatal Case not found");
    }
     return res.HandleResponse(200, "Antenatal Case updated successfully", anteNatal);
    } catch (error) {
      console.error('Error in updating Antenatal Case:', error);
      return next(error);
    }
  };

  exports.deleteAnteNatalCase = async (req, res, next) => {
    try {
      const caseId = req.query.caseId;
      const anteNatal = await AnteNatal.findOneAndUpdate({ caseId: caseId }, { isDeleted: true });
     return res.HandleResponse(200, "Antenatal Case deleted successfully", anteNatal);
    } catch (error) {
      console.error('Error in deleting Antenatal Case:', error);
      return next(error);
    }
  };

  exports.getAllAnteNatalCases = async (req, res, next) => {
    try {
     const anteNatal = await AnteNatal.find({}, {isDeleted: false}).populate(populatePaths);

     if (!anteNatal || anteNatal.length === 0) {
        return res.HandleResponse(404, "AnteNatal Cases not found");
    }
     return res.HandleResponse(200, "AnteNatal Cases fetched successfully", anteNatal);
    } catch (error) {
      console.error('Error Getting AnteNatal Cases:', error);
       next(error);
    }
  };


  exports.mapDocument = (documents, savedPatient) => {
    return documents.map(doc => ({
      filename: doc.filename,
      originalname: doc.originalname,
      mimetype: doc.mimetype,
      size: doc.size,
      date: moment().format('YYYY-MM-DD'), 
      patientId: savedPatient._id            }));}

    