const { product } = require('../../config/db.config');
const db = require('../../config/db.config');
const { Op } = require('sequelize');
const Product = db.product;
const Cart = db.cart;
const Checkout = db.checkout;
const History = db.history;
const Joi = require('joi');

exports.addToCart = (req, res) => {
  Cart.create({
    userid: req.user.userid,
    productid: req.body.productid,
    amount: req.body.amount,
  })
    .then((data) => {
      return res.json({ status: 'success' });
    })
    .catch((err) => {
      return res.status(err).json(err);
    });
};
exports.deleteCartByUserid = (req, res) => {
  // return res.json(req.body.userid);
  Cart.destroy({ where: { userid: req.query.userid } })
    .then((num) => {
      return res.json({
        status: 'success',
        message: 'Detele product from cart successfully',
      });
    })
    .catch((err) => {
      return res.status(402).json({ status: 'fail', message: err.message });
    });
};
exports.deleteCheckoutByUserid = (req, res) => {
  // return res.json(req.body.userid);

  Checkout.destroy({ where: { userid: req.query.userid } })
    .then((num) => {
      return res.json({
        status: 'success',
        message: 'Detele product from checkout successfully',
      });
    })
    .catch((err) => {
      return res.status(402).json({ status: 'fail', message: err.message });
    });
};

exports.addToHistory = (req, res) => {
  History.create({
    userid: req.body.userid,
    name: req.body.name,
    phone: req.body.phone,
    address: req.body.address,
    email: req.body.email,
    total: req.body.total,
    discount: req.body.discount,
    note: req.body.note,
    product: req.body.product,
    ordercode: req.body.ordercode,
    paid: req.body.paid,
  })
    .then((data) => {
      return res.json({ status: 'success' });
    })
    .catch((err) => {
      return res.status(err).json(err);
    });
};
exports.getInfoFromCheckout = (req, res) => {
  Checkout.findAll({
    where: { userid: req.params.userid },
    order: [['createdAt', 'DESC']],
  })
    .then((data) => {
      return res.json(data[0]);
    })
    .catch((err) => {
      return res.status(err).json(err);
    });
};
exports.addToCheckout = (req, res) => {
  Checkout.create({
    userid: req.body.userid,
    name: req.body.name,
    phone: req.body.phone,
    address: req.body.address,
    email: req.body.email,
    total: req.body.total,
    discount: req.body.discount,
    note: req.body.note,
    product: req.body.product,
  })
    .then((data) => {
      return res.json({ status: 'success' });
    })
    .catch((err) => {
      return res.status(err).json(err);
    });
};
exports.removeFromCart = (req, res) => {
  Cart.findAll({
    where: {
      userid: req.query.userid,
      productid: req.query.productid,
    },
  })

    .then((data) => {
      if (data.length > 0) {
        Cart.destroy({
          where: { id: data[0].id },
        })
          .then((num) => {
            if (num == 1) {
              return res.json({
                status: 'success',
                message: 'Detele product from cart successfully',
              });
            }
          })
          .catch((err) => {
            return res.status(402).json({ status: 'fail', message: err.message });
          });
      } else {
        return res.status(402).json({ message: 'not Found' });
      }
    })
    .catch((err) => {
      return res.status(403).json({ message: err.message });
    });
};
exports.deleteProduct = (req, res) => {
  const id = req.params.id;
  Product.destroy({
    where: {
      id: id,
    },
  })
    .then((num) => {
      if (num == 1) {
        res.json({
          status: 'success',
        });
      }
    })
    .catch((err) => {
      res.json({
        message: err.message,
      });
    });
};
exports.getProductById = (req, res) => {
  const id = req.params.id;
  Product.findOne({ where: { id } }).then((data) => {
    return res.json({ status: 'success', data: data });
  });
};
exports.getProduct = (req, res) => {
  Product.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(err).json({ err });
    });
};
exports.updateOrder = (req, res) => {
  History.findOne({
    where: {
      id: req.body.orderid,
    },
  })
    .then((data) => {
      data.update({ paid: req.body.paid, status: req.body.status });
      // res.send(data);
      return res.json({ status: 'success', message: 'Update successfully' });
    })
    .catch((err) => {
      res.status(err).json({ err });
    });
};
exports.getOrder = async (req, res) => {
  let sp = [];
  let productsQuery = [];
  let temp = [];
  History.findAll()
    .then(async (data) => {
      if (data.length) {
        let dataTemp = data;
        let length = data.length;
        for (let i = 0; i < length; i++) {
          let arrProducts = [];
          sp = dataTemp[i].product.split('***');
          for (let x = 0; x < sp.length - 1; x++) {
            let a = sp[x].split('/');
            productsQuery = await Product.findOne({
              where: { id: a[0] },
            });
            productsQuery.dataValues.size = a[1];
            productsQuery.dataValues.total = a[2];
            arrProducts.push(productsQuery.dataValues);
          }
          dataTemp[i].dataValues.products = arrProducts;
        }

        return res.json(dataTemp);
      } else {
        return res.json([]);
      }
    })
    .catch((err) => {
      res.status(err).json({ err });
    });
};
exports.getOrderByUserid = async (req, res) => {
  // return res.json(req.params.id);
  let sp = [];
  let productsQuery = [];
  let temp = [];
  History.findAll({
    where: { userid: req.params.id },
  })
    .then(async (data) => {
      if (data.length) {
        let dataTemp = data;
        let length = data.length;
        for (let i = 0; i < length; i++) {
          let arrProducts = [];
          sp = dataTemp[i].product.split('***');
          for (let x = 0; x < sp.length - 1; x++) {
            let a = sp[x].split('/');
            productsQuery = await Product.findOne({
              where: { id: a[0] },
            });
            productsQuery.dataValues.size = a[1];
            productsQuery.dataValues.total = a[2];
            arrProducts.push(productsQuery.dataValues);
          }
          dataTemp[i].dataValues.products = arrProducts;
        }

        return res.json(dataTemp);
      } else {
        return res.json([]);
      }
    })
    .catch((err) => {
      res.status(err).json({ err });
    });
};
exports.cancelOrder = async (req, res) => {
  // return res.json(req.params.id);
  let sp = [];
  let productsQuery = [];
  let temp = [];
  History.findOne({
    where: { id: req.params.id },
  })
    .then((data) => {
      if (data != null) {
        data.update({ status: 'Canceled' });
        return res.json({ status: 'success', message: 'canceled order' });
      } else {
        return res.json({ Status: 'fail', message: 'User not found' });
      }
    })
    .catch((err) => {
      res.status(err).json({ err });
    });
};
exports.Sort = (req, res) => {
  let key = req.params.key;
  Product.findAll({
    order: [['price', key]],
  })
    .then((data) => {
      return res.send(data);
    })
    .catch((err) => {
      return res.status(err).json({ err });
    });
  // return res.json(req.params.key);
};
exports.SortOnSearch = (req, res) => {
  let key = req.params.key;
  let key1 = key.split('-');
  Product.findAll({
    where: {
      productname: {
        [Op.iLike]: '%' + key1[0] + '%',
      },
    },
    order: [['price', key1[1]]],
  })
    .then((data) => {
      return res.send(data);
    })
    .catch((err) => {
      return res.status(err).json({ err });
    });
};
exports.search = (req, res) => {
  let keyword = req.params.keyword.replace('%20', ' ');
  Product.findAll({
    where: {
      productname: {
        [Op.iLike]: '%' + req.params.keyword + '%',
      },
    },
  })
    .then((data) => {
      return res.json({ data });
    })
    .catch((err) => {
      return res.status(err).json(err);
    });
};
exports.findBrand = (req, res) => {
  Product.findAll({
    where: {
      brand: req.params.brand,
    },
  })
    .then((data) => {
      return res.json({ data });
    })
    .catch((err) => {
      return res.status(err).json(err);
    });
};

exports.addOneInCart = (req, res) => {
  const { productid, size, amountChoose, userid } = req.body;
  Cart.findAll({
    where: { userid: req.body.userid },
  })
    .then(async (cart) => {
      if (cart.length > 0) {
        let data = null;
        let products = cart.filter((x) => x.productid == productid && x.size == size);
        if (products.length > 0) {
          let amount = Number(products[0].amount) + 1;
          data = await Cart.update({ amount }, { where: { id: products[0].id } });
          return res.json({ statusss: 'success', data });
        }
      }
      data = await Cart.create({
        userid: req.body.userid,
        productid: req.body.productid,
        amount: req.body.amountChoose,
        size: req.body.size,
      });
      return res.json({ statusss: 'success', data });
    })
    .catch((err) => {
      res.status(err).json({ status: 'fail', message: err });
    });
};
exports.subOneInCart = (req, res) => {
  const { productid, size, amountChoose, userid } = req.body;
  console.log('userid', productid);
  Cart.findAll({
    where: { userid: req.body.userid },
  })
    .then(async (cart) => {
      if (cart.length > 0) {
        let data = null;
        let products = cart.filter((x) => x.productid == productid && x.size == size);
        if (products.length > 0) {
          let amount = Number(products[0].amount) - 1;
          data = await Cart.update({ amount }, { where: { id: products[0].id } });
          return res.json({ statusss: 'success', data });
        }
      }
      data = await Cart.create({
        userid: req.body.userid,
        productid: req.body.productid,
        amount: req.body.amountChoose,
        size: req.body.size,
      });
      return res.json({ statusss: 'success', data });
    })
    .catch((err) => {
      res.status(err).json({ status: 'fail', message: err });
    });
};
exports.getProductFromCart = async (req, res) => {
  // const id = req.params.id;
  console.log('baoser:', req.body.length);
  let data = req.body;
  for (let i = 0; i < data.length; i++) {
    let productsQuery = await Product.findOne({
      where: { id: data[i].productid },
    });
    console.log('step:', productsQuery);
    data[i].products = productsQuery;
  }
  return res.json({ statusss: 'success', data });
};
exports.addProduct = (req, res) => {
  const schema = Joi.object({
    brand: Joi.string().required(),
  });
  data = req.body;
  console.log(data);
  Joi.validate(data, schema, (err, value) => {
    if (err) {
      res.status(422).json({
        status: 'error',
        message: 'Invalid request data',
        data: data,
      });
    } else {
      res.json({
        status: 'success',
        message: 'User created successfully',
        data: Object.assign({ id }, value),
      });
    }
  });
  Product.findOne({
    where: { brand: req.body.brand },
  })
    .then((pro) => {
      if (pro) {
        console.log('ẻ', pro.productcode);
        if (req.body.productcode === pro.productcode) {
          return res.status(401).json({
            status: '401',
            message: 'Your product already have in store',
            data: null,
          });
        }
      }
      Product.create({
        brand: req.body.brand,
        productcode: req.body.productcode,
        price: req.body.price,
        productname: req.body.productname,
        description: req.body.description,
        illustration: req.body.illustration,
        amount: req.body.amount,
      })
        .then((data) => {
          return res.json({ statusCode: 200, message: 'success', data: null });
        })
        .catch((err) => {
          return res.status(err).json(err);
        });
    })
    .catch((err) => {
      res.status(err).json({ status: 'fail', message: err });
    });
};
exports.addProductToCart = (req, res) => {
  const { productid, size, amountChoose, userid } = req.body;
  console.log('userid', productid);
  Cart.findAll({
    where: { userid: req.body.userid },
  })
    .then(async (cart) => {
      if (cart.length > 0) {
        let data = null;
        let products = cart.filter((x) => x.productid == productid && x.size == size);
        if (products.length > 0) {
          let amount = Number(products[0].amount) + amountChoose;
          data = await Cart.update({ amount }, { where: { id: products[0].id } });
          return res.json({ statusss: 'success', data });
        }
      }
      data = await Cart.create({
        userid: req.body.userid,
        productid: req.body.productid,
        amount: req.body.amountChoose,
        size: req.body.size,
      });
      return res.json({ statusss: 'success', data });
    })
    .catch((err) => {
      res.status(err).json({ status: 'fail', message: err });
    });
};
exports.updateProduct = (req, res) => {
  Product.update(req.body, {
    where: { id: req.params.id },
  })
    .then((num) => {
      if (num == 1) {
        res.json({ status: 'success' });
      }
    })
    .catch((err) => {
      return res.status(err).json({ err: err.message });
    });
};
