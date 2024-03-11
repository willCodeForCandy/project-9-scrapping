const deleteFileFromCloudinary = require('../../utils/deleteFromCloudinary');
const { generateSign } = require('../../utils/jwt');
const Publisher = require('../models/publisher');
const bcrypt = require('bcrypt');

const getPublishers = async (req, res, next) => {
  try {
    const allPublishers = await Publisher.find().populate(
      'publishedGames',
      'name'
    );
    return res.status(200).json(allPublishers);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const getPublisherByName = async (req, res, next) => {
  try {
    const { name } = req.params;
    const requestedPublisher = await Publisher.findOne({ name }).populate(
      'publishedGames',
      'name'
    );
    requestedPublisher
      ? res.status(200).json(requestedPublisher)
      : res.status(404).json('Game not found 💔');
  } catch (error) {
    return res.status(400).json(error);
  }
};

const postPublisher = async (req, res, next) => {
  try {
    const existingPublisher = await Publisher.findOne({
      name: req.body.name
    });
    if (existingPublisher) {
      return res.status(400).json('Ese editor ya está registrado');
    }

    const newPublisher = new Publisher(req.body);
    if (req.file) {
      newPublisher.img = req.file.path;
    }
    const savedPublisher = await newPublisher.save();
    return res.status(201).json(savedPublisher);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const editPublisher = async (req, res, next) => {
  try {
    const { id } = req.params;
    const newPublisher = new Publisher(req.body);
    const existingPublisher = await Publisher.findById(id);
    newPublisher._id = id;

    newPublisher.publishedGames = [
      ...existingPublisher.publishedGames,
      ...newPublisher.publishedGames
    ];

    if (req.file) {
      newPublisher.img = req.file.path;
      if (existingPublisher.img) {
        deleteFileFromCloudinary(existingPublisher.img);
      }
    }
    const updatedPublisher = await Publisher.findByIdAndUpdate(
      id,
      newPublisher,
      {
        new: true
      }
    );
    return res.status(200).json({
      message: 'Editor actualizado correctamente',
      usuario: updatedPublisher
    });
  } catch (error) {
    return res.status(400).json(error);
  }
};

const deletePublisher = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedPublisher = await Publisher.findByIdAndDelete(id);
    if (deletedPublisher.img) {
      deleteFileFromCloudinary(deletedPublisher.img);
    }
    deletedPublisher
      ? res.status(200).json({ mensaje: 'Editor eliminado', deletedPublisher })
      : res.status(404).json('Dato no encontrado');
  } catch (error) {
    return res.status(400).json(error);
  }
};

module.exports = {
  postPublisher,
  editPublisher,
  deletePublisher,
  getPublishers,
  getPublisherByName
};
