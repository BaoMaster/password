const db = require('../../../config/db.config');
const User = db.user;
const Order = db.order;
const bcrypt = require('bcryptjs');
const mail = require('../../../helper/mailForRegister');
const { OkResult, BadRequestResult } = require('../../middlewares/_base');
const shortId = require('shortid');
const { Op } = require('sequelize');

exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  const allUser = await User.findAll({ where: { isDeleted: false } });
  const findUser = await allUser.find((x) => x.id === id);
  if (findUser) {
    await User.update({ isDeleted: true }, { where: { id: findUser.id } }).then(async (result) => {
      const order = await Order.findAll({ where: { isDeleted: false, customerId: id } });
      if (order.length > 0) {
        for (const i of order) {
          await Order.update({ status: 'userDeleted' }, { where: { orderId: i.orderId, [Op.not]: { status: 'delivered' } } });
        }
      }
      return res.send(new OkResult('Deleted user successfully'));
    });
  } else {
    return res.send(new BadRequestResult("Can't find user"));
  }
};
