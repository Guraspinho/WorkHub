const { UnauthenticatedError, BadRequestError} = require("../errors/everyError");
const {createJWT,saltPassword,comparePasswords} = require('../middlewares/functions');

const {StatusCodes} = require('http-status-codes');
const {sendEmail} = require('../utils/nodeMailer');
const {companySignup, getCompanyCredentials, isVerified ,verify} = require('../db/dataBase');



// I finally completed signup
// also checking for errors in a controller

const signup = async (req,res) =>
{   


    const {name,email,password,country,industry} = req.body;

    if(!name || !email || !password || !country || !industry)
    {
        throw new BadRequestError('Please provide user credentials');
    }

    //check if provided values are valid

    if(name.length >= 20 || email.length >= 255 || password.length < 8 || country.length > 60 || industry.length > 100)
    {
        throw new BadRequestError('Please provide valid user credentials');
    }

    // check if provided email is valid
    const emailRegex = /^[a-zA-Z0-9._-]+@gmail\.com$/;

    if (!emailRegex.test(email))
    {
        throw new BadRequestError('Please provide a valid Gmail address');
    }


    //checks if user with such credentials exists or not
    const userCredentials = await getCompanyCredentials(email);

    if(userCredentials != undefined)
    {
        throw new BadRequestError('Email already in use');
    }

    // Hash the password for safety
    const saltedPassword = await saltPassword(password);


    const hashedEmail = await saltPassword(email);

 
    companySignup(name,email,hashedEmail,saltedPassword,country,industry);

    // send a verificarion link
    
    await sendEmail(email,hashedEmail,'company');
    res.status(StatusCodes.CREATED).json({ msg:'Signup Suecessful', sugnup:'Please verify your Email'});
  
};

// confirm email whenn signing up

const confirmEmail = async (req,res) => 
{
    const {id} = req.params;
    const token = id.substring(1);
    await verify(token);
    res.status(StatusCodes.ACCEPTED).json({ user: {msg: 'email confirmation was suecessful'},token});
}


// Log in for companies.

const login = async (req,res) =>
{
    
    // extracts email and password from req.body
    const {email,password} = req.body;
    
    
    // checks if email and password are provided
    if(!email || !password)
    {
        throw new BadRequestError('Please provide User credentials');
    }
    const userCredentials = await getCompanyCredentials(email);    


    // checks wether user with provided credentials exist
    if(!userCredentials)
    {
        throw new UnauthenticatedError('User with provided email does not exist');
    }

    // check wether email is verified or not
    const isEmailVerified = await isVerified(email);

    if(isEmailVerified[0][0].verified !== 1)
    {
        throw new UnauthenticatedError('Email is not confirmed');
    }


    const passwordFromDB = userCredentials.password;


    //checks if the password is correct
    const isPasswordCorrect = await comparePasswords(password,passwordFromDB);
    if(!isPasswordCorrect)
    {
        throw new UnauthenticatedError('Provided password is incorrect');
    }

    const payloadName = userCredentials.name;
    const payloadEmail = userCredentials.email;

    const token = await createJWT(payloadEmail,payloadName);

    
    // returns username and jwt
    res.status(StatusCodes.OK).json({username: userCredentials.name,token});
}



module.exports = 
{
    signup,
    login,
    confirmEmail,
};