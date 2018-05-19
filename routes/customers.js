const express = require('express');
const router = express.Router();
const tryCatchHandler = require('../middleware/async');

const {Customer, validate} = require('../models/Customer');

router.get('/', tryCatchHandler(async (req, res) => {
  const customers = await Customer.find().sort('name').select({__v:0});
  res.send(customers);
}));

router.post('/', tryCatchHandler(async (req, res) => {
  const {error} = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  const customer = new Customer({
    name: req.body.name, 
    phone: req.body.phone,
    isGold: req.body.isGold
  });
  await customer.save();
  res.status(200).send(customer);
}));

router.put('/:id', tryCatchHandler(async (req, res) => {
  const {error} = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  const customer = await Customer
    .findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true, select: {'__v':0}});
  if (!customer) return res.status(404).send('The customer with the given ID was not found.');
  res.send(customer);
}));

router.delete('/:id', tryCatchHandler(async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id, {select: {'__v':0}});
  if (!customer) return res.status(404).send('The customer with the given ID was not found.');
  res.send(customer);
}));

router.get('/:id', tryCatchHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id, '-__v');
  if (!customer) return res.status(404).send('The customer with the given ID was not found.');
  res.send(customer);
}));

module.exports = router;
