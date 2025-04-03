const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const Client = sequelize.define("Client", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  client_id: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  client_secret: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  data_uris: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  grants: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: "clients",
});

module.exports = Client;
