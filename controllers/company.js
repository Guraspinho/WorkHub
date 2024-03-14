// change password 
// edit company credentials

const {getCompanyCredentials} = require('../db/dataBase');
const {updatePassword, editCredentials,getCompanyId} = require('../db/companies');

const {BadRequestError} = require("../errors/everyError");
const {saltPassword,comparePasswords} = require('../middlewares/functions');
const {StatusCodes} = require('http-status-codes');
const {InsertSubscriptionPlan} = require('../db/subscription');
const {countEmployees} = require('../db/employees');

// change password

const changePassword = async (req,res) =>
{
    const {email,oldPassword,newPassword} = req.body;

    const {password} = await(getCompanyCredentials(email));

    const isPasswordCorrect = await comparePasswords(oldPassword,password);
    
    if(!isPasswordCorrect)
    {
        throw new BadRequestError("password is incorrect");
    }

    if(newPassword === oldPassword)
    {
        throw new BadRequestError('Old and new passwords should not match');
    }

    if(newPassword.length < 8)
    {
        throw new BadRequestError('password must contain more than 8 characters');
    }

    const hashedNewPassword = await saltPassword(newPassword);

    await updatePassword(email,hashedNewPassword);
    
    res.status(StatusCodes.OK).json({msg:"Password was updated suecessfully"});
}

// update name, country, industry

const updateCredentials = async  (req,res) =>
{
    const {email,name,country,industry}  = req.body;

    if(name.length >= 20 || country.length > 60 || industry.length > 100)
    {
        throw new BadRequestError('Please provide valid user credentials');
    }
    await editCredentials(email, name, country, industry);
    res.send("Credentials were updated suecessfully");
}


// add subscription plan
const addSubscription = async (req,res) =>
{
    const {plan} = req.body;

    const {companies_id} = await getCompanyId(req.user.email);
    const employees = await countEmployees(companies_id);

    let price;
    let priceByFiles;
    let files;
    let users;

    // check if plan is provided
    if(!plan)
    {
        throw new BadRequestError('Must choose subscription plan');
    }
    
    // check if provided plan is valid
    if(plan !== 'free' && plan !== 'basic' && plan !== 'premium')
    {
        throw new BadRequestError('Please provide valid subscription plan');
    }
    if(plan === 'free')
    {
        price = 0;
        priceByFiles = 0;
        users = 1;
        files = 10;
    }
    if(plan === 'basic')
    {
        price = employees*5;
        priceByFiles = 0;
        files = 100;
        users = 10;
    }
    if(plan === 'premium')
    {
        price = 300
        priceByFiles = 0.5;
        employees = null;
        files = 1000;
    }


    await InsertSubscriptionPlan(plan,price,priceByFiles,files,users,companies_id);
    
    res.send("Added subscription plan")
}


// see all files
const getAllFiles = async (req,res) =>
{
    res.send('All files');
}

// get information about cpmpany's current billing
const getBillingInfo = async (req,res) =>
{
    res.send('Billing info');
}

// edit billing / subscriptionplan
const editBilling = async (req,res) =>
{
    res.send('Edit billing');
}


module.exports = 
{
    changePassword,
    updateCredentials,
    getAllFiles,
    getBillingInfo,
    editBilling,
    addSubscription,

}

// add a subscription plan. get a plan from a req.body, 