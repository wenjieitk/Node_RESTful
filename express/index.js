const Joi = require('joi');
const express = require('express');
const app = express();

// middleware
app.use(express.json());

const courses = [
    {id:1, name: 'course1'},
    {id:2, name: 'course2'},
    {id:3, name: 'course3'}
];


app.get('/', (req,res) => {
    res.send('hello world');
});


app.get('/api/courses/:id',(req,res) => {
    const result = courses.find(course => course.id === parseInt(req.params.id));

    if(!result)
        res.status(404).send('wrong id')
    
    res.send(result);
});

app.post('/api/courses',(req, res) => {
    const schema= {
        name: Joi.string().min(3).required()
    };
    const result = Joi.validate(req.body,schema);
    if(result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    

    const course = {
        id: courses.length +1,
        name: req.body.name
    };

    courses.push(course);
    res.send(course);
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('listening on port ' + port);
});