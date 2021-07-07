module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define('products', {
    productId: {
      type: Sequelize.UUID,
      required: true,
      primaryKey: true,
    },
    brand: {
      type: Sequelize.STRING,
      required: true,
    },
    productname: {
      type: Sequelize.STRING,
      required: true,
    },
    size: {
      type: Sequelize.JSONB,
    },
    color: {
      type: Sequelize.JSONB,
    },
    type: {
      type: Sequelize.UUID,
      required: true,
    },
    productcode: {
      type: Sequelize.STRING,
      required: true,
    },
    illustration: {
      type: Sequelize.JSONB,
      required: true,
    },
    description: {
      type: Sequelize.TEXT,
      required: true,
    },
    price: {
      type: Sequelize.STRING,
      required: true,
    },
    amount: {
      type: Sequelize.INTEGER,
      required: true,
    },
    rating: {
      type: Sequelize.JSONB,
    },
    isDeleted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  });
  return Product;
};
