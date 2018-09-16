const mongoose = require('mongoose');
const express = require('express');
const {Genre,validateGenre} = require('../models/genres');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const genres = await Genre.find().sort('name');
    res.send(genres);
  } catch (error) {
    console.error(error.message);
    res.status(400).send(error.message);
  }

});

router.post('/', async (req, res) => {
  const { error } = validateGenre(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  try {
    let genre = new Genre({ name: req.body.name });
    genre = await genre.save();
    
    res.send(genre);
  } catch (error) {
    console.error(error.message);
    res.status(400).send(error.message);
  }


});

router.put('/:id', async (req, res) => {
  const { error } = validateGenre(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
      new: true,
      runValidators: true
    });
    if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  
    res.send(genre);
  } 
  catch (error) {
    console.error(error.message);
    res.status(400).send(error.message);
  }

  
});

router.delete('/:id', async (req, res) => {
  try {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  
    res.send(genre);
  } 
  catch (error) {
    console.error(error.message);
    res.status(400).send(error.message);
  }

});

router.get('/:id', async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  
    res.send(genre);
  } catch (error) {
    console.error(error.message);
    res.status(400).send(error.message);
  }

});

module.exports = router;