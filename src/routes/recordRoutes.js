const express = require('express');
const router = express.Router();
const recordController = require('../controllers/patientRecordController');
const multer = require('multer'); // Import multer for file uploads
const path = require('path'); // Import path for handling file paths

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Specify the directory where uploaded files will be stored
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext); // Define the filename for the uploaded file
    },
  });
  
  // Initialize multer middleware with the configured storage
  const upload = multer({ storage: storage });
//router.use(userAuthentication); // Middleware to protect routes

router.get('/all', recordController.getAllPatients);
router.get('/:id', recordController.getPatientById);
router.post('/create', upload.array('documents', 10), recordController.createPatient);
router.put('/update', recordController.updatePatient);
router.post('/search', recordController.searchPatients);

//router.delete('/patients/remove', recordController.deletePatient);



module.exports = router;
