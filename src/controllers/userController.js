const { registerUser, loginUser, getUsers, updateUser, deleteUser, getUserById } = require("../services/userService");

/** ✅ CREATE - Registrasi User */
exports.registerUser = async function (req, res, next) {
  try {
    const userRegister = await registerUser(req.body);
    return res.status(201).json({
      status: "success",
      message: "User created successfully. Check your email for confirmation.",
      data: userRegister,
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        status: "error",
        message: error.message,
      });
    }
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

/** ✅ CREATE - Login User */
exports.loginUser = async function (req, res, next) {
  try {
    const userLogin = await loginUser(req.body);
    return res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        token: userLogin.token,
        user: {
          id: userLogin.id,
          name: userLogin.name,
          email: userLogin.email,
          phone: userLogin.phone,
        },
      },
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        status: "error",
        message: error.message,
      });
    }
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

/** ✅ READ - Ambil Semua User */
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await getUsers();
    return res.status(200).json({
      status: "success",
      message: "Catch all users successful",
      data: users,
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        status: "error",
        message: error.message,
      });
    }
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

/** ✅ UPDATE - Update User */
exports.updateUser = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    const user = await updateUser({ id: req.user.id, name, email, password, phone });
    return res.json({
      status: "success",
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        status: "error",
        message: error.message,
      });
    }
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

/** ✅ DELETE - Hapus User */
exports.deleteUser = async (req, res, next) => {
  try {
    const result = await deleteUser(req.user.id);
    return res.status(200).json({
      status: "success",
      message: "User deleted successfully",
      data: result,
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        status: "error",
        message: error.message,
      });
    }
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

exports.getUserData = async (req, res) => {
  try {
    // Ambil data user menggunakan ID
    const user = await getUserById(req.user.id);

    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        status: "error",
        message: error.message,
      });
    }
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};
