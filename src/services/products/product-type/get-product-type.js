const db = require('../../../../config/db.config');
const ProductType = db.productType;
const Product = db.product;
const { OkResult, BadRequestResult } = require('../../../middlewares/_base');

const bcrypt = require('bcryptjs');
const mail = require('../../../../helper/mailForRegister');
const shortId = require('shortid');
const { v4: uuidv4 } = require('uuid');

exports.getProductType = (req, res) => {
  ProductType.findAll({
    attributes: ['id', 'name'],
    where: { isDeleted: false },
  })
    .then((pro) => {
      return res.send(new OkResult('Get product type successfully', pro));
    })
    .catch((err) => {
      res.status(err).json({ status: 'fail', message: err });
    });
};
