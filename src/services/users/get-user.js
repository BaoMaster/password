const db = require('../../../config/db.config');
const User = db.user;
const bcrypt = require('bcryptjs');
const mail = require('../../../helper/mailForRegister');
const shortId = require('shortid');
const { Op } = require('sequelize');

exports.getOne = (req, res) => {
  User.findOne({
    where: {
      id: req.params.id,
    },
  }).then((data) => {
    res.send(data);
  });
};

exports.getAll = (req, res) => {
  console.log('rep', req.params.id);
  User.findAll({ where: { isDeleted: false, [Op.not]: { id: req.params.id } } }).then((data) => {
    res.send(data);
  });
};
