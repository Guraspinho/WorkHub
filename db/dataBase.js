const createPool = require('./pool');
const {BadRequestError} = require("../errors/everyError");



const pool = createPool();



// get a company credentials
        
async function getCompanyCredentials(email)
{
    try
    {
        const [rows] = await pool.query(`SELECT name,email,password FROM companies WHERE email = ?;`, [email]);
        return rows[0];
        
    }
    catch (error)
    {
        console.error('Can not get companies',error);
        throw new BadRequestError('Can not get credentials');
        
    }
        
}

async function addSubscriprionPlan(email, subplan)
{
    try
    {
        const result = await pool.query(`UPDATE companies SET subplan = ? WHERE email = ?`, [subplan,email]);
        return result;

    }
    catch (error)
    {
        console.error('Can not get companies',error);
        throw new BadRequestError('Can not add subscription plan');
    }
}

//sign up a company, after signing up, the company gets added to a db, buc can only login after they confirm their email

async function companySignup(name,email,encrypted_email,password,country,industry)
{ 
    try
    {
        const result = await pool.query(`INSERT INTO companies (name,email,encrypted_email,password,country,industry) VALUES (?,?,?,?,?,?)`,
        [name,email,encrypted_email,password,country,industry]);
        return result;
    }
    catch (error)
    {
        console.log('Can not add a company',error);
        throw new BadRequestError('Unable to add a company');
    }
}

// verify the email of the company, after clicking link on a email, the company gets verified;

async function verify(email)
{ 
    try
    {
        const [rows] = await pool.query(`UPDATE companies SET verified = true where encrypted_email = ? `,[email]);
        return rows[0];
    }
    catch (error)
    {
        console.error('Can not verify a company',error);
        throw new BadRequestError('Can not verify a company');
    }
}

// check wther the company has their email verified or not

async function isVerified(email)
{ 
    try
    {
        const result = await pool.query(`SELECT verified from companies where email = (?)`,
        [email]);
        return result;
    }
    catch (error)
    {
        console.error('Company is not verified yet',error);
        throw new BadRequestError('Company is not verified yet');
    }
}



module.exports = 
{
    
    getCompanyCredentials,
    companySignup,
    addSubscriprionPlan,
    isVerified,
    verify
}

// getCompanies();