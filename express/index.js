const express = require('express');
const app = express();

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


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('listening on port ' + port);
});