require('dotenv').config();
const mongoose = require('mongoose');
const Boardgame = require('../api/models/boardgame');
const { scrapper } = require('../utils/scrapper/scrapper');

const url = 'https://boardgamegeek.com/browse/boardgame';
let listOfGames = [];
// La función scrapper devuelve un array de objetos (juegos de mesa) para agregar a la base de datos
scrapper(url, listOfGames).then((gamesArray) => {
  mongoose
    .connect(process.env.DB_URL) //me conecto a la BBDD
    .then(async () => {
      const allBoardgames = await Boardgame.find(); //busco el listado viejo para borrarlo
      if (allBoardgames.length) {
        await Boardgame.collection.drop();
      }
    })
    .catch((err) => console.log(`Error deleting data: ${err}`))
    .then(async () => {
      await Boardgame.insertMany(gamesArray); //subo el listado actualizado
      console.log('Juegos agregados');
    })
    .catch((err) => {
      console.log(`Error creating data: ${err}`);
    })
    .finally(() => mongoose.disconnect()); //me desconecto de la BBDD
});
