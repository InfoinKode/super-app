const { registerUser, loginUser, getUsers, updateUser, deleteUser } = require("../services/userService");

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
    next(error); // Serahkan error ke middleware
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
    next(error); // Serahkan error ke middleware
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
    next(error); // Serahkan error ke middleware
  }
};

/** ✅ UPDATE - Update User */
exports.updateUser = async (req, res, next) => {
  try {
    const user = await updateUser(req.body);
    return res.json({
      status: "success",
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    next(error); // Serahkan error ke middleware
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
    next(error); // Serahkan error ke middleware
  }
};
