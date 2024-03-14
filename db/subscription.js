const createPool = require('./pool');
const {BadRequestError} = require("../errors/everyError");

const pool = createPool();

async function InsertSubscriptionPlan(name,price,priceByFiles,files,users,id)
{
    try
    {
        const result = await pool.query(`INSERT INTO subscription_plans (name,price,priceByFiles,files,users,companies_id) VALUES (?,?,?,?,?,?)`,
        [name,price,priceByFiles,files,users,id]);
        return result;
    }
    catch (error)
    {
        console.log('Can not insert plan into a db',error);
        throw new BadRequestError('Unable to add a plan');
    }
}

async function billingInfo(id)
{
    try
    {
        const [result] = await pool.query(`SELECT * FROM subscription_plans WHERE companies_id = ?`,[id]);
        return result[0];
    }
    catch (error)
    {
        console.log('error occured while trying to get billing information',error);
        throw new BadRequestError('Could not retrieve billing info');
    }
}


// count employees in a current table
async function countSubplan(id)
{
    try
    {
        const [rows] = await pool.query(`SELECT COUNT(*) AS row_count FROM subscription_plans WHERE companies_id = ?`,[id]);
        const rowCount = rows[0].row_count;
        return rowCount;
    }
    catch (error)
    {
        console.error("Error counting rows",error);
        throw new BadRequestError('Error counting rows');

    }
}

// edit current subscription plan

async function editSubplan(name,price,priceByFiles,files,users,id)
{
    try
    {
        const result = await pool.query(`UPDATE subscription_plans SET name=?, price=?, priceByFiles=?, files=?, users=? WHERE companies_id = ?`,
        [name,price,priceByFiles,files,users,id]);
        return result;

    }
    catch (error)
    {
        console.error('An error occured while trying to update subscription plan',error);
        throw new BadRequestError('An error occured while trying to update subscription plan');
    }
}





module.exports = 
{
    InsertSubscriptionPlan,
    billingInfo,
    countSubplan,
    editSubplan

}