const mongoose = require('mongoose');
const Joi = require('joi');
const express = require('express');
const genres = require('./routes/genres');
const customers = require('./routes/customers');


const app = express();

mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost:27017/vidly',{ useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDB..'))
    .catch(err => console.error('Cannot connect to db... ',err));

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));