const uuid = require("uuidv4");

module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define("cart", {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal("uuid_generate_v4()"),
    },
    userid: {
      type: Sequelize.STRING,
      required: true,
    },
    productid: {
      type: Sequelize.STRING,
      required: true,
    },
    size: {
      type: Sequelize.STRING,
    },
    amount: {
      type: Sequelize.INTEGER,
      required: true,
      defaultValue: 1,
    },
  });
  return Product;
};
