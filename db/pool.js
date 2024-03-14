const mysql = require('mysql2');
const { UnauthenticatedError, BadRequestError} = require("../errors/everyError");

// Function to create and return MySQL connection pool
function createPool() {
    try
    {
        const pool = mysql.createPool(
            {
                host: process.env.DATABASE_HOST,
                user: process.env.DATABASE_USER,
                password:process.env.DATABASE_PASSWORD,
                database: process.env.DATABASE
            }
        ).promise();
    
        return pool;    
    } 
    catch (error)
    {
        console.error(error);    
    }

}

module.exports = createPool; 