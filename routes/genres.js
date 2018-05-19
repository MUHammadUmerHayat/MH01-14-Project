const express = require('express');
const router = express.Router();
const validateObjectId = require('../middleware/validateObjectId');

const {Genre, validate} = require('../models/Genre');
const tryCatchHandler = require('../middleware/async');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', tryCatchHandler(async (req, res) => {
  const genres = await Genre.find().sort('name').select({__v:0});
  res.send(genres);
}));

router.post('/', auth, tryCatchHandler(async (req, res) => {
  const {error} = validate(req.body); 
  if(error) return res.status(400).send(error.details[0].message);
  const genre = new Genre({name: req.body.name});
  await genre.save();
  res.status(200).send(genre);
}));

router.put('/:id', auth, tryCatchHandler(async (req, res) => {
  const {error} = validate(req.body); 
  if(error) return res.status(400).send(error.details[0].message);
  const genre = await Genre
    .findByIdAndUpdate(req.params.id, {name: req.body.name}, {new: true, select: {'__v':0}});
  if(!genre) res.status(404).send('The genre with the given ID was not found.');
  else res.send(genre);
}));

router.delete('/:id', [auth, admin], tryCatchHandler(async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id, {select: {'__v':0}});
  if(!genre) res.status(404).send('The genre with the given ID was not found.');
  else res.send(genre);
}));

router.get('/:id', validateObjectId, tryCatchHandler(async (req, res) => {
  const genre = await Genre.findById(req.params.id, '-__v');
  if(!genre) res.status(404).send('The genre with the given ID was not found.');
  else res.send(genre);
}));

module.exports = router;
