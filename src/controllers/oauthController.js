const oauthService = require("../services/oauthService");

exports.authorize = async (req, res) => {
  try {
    const { client_id, redirect_uri, response_type, scope } = req.query;

    // Validasi clientId dan redirectUri
    if (!client_id) {
      return res.status(400).json({ error: "client_id are required" });
    }
    if (!redirect_uri) {
      return res.status(400).json({ error: "redirect_uri are required" });
    }
    if (!response_type) {
      return res.status(400).json({ error: "response_type are required" });
    }
    if (!scope) {
      return res.status(400).json({ error: "scope are required" });
    }

    // Validasi apakah clientId terdaftar
    // const client = await oauthService.validateClient(clientId);
    // if (!client) {
    //   return res.status(404).json({ error: "Client not found" });
    // }

    // Validasi Redirect URI
    // const isValidRedirectUri = await oauthService.validateRedirectUri(clientId, redirectUri);
    // if (!isValidRedirectUri) {
    //   return res.status(400).json({ error: "Invalid redirect URI for this client" });
    // }

    // Arahkan pengguna untuk login jika belum login
    if (!req.session.loggedIn) {
      return res.redirect(`/login?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=${response_type}&scope=${scope}`);
    }
    // Misalnya, jika user sudah login, lanjutkan ke langkah berikutnya
    const authorizationCode = await oauthService.generateAuthorizationCode(client_id, req.session.user.id, redirect_uri);
    
    // Redirect ke aplikasi pihak ketiga dengan authorization code
    return res.redirect(`${redirect_uri}?code=${authorizationCode}`);
  } catch (error) {
    console.error("Error during authorization:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

exports.token = async (req, res) => {
  try {
    const { grant_type, client_id, client_secret, redirect_uri, code } = req.body;

    // Validasi parameter
    if (!grant_type) {
      return res.status(400).json({ error: "grant_type are required" });
    }
    if (!client_id) {
      return res.status(400).json({ error: "client_id are required" });
    }
    if (!client_secret) {
      return res.status(400).json({ error: "client_secret are required" });
    }
    if (!redirect_uri) {
      return res.status(400).json({ error: "redirect_uri are required" });
    }
    if (!code) {
      return res.status(400).json({ error: "code are required" });
    }

    // Validasi apakah clientId terdaftar
    // const client = await oauthService.validateClient(clientId);
    // if (!client) {
    //   return res.status(404).json({ error: "Client not found" });
    // }

    // Validasi secret client
    // if (client.client_secret !== clientSecret) {
    //   return res.status(400).json({ error: "Invalid client secret" });
    // }

    // Tukar authorization code dengan token
    const tokenData = await oauthService.exchangeAuthorizationCode(code, client_id, client_secret);

    // Kirimkan token akses dan refresh token ke aplikasi pihak ketiga
    return res.status(200).json({
      access_token: tokenData.access_token,
      token_type: "Bearer",
      expires_in: 3600, // 1 jam
      refresh_token: tokenData.refresh_token,
    });
  } catch (error) {
    console.error("Error during token exchange:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
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


