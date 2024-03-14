const nodemailer = require('nodemailer');

//email verification



async function sendEmail(email, text, route)
{
    const emailContent = `<a href="http://localhost:5000/${route}/confirm/:${encodeURIComponent(text)}"><button>Confirm your email </button></a>`

    const transporter = nodemailer.createTransport(
    {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: 
        {
            user: process.env.USER,
            pass: process.env.PASSWORD
        }
    });

    const emailOptions = 
    {
        from: ' irakli <effypowered@gmail.com>',
        to: email,
        subject: 'Email Verification',
        html: emailContent
    }

    try
    {
        const info = await transporter.sendMail(emailOptions);
        console.log('email sent', info.messageId);
    } 
    catch (error)
    {
        console.log(`error sending email ${error}`)    
    }
    

}



module.exports = 
{
    sendEmail
}