const express = require('express');
const {editFiles,getFiles} = require('../controllers/employees');

const router = express.Router();


router.route('/editfile').patch(editFiles);
router.route('/getfiles').get(getFiles);

module.exports = router;