const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const AuthorizationCode = sequelize.define("AuthorizationCode", {
  code: {
    type: DataTypes.TEXT,
    allowNull: false,
    primaryKey: true,
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  redirect_uri: {
    type: DataTypes.TEXT,
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
  tableName: "authorization_codes",
});

module.exports = AuthorizationCode;
