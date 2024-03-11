require('dotenv').config();
const mongoose = require('mongoose');
const Boardgame = require('../api/models/boardgame');
const gamesJson = require('../../games.json');
const { scrapper } = require('../utils/scrapper/scrapper');

const url = 'https://boardgamegeek.com/browse/boardgame';
let listOfGames = [];
scrapper(url, listOfGames).then(() => {
  mongoose
    .connect(process.env.DB_URL)
    .then(async () => {
      const allBoardgames = await Boardgame.find();
      if (allBoardgames.length) {
        await Boardgame.collection.drop();
      }
    })
    .catch((err) => console.log(`Error deleting data: ${err}`))
    .then(async () => {
      await Boardgame.insertMany(gamesJson.results);
      console.log('Juegos agregados');
    })
    .catch((err) => {
      console.log(`Error creating data: ${err}`);
    })
    .finally(() => mongoose.disconnect());
});
