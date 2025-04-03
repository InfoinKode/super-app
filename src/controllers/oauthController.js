const oauthService = require("../services/oauthService");

/**
 * Mendapatkan Authorization Code
 */
exports.authorize = async (req, res) => {
  try {
    const { clientId, userId, redirectUri } = req.body;

    // Validasi parameter
    if (!clientId || !userId || !redirectUri) {
      return res.status(400).json({ error: "clientId, userId, and redirectUri are required" });
    }

    const authCode = await oauthService.generateAuthorizationCode(clientId, userId, redirectUri);
    res.status(200).json({ authorization_code: authCode });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || "Internal Server Error" });
  }
};

/**
 * Mendapatkan Token
 */
exports.token = async (req, res) => {
  try {
    const { code, clientId, clientSecret } = req.body;

    // Validasi parameter
    if (!code || !clientId || !clientSecret) {
      return res.status(400).json({ error: "code, clientId, and clientSecret are required" });
    }

    const tokenData = await oauthService.exchangeAuthorizationCode(code, clientId, clientSecret);
    res.status(200).json(tokenData);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || "Internal Server Error" });
  }
};

/**
 * Revoke Token
 */
exports.revokeToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    // Validasi parameter
    if (!refreshToken) {
      return res.status(400).json({ error: "refreshToken is required" });
    }

    await oauthService.revokeToken(refreshToken);
    res.status(200).json({ message: "Token revoked successfully" });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || "Internal Server Error" });
  }
};
