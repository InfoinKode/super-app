exports.requireLogin = async function (req, res, next) {
  if (!req.session || !req.session.loggedIn) {
    return res.redirect("/login");
  }
  next();
};

exports.redirectIfLoggedIn = async function (req, res, next) {
  if (req.session && req.session.loggedIn) {
    return res.redirect('back'); // redirect ke halaman sebelumnya
  }
  next(); // lanjut ke route berikutnya jika belum login
}