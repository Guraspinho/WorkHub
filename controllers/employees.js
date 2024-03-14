const { UnauthenticatedError, BadRequestError} = require("../errors/everyError");
const {createJWT,saltPassword,comparePasswords} = require('../middlewares/functions');

const {StatusCodes} = require('http-status-codes');
const {sendEmail} = require('../utils/nodeMailer');

const {
    insertEmployees,
    createPassword,
    removeEmployees,
    findEmployees,
    verify,
    findEmployeesByEmail,
    getEveryEmployee,
    countEmployees } = require('../db/employees');

const {getCompanyId} = require('../db/companies');
const {billingInfo} = require('../db/subscription');

//company can add employees, can delete them. added employees get sent an email, employees can not add edit or delete other employees

// add employees 

const addEmployees = async (req,res) =>
{
    const {name,email} = req.body;

    const {companies_id} = await getCompanyId(req.user.email);

    const employees = await countEmployees(companies_id);

    const info = await billingInfo(companies_id);

    if(info.name === 'basic'|| info.name === 'free' && employees >= info.users+1)
    {
        throw new BadRequestError("Company reached limit of added employees");
    }

   

    if(!name || !email)
    {
        throw new BadRequestError('Please provide user credentials');
    }

    //check if provided values are valid

    if(name.length >= 30 || email.length >= 255)
    {
        throw new BadRequestError('Please provide valid user credentials');
    }

    // check if provided email is valid
    const emailRegex = /^[a-zA-Z0-9._-]+@gmail\.com$/;
    
    if (!emailRegex.test(email))
    {
        throw new BadRequestError('Please provide a valid Gmail address');
    }


    
    // Hash email
    const hashedEmail = await saltPassword(email);
    
    await insertEmployees(name,email,hashedEmail,companies_id);
    
    await sendEmail(email,hashedEmail,'employees');
    
    
    res.status(StatusCodes.OK).json({msg:"Added employee suecessfully"});
}



const getAllImployees = async (req,res) =>
{
    const {companies_id} = await getCompanyId(req.user.email);
    const employees = await getEveryEmployee(companies_id);

    res.status(StatusCodes.OK).json({employees});
}

// email confirmation for employees, if an employee confirms their emal, a value of verified in a db will be set to true
const confirmEmployeeEmail = async (req,res) =>
{
    const {id} = req.params;
    const token = id.substring(1);
    await verify(token);
    res.status(StatusCodes.ACCEPTED).json({ server: {msg: 'email confirmation was suecessful'},token});
}


// log in as an employee
const loginEmployees = async (req,res) =>
{
    const {email,password} = req.body;
    const employeeCredentials = await findEmployeesByEmail(email);

    // checks if administrator added employee or not
    if(employeeCredentials === undefined)
    {
        throw new BadRequestError('Could not find user with provided email');
    }

    const employeePassword = employeeCredentials.password;
    const isVerified = employeeCredentials.verified;

    if(!isVerified)
    {
        throw new UnauthenticatedError('User is not verified');
    }


    if(employeePassword === null)
    {
        
        const hashedPassword = await saltPassword(password);
        await createPassword(hashedPassword,email);
    }
    else
    {
        const isPasswordCorrect = await comparePasswords(password,employeePassword)
        if(!isPasswordCorrect)
        {
            throw new BadRequestError('Email or password is incorrect');
        }
    }
    const token = await createJWT(email);

    res.status(StatusCodes.OK).json({server:{msg: 'welcome'}, token});

}


// delete employees 

const deleteEmployees = async (req,res) =>
{
    const id = req.params.id;
    const credentials = await findEmployees(id);

    if(credentials.length < 1)
    {
        throw new BadRequestError('Unable to find an employee with such id')
    }
    // identify a company which added an employee
    const {companies_id} = await getCompanyId(req.user.email);

    const result = await removeEmployees(id,companies_id);

    if (result[0].affectedRows === 0)
    {
        // If no rows were affected (employee not found or not belonging to the specified company)
        throw new BadRequestError('Employee could not be deleted');
    }
 
    
    res.send('Employee deleted suecessfully');
}

// Section for handling operations on files

const addFiles = async (req,res) =>
{
    res.send('Added a new file')
}

const editFiles = async (req,res) =>
{
    res.send('The file was edited')
}

const getFiles = async (req,res) =>
{
    res.send('Files')
}


module.exports = 
{
    addEmployees,
    deleteEmployees,
    confirmEmployeeEmail,
    loginEmployees,
    addFiles,
    editFiles,
    getFiles,
    getAllImployees
}
