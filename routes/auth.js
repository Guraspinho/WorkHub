const express = require('express');
const {signup, confirmEmail, login} = require('../controllers/auth');
const {confirmEmployeeEmail, loginEmployees} = require('../controllers/employees');

const router = express.Router();

// company login,signup

router.route('/company/signup').post(signup);
router.route('/company/confirm/:id').get(confirmEmail);
router.route('/company/login').post(login);


// employees login,signup

router.route('/employees/confirm/:id').get(confirmEmployeeEmail);
router.route('/employees/login').post(loginEmployees)



module.exports = router;