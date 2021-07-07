const db = require('../../../../config/db.config');
const ProductType = db.productType;
const Product = db.product;
const { OkResult, BadRequestResult } = require('../../../middlewares/_base');

const bcrypt = require('bcryptjs');
const mail = require('../../../../helper/mailForRegister');
const shortId = require('shortid');
const { v4: uuidv4 } = require('uuid');

exports.addProductType = async (req, res) => {
  const newId = uuidv4();
  const obj = { id: newId, name: req.body.productTypeName };
  console.log('obj', obj);
  await ProductType.create(obj)
    .then((pro) => {
      return res.send(new OkResult('Add product type successfully', pro));
    })
    .catch((err) => {
      res.status(err).json({ status: 'fail', message: err });
    });
};
exports.updateProductType = (req, res) => {
  const data = req.body;
  console.log('data', data);
  ProductType.update(data, { where: { id: req.params.id } })
    .then((pro) => {
      if (pro) {
        return res.send(new OkResult('Update product type successfully'));
      } else {
        return res.send(new OkResult('Update product type fail'));
      }
    })
    .catch((err) => {
      res.status(err).json({ status: 'fail', message: err });
    });
};
exports.deleteProductType = (req, res) => {
  ProductType.update({ isDeleted: true }, { where: { id: req.params.id } })
    .then(async (pro) => {
      await Product.update({ isDeleted: true }, { where: { type: req.params.id, isDeleted: false } });
      return res.send(new OkResult('Deleted product type successfully'));
    })
    .catch((err) => {
      res.status(err).json({ status: 'fail', message: err });
    });
};
