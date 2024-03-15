const express = require('express');
require('dotenv').config();
require('express-async-errors');


// i was not able to finish the task complately, some things still need improvement and little code refactoring,
// but overally authentication of companies as well as employees is 100% done, things left are file upload and 
// subscription plan needs a little update, I think almost every error is handled and security is pretty solid.

//import security packages
const cors = require('cors');
const helmet = require('helmet');
const xssClean = require('xss-clean');
const rateLimiter = require('express-rate-limit');

// routes
const authRouter = require('./routes/auth');
const administratorRouter = require('./routes/administrator');
const employeesRouter = require('./routes/employees');
const fileUploadRouter = require('./routes/fileUpload');

//middlewares
const notFound = require('./middlewares/notFound');
const errorHandlerMiddleware = require('./middlewares/errorHandler');
const authenticationMiddleware = require('./middlewares/authentication');
const upload = require('./middlewares/multer');



const app = express();
app.use(express.json());
app.use(express.static('public'));

// Security packages

app.set('trust proxy', 1);

app.use(
    rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    })
);
app.use(cors());
app.use(helmet());
app.use(xssClean());




app.get('/', (req,res) =>
{
    res.send('zd all')
});


// routes

app.use(authRouter);
app.use(authenticationMiddleware,administratorRouter);
app.use('/employees',employeesRouter);
app.use('/employees',upload.single("File"),fileUploadRouter);




// error handling middlewares
app.use(notFound);
app.use(errorHandlerMiddleware);

const prot = process.env.PORT || 5000;

const start = async () =>
{
    try
    {
        app.listen(prot, () => console.log(`server listening on port ${prot}...`));    
    }
    catch (error)
    {
        console.log(error);    
    }
}

start();

