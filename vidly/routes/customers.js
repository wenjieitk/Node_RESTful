const mongoose = require('mongoose');
const express = require('express');
const {validateCustomer,Customer} = require('../models/customer');
const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find().sort('name');
    res.send(customers);
  } catch (error) {
    console.error(error.message);
    res.status(400).send(error.message);
  }

});


router.post('/', async (req, res,next) => {
  const { error } = validateCustomer(req.body); 
  if (error){
    console.error('Error: Customer-Post\n',error.details[0].message);
    return res.status(400).send(error.details[0].message);
  } 

  try {
    let customer = new Customer({ 
      name: req.body.name,
      isGold: req.body.isGold,
      phone: req.body.phone
    });
    
    customer = await customer.save();
    res.send(customer);
  } catch (error) {
    console.error('Error: Customer-Post\n',error.message);
    res.status(400).send(error.message);
  }
  
});


router.put('/:id', async (req, res) => {
  const { error } = validateCustomer(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id,{
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
      }, { 
        new: true ,
        runValidators: true
      });
      if (!customer) return res.status(404).send('The customer with the given ID was not found.');
      res.send(customer);
  } 
  catch (error) {
    console.error(error.message);
    res.status(400).send(error.message);
  }

});


router.delete('/:id', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if (!customer) return res.status(404).send('The customer with the given ID was not found.');

    res.send(customer);
  } 
  catch (error) {
    console.log(error.message);
    res.status(400).send(error.message);
  }
  
});


router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send('The customer with the given ID was not found.');
  
    res.send(customer);
  } catch (error) {
    console.log(error.message);
    res.status(400).send(error.message);
  }

});




module.exports = router; 