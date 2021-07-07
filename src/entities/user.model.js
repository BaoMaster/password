const uuid = require("uuidv4");

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal("uuid_generate_v4()"),
    },
    username: {
      type: Sequelize.STRING,
      require: true,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      require: true,
      allowNull: false,
    },
    avatar: {
      type: Sequelize.STRING,
    },
    phoneNumber: {
      type: Sequelize.STRING,
    },
    address: {
      type: Sequelize.STRING,
    },
    dayOfBirth: {
      type: Sequelize.DATE,
    },
    role: {
      type: Sequelize.STRING,
      defaultValue: "ADMIN",
    },
    password: {
      type: Sequelize.STRING,
      require: true,
      allowNull: false,
    },
    question1: {
      type: Sequelize.STRING,
      require: true,
      allowNull: false,
    },
    answer1: {
      type: Sequelize.STRING,
      require: true,
      allowNull: false,
    },
    question2: {
      type: Sequelize.STRING,
      require: true,
      allowNull: false,
    },
    answer2: {
      type: Sequelize.STRING,
      require: true,
      allowNull: false,
    },
    codeforverify: {
      type: Sequelize.STRING,
      defaultValue: "",
    },
    idverify: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    isDeleted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  });
  return User;
};
