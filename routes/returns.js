const express = require('express');
const router = express.Router();
const Joi = require('joi');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const {Rental} = require('../models/Rental');
const {Movie} = require('../models/Movie');

const validateReturn = (req) => {
  const schema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  };
  return Joi.validate(req, schema);
};

router.post('/', [auth, validate(validateReturn)], async (req, res) => {
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);
  if(!rental) return res.status(404).send('No rental found.');
  if(rental.dateReturned) return res.status(400).send('Return already processed.');
  rental.return();
  await rental.save();
  await Movie.findByIdAndUpdate(req.body.movieId, {$inc: {qtyInStock: 1}});
  return res.status(200).send(rental);
});

module.exports = router;
