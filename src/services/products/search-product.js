const db = require("../../../config/db.config");
const Product = db.product;

const bcrypt = require("bcryptjs");
const mail = require("../../../helper/mailForRegister");
const { OkResult, BadRequestResult } = require("../../middlewares/_base");

exports.searchProductByName = async (req, res) => {
  const allProduct = await Product.findAll({ where: { isDeleted: false } });
  // console.log("all", allProduct);
  const product = allProduct.map((x) => ({
    productId: x.productId,
    brand: x.brand,
    productname: x.productname,
    size: x.size,
    productcode: x.productcode,
    illustration: x.illustration,
    description: x.description,
    price: x.price,
    amount: x.amount,
  }));
  // console.log("product", product);
  let productFinded = [];
  const nameSplit = req.body.name.split(" ");
  for (const it of product) {
    for (let i = 0; i < nameSplit.length; i++) {
      if (it.productname.toLowerCase().includes(nameSplit[i].toLowerCase())) {
        productFinded.push(it);
      }
    }
  }
  const data = new Set(productFinded);
  return res.send(new OkResult("Search product successfully", productFinded));
};
