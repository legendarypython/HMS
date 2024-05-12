const express = require('express');
const router = express.Router();
const anteNatalCaseController = require('../controllers/antenatalCaseController');
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
router.get('/getById', anteNatalCaseController.getAnteNatalCaseById);
router.get('/getByPatientId', anteNatalCaseController.getAnteNatalCaseByPatientId);
router.post('/create',upload.fields([
    { name: 'investigations.bloodInvestigation.documents', maxCount: 10 },
    { name: 'investigations.urineInvestigation.documents', maxCount: 10 },
    { name: 'investigations.ultrasoundInvestigation.documents', maxCount: 10 },
    { name: 'investigations.xrayInvestigation.documents', maxCount: 10 }
  ]), anteNatalCaseController.createAnteNatalCase);
router.put('/update', anteNatalCaseController.updateAnteNatalCase);
router.delete('/remove', anteNatalCaseController.deleteAnteNatalCase);
router.get('/all', anteNatalCaseController.getAllAnteNatalCases);



module.exports = router;
