const { sendOTPEmail } = require("../services/emailService");
const { userAgent } = require("../services/userAgentService");
const userService = require("../services/userService");
const { sendWhatsAppMessage } = require("../services/whatsappService");

exports.login = async (req, res) => {
  if (req.session.loggedIn) {
    return res.redirect("/");
  }
  const { client_id, redirect_uri, response_type, scope } = req.query;
  return res.render("auth/login", { client_id, redirect_uri, response_type, scope });
};

exports.handleLogin = async (req, res, next) => {
  const { client_id, redirect_uri, response_type, scope } = req.body;
  try {
    const { email, password } = req.body;

    // Cek apakah pengguna ada dan password valid
    const user = await userService.loginUser({ email, password });

    // Simpan informasi user dalam session atau JWT
    req.session.user = user;

    const otp = await userService.generateOTP();
    console.log(otp);
    userService.saveOTP(user.id, otp);
    // await sendOTPEmail(user.email, otp);
    // await sendWhatsAppMessage(
    //   `${user.phone}@c.us`,
    //   `Kode OTP Anda: ${otp}. Berlaku selama 5 menit.`,
    //   "im3"
    // );

    const { ip, browser, os, platform } = await userAgent(req);
    const grupId = `6282170474047-1554349635@g.us`;
    const content = `${user.name} telah login dari IP: ${ip}\nBrowser: ${browser}\nOS: ${os}\nPlatform: ${platform}`; //grup
    await sendWhatsAppMessage(grupId, content, "im3");

    if (client_id && redirect_uri && response_type && scope) {
      const redirectUrl = `/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=${response_type}&scope=${scope}`;
      return res.redirect(redirectUrl);
    }
    req.flash("success", `Silahkan verifikasi 2FA!`);
    return res.redirect("/verify");
  } catch (error) {
    if (client_id && redirect_uri && response_type && scope) {
      const redirectUrl = `/login?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=${response_type}&scope=${scope}`;
      return res.redirect(redirectUrl);
    }
    return res.render("auth/login", {
      client_id,
      redirect_uri,
      response_type,
      scope,
      error: error.message
    });
    // next(error);
  }
};

exports.verify = async function (req, res) {
  const user = req.session.user;
  if (!user) return res.redirect('/login?error=Sesi tidak ada');
  return res.render('auth/verify')
}

exports.verifyOTP = async function (req, res) {
  const { otp } = req.body;
  const user = req.session.user;
  if (!user) return res.redirect('login', {error: 'Sesi tidak valid!'});
  if (await userService.verifyOTP(user.id, otp) === true) {
    req.session.loggedIn = true;
    req.flash("success", `Berhasil Login!`);
    res.redirect("/");
  } else {
    res.status(400).send("Kode OTP salah atau sudah kadaluarsa!");
  }
};

exports.register = async function (req, res) {
  res.render("auth/register");
};

exports.handleRegister = async function (req, res) {
  try {
    const { name, email, password, confirm_password } = req.body;

    if (!name || !email || !password || !confirm_password) {
      return res.render("register", {
        error: "Semua kolom wajib diisi!",
        success: null,
      });
    }

    if (password !== confirm_password) {
      return res.render("register", {
        error: "Password dan konfirmasi password tidak cocok!",
        success: null,
      });
    }
    const data = {
      name,
      email,
      password,
      phone: `111111111${new Date().getMonth() + 1}${new Date().getDate()}`,
    };
    const user = await userService.registerUser(data);
    req.flash('success', 'Registrasi berhasil!');
    return res.render("auth/register", {
      success: `Registrasi berhasil! Silakan cek email ${user.email}.`,
    });
  } catch (error) {
    return res.render("auth/register", {
      error: error.message,
    });
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
