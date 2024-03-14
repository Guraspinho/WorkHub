const createPool = require('./pool');
const {BadRequestError} = require("../errors/everyError");



const pool = createPool();



// create a password for en employee
async function createPassword(password,email)
{ 
    try
    {
        const result = await pool.query(`UPDATE employees SET password = ? WHERE email = ?`,[password,email]);
        return result;
    }
    catch (error)
    {
        console.error('Unable to login',error);
        throw new BadRequestError('Unable to login');
    }
}


// add employees to a company

async function insertEmployees(name,email,hashedEmail,id)
{ 
    try
    {
        const result = await pool.query(`INSERT INTO employees (name,email,encrypted_email,companies_id) VALUES (?,?,?,?)`,
        [name,email,hashedEmail,id]);
        return result;
    }
    catch (error)
    {
        console.error('Unable to add an employee',error);
        throw new BadRequestError('Unable to add an employee');
    }
}

// verify employee email
async function verify(email)
{ 
    try
    {
        const [rows] = await pool.query(`UPDATE employees SET verified = true where encrypted_email = ? `,[email]);
        return rows[0];
    }
    catch (error)
    {
        console.error('Can not verify an employee',error);
        throw new BadRequestError('Can not verify an employee');
    }
}



// remove employees from a company

async function removeEmployees(id,companyId)
{ 
    try
    {
        const result = await pool.query(`DELETE FROM employees where employees_id = (?) AND companies_id = (?)`,
        [id,companyId]);
        return result;
    }
    catch (error)
    {
        console.log('Unable to delete an employee',error);
        throw new BadRequestError('Can not delete an employee');
    }
}

async function findEmployees(id)
{ 
    try
    {
        const result = await pool.query(`SELECT * FROM employees where employees_id = (?)`,
        [id]);
        return result[0];
    }
    catch (error)
    {
        console.log('Unable to get an employee',error);
        throw new BadRequestError('Can not find an employee');
    }
}


async function findEmployeesByEmail(email)
{ 
    try
    {
        const result = await pool.query(`SELECT * FROM employees where email = (?)`,
        [email]);
        return result[0][0];
    }
    catch (error)
    {
        console.log('Unable to get an employee',error);
        throw new BadRequestError('Can not find an employee');
    }
}

// see all the employees
async function getEveryEmployee(id)
{
    try
    {
        const result = await pool.query(`SELECT email,name FROM employees WHERE companies_id = ?`,[id]);
        return result[0];
    }
    catch (error)
    {
        console.log('Unable to get employees',error);
        throw new BadRequestError('Can not get employees');
    }
}

// count employees in a current table
async function countEmployees(id)
{
    try
    {
        const [rows] = await pool.query(`SELECT COUNT(*) AS row_count FROM employees WHERE companies_id = ?`,[id]);
        const rowCount = rows[0].row_count;
        return rowCount;
    }
    catch (error)
    {
        console.error("Error counting rows",error);
        throw new BadRequestError('Error counting rows');

    }
}


module.exports = 
{
    insertEmployees,
    createPassword,
    removeEmployees,
    findEmployees,
    verify,
    findEmployeesByEmail,
    getEveryEmployee,
    countEmployees
} 

