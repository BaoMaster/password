const db = require('../../../config/db.config');
const User = db.user;
const bcrypt = require('bcryptjs');
const mail = require('../../../helper/mailForRegister');
const { OkResult, BadRequestResult } = require('../../middlewares/_base');
const shortId = require('shortid');
const { Op } = require('sequelize');

exports.update = async (req, res) => {
  const id = req.params.id;
  const findUser = await User.findOne({ where: { isDeleted: false, id: id } });
  if (!findUser || findUser.length < 1) {
    return res.send(new BadRequestResult('Your account has been removed from the system', null, 444));
  }
  console.log('id', id);
  await User.findAll({
    where: {
      [Op.or]: [
        {
          username: req.body.username,
        },
        {
          email: req.body.email,
        },
      ],
      [Op.not]: { id: id },
      isDeleted: false,
    },
  }).then(async (resq) => {
    console.log('re', resq);
    if (resq.length) {
      if (resq[0].dataValues.username === req.body.username) {
        res.status(400).send(new BadRequestResult('User Name already exists'));
      }
      console.log(121212);
      if (resq[0].dataValues.phoneNumber === req.body.phoneNumber) {
        console.log(121212);
        res.status(400).send(new BadRequestResult('PhoneNumber already exists'));
      } else {
        console.log(121212);
        return res.status(400).send(new BadRequestResult('User not found'));
      }
    } else {
      await User.update(req.body, {
        where: {
          id,
        },
      })
        .then((num) => {
          if (num == 1) {
            res.send(new OkResult('Update success'));
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(400).send(new BadRequestResult(err));
        });
    }
  });
};
