// authRoutes.js
const express = require('express');
const router = express.Router();
const documentsController = require('../controllers/documentsController');
// Authentication routes
router.post('/create', documentsController.createDocument);
router.get('/:id', documentsController.getDocumentById);
router.get('/getByPatientId', documentsController.getDocumentByPatientId); 


module.exports = router;
