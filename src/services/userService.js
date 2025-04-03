const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const sendRegistrationEmail = require("./emailService");
const jwt = require("jsonwebtoken");

exports.registerUser = async function (userData) {
  const { name, email, password, phone } = userData;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) throw { status: 404, message: "Email already exists" };
  const existingPhone = await User.findOne({ where: { phone } });
  if (existingPhone) throw { status: 404, message: "Phone already exists" };

  // Hash password sebelum disimpan
  const passwordHash = await bcrypt.hash(password, 10);

  // Simpan user ke database
  const user = await User.create({
    name,
    email,
    password: passwordHash,
    phone,
  });

  // Kirim email notifikasi
  await sendRegistrationEmail(email, name);

  return user;
};

exports.loginUser = async function (userData) {
  const { email, password } = userData;

  const existingUser = await User.findOne({ where: { email } });

  if (!existingUser) {
    throw { status: 404, message: "User not found" };
  }

  // Periksa apakah password cocok
  const passwordMatch = await bcrypt.compare(password, existingUser.password);

  if (!passwordMatch) {
    throw { status: 401, message: "Invalid credentials" };
  }

  const token = jwt.sign(
    { id: existingUser.id, email: existingUser.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  const user = {
    id: existingUser.id,
    name: existingUser.name,
    email: existingUser.email,
    phone: existingUser.phone,
    token,
  };

  return user;
};

exports.getUsers = async function () {
  return await User.findAll({
    attributes: { exclude: ["password"] },
  });
};

exports.getUserById = async function (userData) {
  // Cek apakah user ada
  const user = await User.findByPk(userData);
  if (!user) {
    throw { status: 404, message: "User not found" };
  }
  return user;
}

exports.updateUser = async function (userData) {
  const { id, name, email, password, phone } = userData;

  // Cek apakah user ada
  const user = await User.findByPk(id);
  if (!user) {
    throw { status: 404, message: "User not found" };
  }

  // Cek apakah email atau nomor telepon sudah digunakan oleh user lain (kecuali jika sama dengan yang saat ini)
  if (email && email !== user.email) {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser && existingUser.id !== id) throw { status: 400, message: "Email already in use" };
  }

  if (phone && phone !== user.phone) {
    const existingPhone = await User.findOne({ where: { phone } });
    if (existingPhone && existingPhone.id !== id) throw { status: 400, message: "Phone already in use" };
  }

  let updatedData = {};
  if (name) updatedData.name = name;
  if (email) updatedData.email = email;
  if (phone) updatedData.phone = phone;
  if (password) {
    updatedData.password = await bcrypt.hash(password, 10);
  }

  await User.update(updatedData, { where: { id } });
  
  // Mengembalikan user yang telah diperbarui
  const updatedUser = await User.findByPk(id, { attributes: { exclude: ["password"] } });
  return updatedUser;
};

exports.deleteUser = async function (id) {
  // Cek apakah user ada
  const user = await User.findByPk(id);
  if (!user) {
    throw { status: 404, message: "User not found" };
  }

  // Hapus user dari database
  await User.destroy({ where: { id } });
  return { message: "User deleted successfully" };
}