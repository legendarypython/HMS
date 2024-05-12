const jwt = require('jsonwebtoken');
const Patient = require('../models/Patients');
const Document = require('../models/Documents');

const moment = require('moment');
exports.getAllPatients = async (req, res, next) => {
    try {
        const allPatientInfo = await Patient.find({})
            .populate("documents");

        res.HandleResponse(200, 'Patients retrieved successfully', allPatientInfo);
    } catch (error) {
        next(error);
    }
}

exports.getPatientById = async (req, res, next) => {
    try {
        const patientId = req.params.id; 
        const patientInfo = await Patient.findOne({ patientId: patientId })
            .populate("documents");

        if (!patientInfo) {
            throw (new Error('Patient not found'));
        }

        res.HandleResponse( 200,'Patient retrieved successfully', patientInfo);
    } catch (error) {
        next(error);
    }
}

    exports.createPatient = async (req, res, next) => {
        try {
          // Extract patient details from the request body
          const {
            firstName,
            lastName,
            dateOfBirth,
            address,
            aadhar,
            phone,
            email,
            marriedFor,
            diagnosis,
            dateOfAdmission,
            isNewPatient, 
            caseTypeEnum
          } = req.body;
      
          // Create a new patient object
          const newPatient = new Patient({
            firstName,
            lastName,
            dateOfBirth,
            address,
            aadhar,
            phone,
            email,
            marriedFor,
            diagnosis,
            dateOfAdmission,
            isNewPatient,
            caseType: caseTypeEnum // Convert string to boolean if needed
          });
      
          // Save the patient to the database
          const savedPatient = await newPatient.save();
      
          // Handle document uploads
          if (req.files && req.files.length > 0) {
            const documents = req.files.map(file => ({
              filename: file.filename,
              originalname: file.originalname,
              mimetype: file.mimetype,
              size: file.size,
              date: moment().format('YYYY-MM-DD'), 
              patientId: savedPatient._id            }));
      
            // Create and save each document
            const savedDocuments = await Promise.all(
              documents.map(async doc => {
                const newDocument = new Document(doc);
                return await newDocument.save();
              })
            );
      
            // Update patient's documents array with the IDs of the saved documents
            savedPatient.documents.push(...savedDocuments.map(doc => doc._id));
      
            // Save the updated patient with the new documents
            await savedPatient.save();
          }
      
          // Respond with success message and the created patient
          res.status(201).json({
            message: 'Patient created successfully',
            patient: savedPatient
          });
        } catch (error) {
          // Pass any errors to the error handling middleware
          next(error);
        }
      };


exports.updatePatient = async (req, res, next) => {
    try {
        const patientDetails = req.body.data;
        const patientId = patientDetails.patientId;
        const updatedInfo = await Patient.findOneAndUpdate(
            { patientId: patientId },
            patientDetails,
            { new: true }
        ).populate("documents");

        if (!updatedInfo) {
            throw (new Error('Patient not found'));
        }

        res.HandleResponse(200, 'Patient updated successfully', updatedInfo);
    } catch (error) {
        next(error);
    }
}

// Define a mapping object for converting string values to integers
const caseTypeMapping = {
    'AnteNatal': 1,
    'Infertility': 2,
    'General': 3
};

exports.searchPatients = async (req, res, next) => {
    try {
        const { name, mobile, sortBy = 'firstName', order = 'asc', page = 1, limit = 10, filters } = req.body;

        // Build the search query based on name and mobile filters
        const searchQuery = {};
        if (name && name.trim() !== '') {
            searchQuery.firstName = { $regex: new RegExp(name, 'i') }; // Case-insensitive partial match
        }
        if (mobile && mobile.trim() !== '') {
            searchQuery.phone = { $regex: new RegExp(mobile, 'i') }; // Case-insensitive partial match
        }

        if (filters && filters.CaseType && filters.CaseType.length > 0) {
            // Map filter values to integers using the mapping object
            const caseTypeValues = filters.CaseType.map(type => caseTypeMapping[type]);
            // Add the converted values to the search query
            searchQuery.caseType = { $in: caseTypeValues };
        }

        if (filters && filters.startDate && filters.endDate) {
            searchQuery.dateOfAdmission = {
                $gte: new Date(filters.startDate),
                $lte: new Date(filters.endDate)
            };
        }

        if (filters && filters.IsNewPatient) {
            searchQuery.isNewPatient = filters.IsNewPatient === 'Yes';
        }

        // Calculate pagination options
        const skip = (page - 1) * limit;

        // Fetch data based on search query and sorting options
        const patients = await Patient.find(searchQuery)
            .sort({ [sortBy]: order === 'asc' ? 1 : -1 }) // Apply sorting
            .skip(skip)
            .limit(limit);
        const totalCount = await Patient.countDocuments(searchQuery);

        // Return the results with pagination metadata
        res.status(200).json({
            success: true,
            message: 'Successfully fetched results',
            data: patients,
            pagination: {
                page,
                limit,
                total: totalCount
            }
        });
    } catch (error) {
        next(error);
    }
};


