const express = require('express');
const router = express.Router();
const tryCatchHandler = require('../middleware/async');

const {Movie, validate} = require('../models/Movie');
const {Genre} = require('../models/Genre');

router.get('/', tryCatchHandler(async (req, res) => {
  const movies = await Movie.find().sort('name');
  res.status(200).send(movies);
}));

router.get('/:id', tryCatchHandler(async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if(!movie) res.status(404).send('Movie with the given ID was not found.');
  else res.status(200).send(movie);
}));

router.post('/', tryCatchHandler(async (req, res) => {
  const {error} = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if(!genre) res.status(400).send('Invalid genre.');
  else {
    const movie = new Movie({
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name
      },
      qtyInStock: req.body.qtyInStock,
      dailyRentalRate: req.body.dailyRentalRate
    });
    await movie.save();
    res.status(200).send(movie);
  }
}));

router.put('/:id', tryCatchHandler(async (req, res) => {
  const {error} = validate(req.body); 
  if(error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if(!genre) res.status(400).send('Invalid genre.');
  else {
    const movie = await Movie.findByIdAndUpdate(req.params.id,
      { 
        title: req.body.title,
        genre: {
          _id: genre._id,
          name: genre.name
        },
        qtyInStock: req.body.qtyInStock,
        dailyRentalRate: req.body.dailyRentalRate
      }, { new: true }
    );
    if(!movie) res.status(404).send('Movie with the given ID was not found.');
    else res.status(200).send(movie);
  }
}));

router.delete('/:id', tryCatchHandler(async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);
  if(!movie) res.status(404).send('Movie with the given ID was not found.');
  else res.status(200).send(movie);
}));

module.exports = router;
