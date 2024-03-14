const createPool = require('./pool');
const {BadRequestError} = require("../errors/everyError");



const pool = createPool();



async function updatePassword(email, password)
{
    try
    {
        const result = await pool.query(`UPDATE companies SET password = ? WHERE email = ?`, [password,email]);
        return result;

    }
    catch (error)
    {
        console.error('Can not update password',error);
        throw new BadRequestError('Can not update password');
    }
}

async function editCredentials(email, name, country, industry)
{
    try
    {
        let query = `UPDATE companies SET `;
        const values = [];
        if (name)
        {
            query += 'name = ?, ';
            values.push(name);
        }
        
        if (country)
        {
            query += 'country = ?, ';
            values.push(country);
        }
        
        if (industry) {
            query += 'industry = ?, ';
            values.push(industry);
        }
        query = query.slice(0, -2);

        // Add the WHERE clause
        query += ' WHERE email = ?';
        values.push(email);

        const result = await pool.query(query, values);
        return result;

    }
    catch (error)
    {
        console.error('Can not update credentials',error);
        throw new BadRequestError('Something went wrong, can not update credentials');
    }
}

// get company id;
async function getCompanyId(email)
{
    try
    {
        const result = await pool.query(`SELECT companies_id FROM companies WHERE email = ?`,[email])
        return result[0][0];
    }
    catch (error)
    {
        console.error('can not get company id',error)
        throw new BadRequestError('Something went wrong, can not get company id');
    }
}
module.exports = 
{
    updatePassword,
    editCredentials,
    getCompanyId
};

