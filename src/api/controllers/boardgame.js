const deleteFileFromCloudinary = require('../../utils/deleteFromCloudinary');
const Boardgame = require('../models/boardgame');

const getBoardgames = async (req, res, next) => {
  try {
    const allBoardgames = await Boardgame.find().populate('publisher', 'name');
    return res.status(200).json(allBoardgames);
  } catch (error) {
    return res.status(400).json(error);
  }
};
const getBoardgameByNumberOfPlayers = async (req, res, next) => {
  try {
    const { players } = req.params;
    console.log(req.params);
    const requestedBoardgames = await Boardgame.find({
      maxPlayers: { $lte: Number(players) }
    }).populate('publisher', 'name');
    requestedBoardgames.length
      ? res.status(200).json(requestedBoardgames)
      : res
          .status(204)
          .json('No hay juegos que coincidan con tu criterio de búsqueda');
  } catch (error) {
    return res.status(400).json(error);
  }
};
const postBoardgame = async (req, res, next) => {
  try {
    const existingBoardgame = await Boardgame.findOne({
      title: req.body.title
    });
    if (existingBoardgame) {
      return res
        .status(400)
        .json(`${existingBoardgame.title} ya está en la base de datos.`);
    }
    // Si no encuentra otro juego con el mismo nombre, entonces creo el dato nuevo y proceso las imágenes
    const newBoardgame = new Boardgame(req.body);
    if (req.files) {
      req.files.forEach((file) => {
        newBoardgame.img.push(file.path);
      });
    }
    const savedBoardgame = await newBoardgame.save();
    return res.status(201).json(savedBoardgame);
  } catch (error) {
    return res.status(400).json(error);
  }
};
const editBoardgame = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existingBoardgame = await Boardgame.findById(id);
    const newBoardgame = new Boardgame(req.body);
    newBoardgame._id = id;
    if (req.file) {
      newBoardgame.img.push(req.file.path);
    }
    newBoardgame.img = [...existingBoardgame.img, ...newBoardgame.img];
    const updatedBoardgame = await Boardgame.findByIdAndUpdate(
      id,
      newBoardgame,
      {
        new: true
      }
    ).populate('publisher', 'name');
    return res.status(200).json({
      message: 'Juego actualizado correctamente',
      game: newBoardgame
    });
  } catch (error) {
    return res.status(400).json(error);
  }
};
const deleteBoardgame = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedBoardgame = await Boardgame.findByIdAndDelete(id);

    deletedBoardgame.img.forEach((url) => {
      deleteFileFromCloudinary(url);
    });

    if (deletedBoardgame) {
      return res
        .status(200)
        .json({ mensaje: 'Juego eliminado', deletedBoardgame });
    } else {
      return res.status(404).json('Juego no encontrado');
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

module.exports = {
  postBoardgame,
  editBoardgame,
  deleteBoardgame,
  getBoardgames,
  getBoardgameByNumberOfPlayers
};
