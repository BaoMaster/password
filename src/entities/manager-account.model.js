module.exports = (sequelize, Sequelize) => {
  const Account = sequelize.define("accounts", {
    accountId: {
      type: Sequelize.STRING,
      required: true,
      primaryKey: true,
    },
    userId: {
      type: Sequelize.STRING,
      required: true,
    },
    website: {
      type: Sequelize.STRING,
      required: true,
    },
    account: {
      type: Sequelize.STRING,
      required: true,
    },
    password: {
      type: Sequelize.STRING,
      required: true,
    },
    note: {
      type: Sequelize.STRING,
    },
    isDeleted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  });
  return Account;
};
