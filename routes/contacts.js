const express = require('express');
const router = express.Router();
const contactsController = require('../controllers/contactsController');


router.post('/add', contactsController.addContacts);


module.exports = router;