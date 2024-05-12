const Document = require("../models/Documents"); 
const Patient = require("../models/Patients"); 
const path = require('path');
const fs = require('fs');
exports.createDocument = async (req, res, next) => {
    try {
      const documentData = req.body.data;
       const document = new Document(documentData);
       await document.save(); 

       const patientId = document.patientId; 
       const patient = await Patient.findOne({patientId: patientId});
       !patient.documents && ( patient.documents = []);
       patient.documents.push(document._id);
       await patient.save();
     return res.HandleResponse(201, "Document saved successfully", document);
    } catch (error) {
      console.error('Error logging in user:', error);
      return next(error);
    }
  };

  exports.getDocumentById = async (req, res, next) => {
    try {
     const documentId = req.params.id;
     const document = await Document.findOne({ _id: documentId});
     if(!document)
     {
       throw (new Error('Document not found'));
     }
     const filePath = path.join("C:\\Users\\Prope\\OneDrive\\Desktop\\HMS", 'uploads', document.filename);

     // Check if the file exists
     if (fs.existsSync(filePath)) {
      const contentType = getContentType(filePath);
    if (contentType) {
      // Set the Content-Type header
      res.setHeader('Content-Type', contentType);
       // Stream the file back to the client
       const fileStream = fs.createReadStream(filePath);
       fileStream.pipe(res);
     }} else {
       res.status(404).send('Document not found');
     }
    } catch (error) {
      console.error('Error logging in user:', error);
      return next(error);
    }
  };
  
  exports.getDocumentByPatientId = async (req, res, next) => {
    try {
     const patientId = req.query.patientId;
     const document = await Document.find({ patientId: patientId });
     return res.HandleResponse(201, "Document fetched successfully", document);
    } catch (error) {
      console.error('Error logging in user:', error);
      return next(error);
    }
  };
  
  // Helper function to determine Content-Type based on file extension
function getContentType(filePath) {
  const extname = path.extname(filePath).toLowerCase();
  switch (extname) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.pdf':
      return 'application/pdf';
    // Add support for other file types as needed
    default:
      return null; // Unsupported file type
  }
}