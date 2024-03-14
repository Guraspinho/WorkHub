const express = require('express');
const {
    changePassword,
    updateCredentials,
    getAllFiles,
    getBillingInfo,
    editBilling,
    addSubscription,
    } = require('../controllers/company');

const {addEmployees,deleteEmployees, getAllImployees} = require('../controllers/employees');

const router = express.Router();

//update credentials and a password
router.route('/company/edit').patch(updateCredentials);
router.route('/company/resetpassword/:id').patch(changePassword);

// get, add and delete employees 
router.route('/employees/add').post(addEmployees);
router.route('/employees/:id').delete(deleteEmployees);
router.route('/employees').get(getAllImployees);

// subscription and billing
router.route('/company/billing').get(getBillingInfo).patch(editBilling);
router.route('/company/subscription').post(addSubscription);

// get all files
router.route('/company/files').get(getAllFiles);



module.exports = router;