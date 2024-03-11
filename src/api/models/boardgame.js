const mongoose = require('mongoose');

const boardgameSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, required: true },
    releaseYear: Number,
    img: [{ type: String, trim: true }],
    minPlayers: Number,
    maxPlayers: Number,
    rating: Number,
    publisher: {
      type: mongoose.Types.ObjectId,
      ref: 'Publisher'
    },
    price: Number
  },
  { timestamps: true, collection: 'boardgames' }
);

const Boardgame = mongoose.model('Boardgame', boardgameSchema);

module.exports = Boardgame;
