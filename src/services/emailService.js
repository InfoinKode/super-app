const transporter = require("../config/emailConfig");

/**
 * Mengirim email notifikasi pendaftaran sukses
 * @param {string} to - Email tujuan
 * @param {string} name - Nama pengguna
 */
exports.sendRegistrationEmail = async function (to, name) {
  try {
    const mailOptions = {
      from: `${process.env.APP_NAME} <${process.env.EMAIL_USER}>`,
      to,
      subject: "Registration Successful",
      html: `<h2>Welcome, ${name}!</h2>
             <p>Thank you for registering on our platform. We're excited to have you with us.</p>
             <p>Best Regards,<br>Your App Team</p>`
    };

    await transporter.sendMail(mailOptions);
    console.log(`Registration email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

exports.sendOTPEmail = async function (to, otp) {
  try {
    const mailOptions = {
      from: `${process.env.APP_NAME} <${process.env.EMAIL_USER}>`,
      to,
      subject: "Kode OTP Anda",
      html: `<h2>Hallo</h2>
             <p>Kode OTP Anda adalah: ${otp}. Berlaku selama 5 menit.</p>
             <p>Best Regards,<br>Your App Team</p>`
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
