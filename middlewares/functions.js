const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// generate JWT
async function createJWT(email,name)
{
    return jwt.sign({email: email, name: name}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME});
}


//sign email address

async function signEmail(email)
{
    return jwt.sign({email: email}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EMAIL_LIFETIME});
}



// encrypt the password

async function saltPassword(password)
{
    const salt = await bcrypt.genSalt(11);
    const hashedPassword = await bcrypt.hash(password,salt)
    return hashedPassword;
}

// compare provided password to the one that is in the db.

async function comparePasswords(candidatePassword,password)
{
    const isMatch = await bcrypt.compare(candidatePassword,password);
    return isMatch
}




module.exports = 
{
    createJWT,
    saltPassword,
    comparePasswords,
    signEmail
}
