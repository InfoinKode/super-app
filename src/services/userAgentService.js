const axios = require('axios');

async function getPublicIP() {
  try {
      const response = await axios.get('https://api64.ipify.org?format=json');
      return response.data.ip;
  } catch (error) {
      console.error('Gagal mengambil IP publik:', error);
      return 'Tidak dapat mengambil IP publik';
  }
}

exports.userAgent = async function (req) {
    const ip = await getPublicIP();
    const browser = req.useragent.browser;
    const os = req.useragent.os;
    const platform = req.useragent.platform;
    return { ip, browser, os, platform }
}