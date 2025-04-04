const AuthorizationCode = require("../models/authorizationCodeModel");
const Client = require("../models/clientModel");
const Token = require("../models/tokenModel");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

exports.generateAuthorizationCode = async (clientId, userId, redirectUri) => {
  const code = uuidv4();
  await AuthorizationCode.create({
    code,
    expires_at: new Date(Date.now() + 600000), // 10 menit
    redirect_uri: redirectUri,
    client_id: clientId,
    user_id: userId,
  });
  return code;
};

exports.exchangeAuthorizationCode = async (code, clientId, clientSecret) => {
  const authCode = await AuthorizationCode.findOne({ where: { code } });
  if (!authCode || authCode.client_id !== clientId) {
    throw new Error("Invalid authorization code");
  }
  
  const accessToken = jwt.sign({ id: authCode.user_id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  const refreshToken = uuidv4();
  await Token.create({
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_at: new Date(Date.now() + 3600000),
    client_id: clientId,
    user_id: authCode.user_id,
  });
  return { access_token: accessToken, refresh_token: refreshToken };
};

/**
 * Revoke Token - Menghapus token berdasarkan refresh token
 */
exports.revokeToken = async (refreshToken) => {
  const token = await Token.findOne({ where: { refresh_token: refreshToken } });
  
  if (!token) {
    throw new Error("Refresh token not found");
  }

  // Hapus token dari database
  await Token.destroy({ where: { refresh_token: refreshToken } });

  return { message: "Token revoked successfully" };
};