const boardgameRouter = require('./boardgame');
const publisherRouter = require('./publisher');
const userRoutes = require('./user');
const mainRouter = require('express').Router();

mainRouter.use('/users', userRoutes);
mainRouter.use('/boardgames', boardgameRouter);
mainRouter.use('/publishers', publisherRouter);

module.exports = mainRouter;
