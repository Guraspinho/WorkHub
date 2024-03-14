const jwt = require('jsonwebtoken');
const {UnauthenticatedError} = require('../errors/everyError');
const {isVerified, verify} = require('../db/dataBase');


const auth = async (req,res,next) =>
{
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer '))
    {   
        throw new UnauthenticatedError('Authentication invalid');
    }
    const token = authHeader.split(' ')[1];

    try
    {
        const payload =  await jwt.verify(token, process.env.JWT_SECRET);
        req.user = {email: payload.email, name:payload.name};
        next();    
    }
    catch (error)
    {
        console.error('Authentication invalid', error);
        throw new UnauthenticatedError('Authentication invalid');       
    }
}

module.exports = auth;

// file upload
// change rights for a file
// get files for administrator
// get files for employees
// get billing 