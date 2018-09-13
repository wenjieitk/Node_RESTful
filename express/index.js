const Joi = require('joi');
const express = require('express');
const courses = require('./routes/courses');
const home = require('./routes/home');
const logger = require('./middleware/logger');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('config'); // export NODE_ENV=production
/**
 * export DEBUG=app:startup
 * DEBUG=app:*
 * DEBUG=app:startup nodemon index.js
 */
const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');

const app = express();

// middleware
app.use(express.json());
app.use('/api/courses', courses);
app.use('/', home);
app.use(express.static('public')); // localhost:3000/readme.txt
app.use(helmet()); // api protection
app.use(logger); // custom middleware
app.set('view engine','pug');// app.set('view', './views')

// env config
console.log('application name : ' + config.get('name'));
console.log('password : ' + config.get('password'));

// if env = development
if(app.get('env') === 'development') {
    app.use(morgan('tiny')); // log/debug the api request
    startupDebugger('Morgan enabled...');
}


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('listening on port ' + port);
});