const express = require('express');
const morgan = require('morgan');
require('dotenv').config();
const authRoutes = require('./routes/auth.route');
const userRoutes = require('./routes/user.route');
const movieRoutes = require('./routes/movie.route');
const favoriteRoutes = require('./routes/favorite.route');
const reviewRoutes = require('./routes/review.route');
const globalError = require('./middlewares/globalError');
const AppError = require('./utils/AppError');

const app = express();
app.use(express.json());
if (process.env.NODE_ENV === 'development' || true) {
  app.use(morgan('dev'));
}
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'MovieHub API Server is running smoothly!' });
});
app.get('/', (req, res) => {
  res.send('Welcome to MovieHub API');
});
app.get('/favicon.ico', (req, res) => res.status(204).end());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/reviews', reviewRoutes);

app.use((req, res, next) => {
  next(new AppError(404, `Can't find ${req.originalUrl} on this server!`));
});

app.use(globalError);

module.exports = app;
