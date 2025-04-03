const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const Token = sequelize.define("Token", {
  access_token: {
    type: DataTypes.TEXT,
    allowNull: false,
    primaryKey: true,
  },
  refresh_token: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  client_id: {
    type: DataTypes.STRING(255),
    references: {
      model: "Clients",
      key: "client_id",
    },
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: "Users",
      key: "id",
    },
    allowNull: false,
  },
}, {
  tableName: "tokens",
});

module.exports = Token;
