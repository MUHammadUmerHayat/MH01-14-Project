const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Fawn = require('fawn');
const tryCatchHandler = require('../middleware/async');

const {Rental, validate} = require('../models/Rental'); 
const {Movie} = require('../models/Movie'); 
const {Customer} = require('../models/Customer');

Fawn.init(mongoose);

router.get('/', tryCatchHandler(async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut');
  res.status(200).send(rentals);
}));

router.get('/:id', tryCatchHandler(async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if(!rental) res.status(404).send('The rental with the given ID was not found.');
  else res.status(200).send(rental);
}));

router.post('/', tryCatchHandler(async (req, res) => {
  const {error} = validate(req.body); 
  if(error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if(!customer) return res.status(400).send('Invalid customer.');

  const movie = await Movie.findById(req.body.movieId);
  if(!movie) return res.status(400).send('Invalid movie.');

  if(movie.qtyInStock === 0) return res.status(400).send('Movie not in stock.');

  let rental = new Rental({ 
    customer: {
      _id: customer._id,
      name: customer.name, 
      phone: customer.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });
  
  new Fawn.Task()
          .save('rentals', rental)
          .update('movies', {_id: movie._id}, {$inc: {qtyInStock: -1}})
          .run();
  res.status(200).send(rental);
}));

module.exports = router;
