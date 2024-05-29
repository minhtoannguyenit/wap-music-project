const Song = require('../models/song');

exports.getAll = (req, res, next) => {
  res.status(200).json({status: true, data: Song.getAll(req.query)});
}

exports.add = (req, res, next) => {
  res.status(200).json({status: true, data: Song.add(req.body)});
}

exports.update = (req, res, next) => {
  res.status(200).json({status: true, data: Song.update(req.params.id, req.body)});
}

exports.delete = (req, res, next) => {
  res.status(200).json({status: true, data: Song.delete(req.params.id)});
}