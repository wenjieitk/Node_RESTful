const Joi = require('joi');
const express = require('express');
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
/**
 * static assetes
 * localhost:3000/
 */
app.use(express.static('public'));
app.use(helmet()); // api protection
app.use(logger); // custom function
app.set('view engine','pug');// app.set('view', './views')

// env config
console.log('application name : ' + config.get('name'));
console.log('password : ' + config.get('password'));

if(app.get('env') === 'development') {
    app.use(morgan('tiny')); // log/debug the api request
    startupDebugger('Morgan enabled...');
}

const courses = [
    {id:1, name: 'course1'},
    {id:2, name: 'course2'},
    {id:3, name: 'course3'}
];


app.get('/', (req,res) => {
    res.render('index',{
        title: 'PUG',
        message: 'Hello'
    });
});


app.get('/api/courses/:id',(req,res) => {
    const course = courses.find(course => course.id === parseInt(req.params.id));
    if(!course)
        res.status(404).send('wrong id')
    
    res.send(result);
});


app.post('/api/courses',(req, res) => {
    const {error} = validateCourse(req.body);
    if(error) {
        return res.status(400).send(error.details[0].message);
    }
    
    const course = {
        id: courses.length +1,
        name: req.body.name
    };

    courses.push(course);
    res.send(course);
});


app.put('/api/courses/:id',(req,res) =>{
    const course = courses.find(course => course.id === parseInt(req.params.id));
    if(!course){
        return res.status(404).send('wrong id');
    }
    
    const {error} = validateCourse(req.body);
    if(error) {
        return res.status(400).send(error.details[0].message);
    }

    course.name = req.body.name;
    res.send(course);
});


app.delete('/api/courses/:id',(req,res) => {
    const course = courses.find(course => course.id === parseInt(req.params.id));
    if(!course)
        return res.status(404).send('wrong id');
    
    const index = courses.indexOf(course);
    courses.splice(index,1);

    res.send(courses);
});


function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(course,schema);
}


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('listening on port ' + port);
});