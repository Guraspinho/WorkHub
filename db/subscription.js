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



module.exports = 
{
    InsertSubscriptionPlan
}