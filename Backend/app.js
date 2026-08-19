const express = require('express');
const morgan = require('morgan');
require('dotenv').config();
const authRoutes = require('./routes/auth.route');
const userRoutes = require('./routes/user.route');
const movieRoutes = require('./routes/movie.route');
const favoriteRoutes = require('./routes/favorite.route');
const reviewRoutes = require('./routes/review.route');
const app = express();
app.use(express.json());
if (process.env.NODE_ENV === 'development' || true) {
  app.use(morgan('dev'));
}
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'MovieHub API Server is running smoothly!' });
});
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/reviews', reviewRoutes);
app.all('*splat', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});
module.exports = app;
