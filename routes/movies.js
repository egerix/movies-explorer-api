const router = require('express').Router();
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');
const validators = require('../utils/validators');

router.get('/movies', getMovies);
router.post('/movies', validators.createMovie, createMovie);
router.delete('/movies/:movieId', validators.deleteMovie, deleteMovie);

module.exports = router;
