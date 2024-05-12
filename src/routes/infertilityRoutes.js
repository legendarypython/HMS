const express = require('express');
const router = express.Router();
const infertilityCasesController = require('../controllers/infertilityCaseController');
const multer = require('multer'); // Import multer for file uploads
const path = require('path'); // Import path for handling file paths

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Specify the directory where uploaded files will be stored
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null,"Document" + '-' + uniqueSuffix + ext); // Define the filename for the uploaded file
    },
  });
  const upload = multer({ storage: storage });

//router.use(userAuthentication); // Middleware to protect routes

//router.post('/delete', anteNatalCaseController.createAnteNatalCase);
router.get('/getById', infertilityCasesController.getInfertilityCaseById);
router.get('/getByPatientId', infertilityCasesController.geInfertilityCaseByPatientId);
router.post('/create',upload.fields([
    { name: 'primaryHistory.investigations.bloodInvestigation.documents', maxCount: 10 },
    { name: 'primaryHistory.investigations.urineInvestigation.documents', maxCount: 10 },
    { name: 'primaryHistory.investigations.ultrasoundInvestigation.documents', maxCount: 10 },
    { name: 'primaryHistory.investigations.xrayInvestigation.documents', maxCount: 10 },
    { name: 'secondaryHistory.investigations.bloodInvestigation.documents', maxCount: 10 },
    { name: 'secondaryHistory.investigations.urineInvestigation.documents', maxCount: 10 },
    { name: 'secondaryHistory.investigations.ultrasoundInvestigation.documents', maxCount: 10 },
    { name: 'secondaryHistory.investigations.xrayInvestigation.documents', maxCount: 10 }
  ]), infertilityCasesController.createInfertilityCase);
router.put('/update', infertilityCasesController.updateInfertilityCase);
router.delete('/remove', infertilityCasesController.deleteInfertilityCase); 
router.get('/all', infertilityCasesController.getAllInfertilityCases); 




module.exports = router;
