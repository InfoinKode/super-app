const axios = require("axios");

const WA_API_URL = process.env.WA_API_URL;

/**
 * Mengirim pesan WhatsApp ke pengguna atau grup.
 * @param {string} chatId - ID chat (misalnya: `628xxxxxxx@c.us` untuk pengguna atau `628xxxxxx-xxxx@g.us` untuk grup).
 * @param {string} content - Isi pesan yang akan dikirim.
 * @param {string} session - Isi pesan yang akan dikirim.
 * @returns {Promise<void>}
 */

exports.sendWhatsAppMessage = async function (chatId, content, session) {
  try {
    const waPayload = {
      chatId,
      contentType: "string",
      content,
    };
    const response = await axios.post(
      `${WA_API_URL}/client/sendMessage/${session}/`,
      waPayload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      console.log(
        "✅ Pesan WhatsApp terkirim:",
        response.data.message.body,
        `\n📩 Ke: ${response.data.message.to}`
      );
    } else {
      console.error(
        "⚠️ Gagal mengirim pesan WhatsApp, status:",
        response.status
      );
    }
  } catch (error) {
    console.error("❌ Gagal mengirim pesan WhatsApp:", error.message);
  }
};

exports.sessionStatus = async function (session) {
  const response = await axios.get(`${WA_API_URL}/session/status/${session}/`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.data.success === true) {
    console.log("✅ Session WhatsApp:", response.data.state);
  } else {
    console.error("⚠️ Session WhatsApp, status:", response.data.message);
  }
};

exports.getContacts = async function (session) {
  const response = await axios.get(`${WA_API_URL}/client/getContacts/${session}/`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.data.success === true) {
    console.log("✅ Contacts WhatsApp:", response.data.contacts);
  } else {
    console.error("⚠️ Contacts WhatsApp, status:", response.data.message);
  }
};
