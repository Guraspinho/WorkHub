const express = require('express');
const {addFiles} = require('../controllers/employees');
const upload = require('../middlewares/multer');
const router = express.Router();


router.route('/addfile').post(addFiles, async (req,res) =>
{
    try
    {
        const fileData = req.file.buffer;
        const fileName = req.file.originalname; 
        console.log(fileData,fileName);   
    }
    catch (error)
    {
        console.error("error retriving file data", error)    
    }
});

module.exports = router;