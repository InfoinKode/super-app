const userService = require("../services/userService");

exports.login = async (req, res) => {
  if (req.session.loggedIn) {
    return res.redirect("/");
  }
  const { client_id, redirect_uri, response_type, scope } = req.query;
  return res.render("login", { client_id, redirect_uri, response_type, scope });
};

exports.handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { client_id, redirect_uri, response_type, scope } = req.body;

    // Cek apakah pengguna ada dan password valid
    const user = await userService.loginUser({ email, password });

    // Simpan informasi user dalam session atau JWT
    req.session.user = user;
    req.session.loggedIn = true;

    if (client_id && redirect_uri && response_type && scope) {
      const redirectUrl = `/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=${response_type}&scope=${scope}`;
      return res.redirect(redirectUrl);
    }
    return res.redirect("/");
  } catch (error) {
    res.status(400).json({ error: error.message || "Invalid credentials" });
  }
};

exports.logout = async function (req, res) {
  req.session.destroy((err) => {
    if (err) {
      return res.send("<h1>Error while logging out</h1>");
    }
    res.redirect("/"); // Setelah logout, redirect ke halaman utama
  });
};
