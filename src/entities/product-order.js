const User = require('./user.model');

module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define('orders', {
    orderId: {
      type: Sequelize.STRING,
      required: true,
      primaryKey: true,
    },
    productInfo: {
      type: Sequelize.JSONB,
      required: true,
    },
    customerId: {
      type: Sequelize.STRING,
      required: true,
    },
    total: {
      type: Sequelize.STRING,
      required: true,
    },
    paymentMethods: {
      type: Sequelize.STRING,
      required: true,
    },
    status: {
      type: Sequelize.STRING,
      defaultValue: 'waiting-verify',
    },
    isPaid: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    address: {
      type: Sequelize.STRING,
      required: true,
    },
    phone: {
      type: Sequelize.TEXT,
      required: true,
    },
    note: {
      type: Sequelize.STRING,
      required: false,
    },
    isDeleted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  });
  //   Order(User, { foreignKey: "id", as: "users" });

  return Order;
};
